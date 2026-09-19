import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  CheckCircle2, AlertTriangle, Wrench, Lock,
  Droplets, Thermometer, FlaskConical, TestTube, Waves, Shield, Bell, Globe
} from 'lucide-react';
import { telemetryService } from '../../services/api';
import SupervisorAuth from '../../components/SupervisorAuth';
import usePushNotifications from '../../hooks/usePushNotifications';

const SensorCard = ({ icon: Icon, label, value, unit, status }) => {
  const { t } = useTranslation();
  return (
    <div className="w-[47%] sm:w-[30%] md:w-auto md:flex-1 bg-card border border-border rounded-xl p-3 shadow-sm flex flex-col items-center justify-center transition-shadow hover:shadow-md">
      <div className="p-1.5 bg-blue-50/50 rounded-full mb-1">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <p className="text-muted text-[10px] font-semibold uppercase tracking-wider mb-0.5">{label}</p>
      <div className="flex items-baseline gap-1">
        <span className="text-xl font-bold text-text">
          {value !== null && value !== undefined ? value : '--'}
        </span>
        <span className="text-muted font-medium text-[10px]">{unit}</span>
      </div>
      <div className={`mt-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase ${
        status === 'NORMAL' ? 'bg-green-100 text-green-700' :
        status === 'WARNING' ? 'bg-yellow-100 text-yellow-700' :
        status === 'CRITICAL' ? 'bg-red-100 text-red-700' :
        'bg-slate-100 text-slate-700'
      }`}>
        {status === 'NORMAL' ? t('safe') : status === 'WARNING' ? t('warning') : status === 'CRITICAL' ? t('critical') : t('unknown')}
      </div>
    </div>
  );
};

export default function HomePage() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [isStale, setIsStale] = useState(false);
  const { isSubscribed, isLoading, toggleSubscription } = usePushNotifications();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const { t, i18n } = useTranslation();

  const languages = [
    { code: 'hi', label: 'Hindi' },
    { code: 'en', label: 'English' },
    { code: 'sat', label: 'Santhali' },
    { code: 'bn', label: 'Bengali' },
    { code: 'khr', label: 'Khortha/Nagpuri' }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await telemetryService.getLatest();
        if (response.data) {
          setData(response.data);
          
          // Check if data is stale (> 2 mins old)
          const dataTime = new Date(response.data.timestamp || response.data.createdAt).getTime();
          const now = new Date().getTime();
          setIsStale((now - dataTime) > 2 * 60 * 1000);
          
          setLastUpdated(new Date());
        }
      } catch (error) {
        console.error("Failed to fetch telemetry", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSupervisorAuth = () => {
    navigate('/supervisor/dashboard');
  };

  // Determine active status card
  let activeStatus = 'SAFE'; // default
  
  if (!data) {
    activeStatus = 'NO_DATA';
  } else if (isStale || data.sensors?.flowIn === 0) {
    activeStatus = 'MAINTENANCE';
  } else if (data.systemState === 'WARNING' || data.systemState === 'CRITICAL') {
    activeStatus = 'UNSAFE';
  } else if (data.systemState === 'PASS' || data.systemState === 'NORMAL') {
    activeStatus = 'SAFE';
  }

  const getSensorStatus = (val, thresholds) => {
    if (val === null || val === undefined) return 'UNKNOWN';
    if (val > thresholds.critMax || val < thresholds.critMin) return 'CRITICAL';
    if (val > thresholds.warnMax || val < thresholds.warnMin) return 'WARNING';
    return 'NORMAL';
  };

  const statusConfig = {
    SAFE: {
      cardClass: 'bg-green-50 border-green-500',
      iconBgClass: 'bg-green-100',
      iconClass: 'text-green-600',
      titleClass: 'text-green-700',
      title: t('status_safe_title', { defaultValue: 'SAFE' }),
      desc: t('status_safe_desc', { defaultValue: 'Water quality is optimal' }),
      Icon: CheckCircle2,
      pulse: false
    },
    UNSAFE: {
      cardClass: 'bg-red-50 border-red-500',
      iconBgClass: 'bg-red-100',
      iconClass: 'text-red-600',
      titleClass: 'text-red-700',
      title: t('status_unsafe_title', { defaultValue: 'UNSAFE' }),
      desc: t('status_unsafe_desc', { defaultValue: 'Contamination detected' }),
      Icon: AlertTriangle,
      pulse: true
    },
    MAINTENANCE: {
      cardClass: 'bg-orange-50 border-orange-400',
      iconBgClass: 'bg-orange-100',
      iconClass: 'text-orange-500',
      titleClass: 'text-orange-600',
      title: t('status_maintenance_title', { defaultValue: 'MAINTENANCE' }),
      desc: t('status_maintenance_desc', { defaultValue: 'System check required' }),
      Icon: Wrench,
      pulse: false
    },
    NO_DATA: {
      cardClass: 'bg-card border-border',
      iconBgClass: 'bg-slate-200',
      iconClass: 'text-muted',
      titleClass: 'text-muted',
      title: t('status_nodata_title', { defaultValue: 'NO DATA' }),
      desc: t('status_nodata_desc', { defaultValue: 'Waiting for device telemetry...' }),
      Icon: AlertTriangle,
      pulse: false
    }
  };

  const currentStatus = statusConfig[activeStatus];
  const StatusIcon = currentStatus.Icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-sky-100 to-blue-200 flex flex-col font-sans">
      
      {/* TOP HEADER */}
      <header className="bg-navy text-white px-4 sm:px-8 py-4 flex justify-between items-center shadow-md z-10 shrink-0">
        <div className="flex items-center">
          <Droplets 
            onClick={() => setShowAuth(true)} 
            className="text-aqua w-8 h-8 mr-3 cursor-pointer hover:scale-105 transition-transform" 
          />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">JalRakshak</h1>
            <p className="text-slate-100 text-xs font-medium tracking-widest uppercase">{t('public_dashboard')}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={toggleSubscription}
            disabled={isLoading}
            title={isLoading ? t('loading') : isSubscribed ? t('notifications_on') : t('enable_notifications')}
            className="relative p-2 rounded-full text-slate-300 hover:bg-white/10 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-50"
          >
            <Bell className="w-5 h-5" /> 
            {isSubscribed && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full border-2 border-navy"></span>
            )}
          </button>
          <div className="relative">
            <button 
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="relative p-2 rounded-full text-slate-300 hover:bg-white/10 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/20"
              title="Change Language"
            >
              <Globe className="w-5 h-5" />
            </button>
            {isLangOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-slate-200 z-50 overflow-hidden">
                <div className="py-1">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      className={`block w-full text-left px-4 py-2 text-sm hover:bg-slate-100 hover:text-slate-900 ${i18n.language === lang.code ? 'bg-slate-50 text-blue-600 font-medium' : 'text-slate-700'}`}
                      onClick={() => {
                        i18n.changeLanguage(lang.code);
                        setIsLangOpen(false);
                      }}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Status Section */}
          <section>
            <h2 className="text-lg font-semibold text-navy mb-4">{t('overall_system_status')}</h2>
            
            <div className={`rounded-xl p-6 flex items-center transition-all border-2 shadow-sm ${currentStatus.cardClass} ${currentStatus.pulse ? 'animate-pulse' : ''}`}>
              <div className={`p-4 rounded-full mr-4 ${currentStatus.iconBgClass}`}>
                <StatusIcon className={`w-8 h-8 ${currentStatus.iconClass}`} />
              </div>
              <div>
                <h3 className={`text-xl font-bold ${currentStatus.titleClass}`}>{currentStatus.title}</h3>
                <p className="text-sm text-muted">{currentStatus.desc}</p>
              </div>
            </div>

            {isStale && (
              <div className="mt-4 p-4 bg-orange-50 rounded-lg border border-orange-200 text-orange-700 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-3" />
                {t('warning_sensor_stale')}
              </div>
            )}
          </section>

          {/* Telemetry Section */}
          <section>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 mb-4">
              <h2 className="text-xl font-bold text-navy shrink-0">{t('live_telemetry_readings')}</h2>
              {lastUpdated && (
                <div className="flex flex-col items-start sm:items-end bg-card px-3 py-1.5 rounded-lg border border-border shadow-sm">
                  {data && (data.timestamp || data.createdAt) && (
                    <p className="text-slate-700 text-sm font-medium mb-1 flex items-center">
                      <span className="text-muted font-normal mr-1">{t('sensor_time')}</span> 
                      {new Date(data.timestamp || data.createdAt).toLocaleString()}
                    </p>
                  )}
                  <p className="text-muted text-[11px] font-semibold uppercase tracking-wider flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 shadow-[0_0_4px_rgba(34,197,94,0.8)]"></span>
                    {t('frontend_synced')} {lastUpdated.toLocaleTimeString()}
                  </p>
                </div>
              )}
            </div>
            
            <div className="flex flex-wrap justify-center gap-3">
              <SensorCard 
                icon={Droplets} 
                label={t('turbidity')} 
                value={data?.sensors?.turbidityOut} 
                unit="NTU" 
                status={getSensorStatus(data?.sensors?.turbidityOut, {warnMin:-1, warnMax:5, critMin:-1, critMax:10})} 
              />
              <SensorCard 
                icon={Thermometer} 
                label={t('temperature')} 
                value={data?.sensors?.temperature} 
                unit="°C" 
                status={getSensorStatus(data?.sensors?.temperature, {warnMin:10, warnMax:35, critMin:5, critMax:45})} 
              />
              <SensorCard 
                icon={FlaskConical} 
                label={t('ph_level')} 
                value={data?.sensors?.ph} 
                unit="pH" 
                status={getSensorStatus(data?.sensors?.ph, {warnMin:6.5, warnMax:8.5, critMin:5.5, critMax:9.5})} 
              />
              <SensorCard 
                icon={TestTube} 
                label={t('tds')} 
                value={data?.sensors?.tds} 
                unit="ppm" 
                status={getSensorStatus(data?.sensors?.tds, {warnMin:-1, warnMax:300, critMin:-1, critMax:500})} 
              />
              <SensorCard 
                icon={Waves} 
                label={t('flow_rate')} 
                value={data?.sensors?.flowIn} 
                unit="L/min" 
                status={data?.sensors?.flowIn === 0 ? 'CRITICAL' : getSensorStatus(data?.sensors?.flowIn, {warnMin:1.0, warnMax:999, critMin:-1, critMax:999})} 
              />
            </div>
          </section>
          
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-800 text-slate-400 py-3 px-6 text-center text-xs shrink-0 shadow-inner mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-1.5 opacity-90">
            <Droplets className="w-4 h-4 text-sky-400" />
            <span className="font-semibold text-slate-200 tracking-wide">JalRakshak</span>
          </div>
          <p className="opacity-80">&copy; {new Date().getFullYear()} JalRakshak Platform. All rights reserved.</p>
        </div>
      </footer>

      {showAuth && (
        <SupervisorAuth 
          onClose={() => setShowAuth(false)}
          onAuthSuccess={handleSupervisorAuth}
        />
      )}
    </div>
  );
}
