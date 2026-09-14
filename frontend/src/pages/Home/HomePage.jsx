import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, AlertTriangle, Wrench, Lock,
  Droplets, Thermometer, FlaskConical, TestTube, Waves, Shield, Bell
} from 'lucide-react';
import { telemetryService } from '../../services/api';
import SupervisorAuth from '../../components/SupervisorAuth';
import usePushNotifications from '../../hooks/usePushNotifications';

const SensorCard = ({ icon: Icon, label, value, unit, status }) => (
  <div className="bg-card border border-border rounded-xl p-4 shadow-sm flex flex-col items-center justify-center transition-shadow hover:shadow-md">
    <div className="p-2 bg-card rounded-full mb-2">
      <Icon className="w-5 h-5 text-primary" />
    </div>
    <p className="text-muted text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-1">{label}</p>
    <div className="flex items-baseline gap-1">
      <span className="text-2xl font-bold text-text">
        {value !== null && value !== undefined ? value : '--'}
      </span>
      <span className="text-muted font-medium text-xs">{unit}</span>
    </div>
    <div className={`mt-2 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold tracking-wider uppercase ${
      status === 'NORMAL' ? 'bg-green-100 text-green-700' :
      status === 'WARNING' ? 'bg-yellow-100 text-yellow-700' :
      status === 'CRITICAL' ? 'bg-red-100 text-red-700' :
      'bg-slate-100 text-slate-700'
    }`}>
      {status || 'UNKNOWN'}
    </div>
  </div>
);

export default function HomePage() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [isStale, setIsStale] = useState(false);

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

  const { isSubscribed, isLoading, toggleSubscription } = usePushNotifications();

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
      title: 'SAFE',
      desc: 'Water quality is optimal',
      Icon: CheckCircle2,
      pulse: false
    },
    UNSAFE: {
      cardClass: 'bg-red-50 border-red-500',
      iconBgClass: 'bg-red-100',
      iconClass: 'text-red-600',
      titleClass: 'text-red-700',
      title: 'UNSAFE',
      desc: 'Contamination detected',
      Icon: AlertTriangle,
      pulse: true
    },
    MAINTENANCE: {
      cardClass: 'bg-orange-50 border-orange-400',
      iconBgClass: 'bg-orange-100',
      iconClass: 'text-orange-500',
      titleClass: 'text-orange-600',
      title: 'MAINTENANCE',
      desc: 'System check required',
      Icon: Wrench,
      pulse: false
    },
    NO_DATA: {
      cardClass: 'bg-card border-border',
      iconBgClass: 'bg-slate-200',
      iconClass: 'text-muted',
      titleClass: 'text-muted',
      title: 'NO DATA',
      desc: 'Waiting for device telemetry...',
      Icon: AlertTriangle,
      pulse: false
    }
  };

  const currentStatus = statusConfig[activeStatus];
  const StatusIcon = currentStatus.Icon;

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      
      {/* TOP HEADER */}
      <header className="bg-navy text-white px-8 py-4 flex justify-between items-center shadow-md z-10 shrink-0">
        <div className="flex items-center">
          <Droplets 
            onClick={() => setShowAuth(true)} 
            className="text-aqua w-8 h-8 mr-3 cursor-pointer hover:scale-105 transition-transform" 
          />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">JalRakshak</h1>
            <p className="text-slate-100 text-xs font-medium tracking-widest uppercase">Public Dashboard</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={toggleSubscription}
            disabled={isLoading}
            className={`${isSubscribed ? 'bg-muted hover:bg-slate-600' : 'bg-primary hover:bg-blue-600'} text-white flex items-center gap-2 text-sm font-medium transition-colors px-5 py-2.5 rounded-lg shadow-sm disabled:opacity-50`}
          >
            <Bell className={`w-4 h-4 ${isSubscribed ? 'fill-current text-yellow-400' : ''}`} /> 
            {isLoading ? 'Loading...' : isSubscribed ? 'Notifications On' : 'Enable Notifications'}
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Status Section */}
          <section>
            <h2 className="text-lg font-semibold text-navy mb-4">Overall System Status</h2>
            
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
                Warning: Sensor data is stale. Check device connection.
              </div>
            )}
          </section>

          {/* Telemetry Section */}
          <section>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 mb-4">
              <h2 className="text-xl font-bold text-navy shrink-0">Live Telemetry Readings</h2>
              {lastUpdated && (
                <div className="flex flex-col items-start sm:items-end bg-card px-3 py-1.5 rounded-lg border border-border shadow-sm">
                  {data && (data.timestamp || data.createdAt) && (
                    <p className="text-slate-700 text-sm font-medium mb-1 flex items-center">
                      <span className="text-muted font-normal mr-1">Sensor Time:</span> 
                      {new Date(data.timestamp || data.createdAt).toLocaleString()}
                    </p>
                  )}
                  <p className="text-muted text-[11px] font-semibold uppercase tracking-wider flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 shadow-[0_0_4px_rgba(34,197,94,0.8)]"></span>
                    Frontend Synced: {lastUpdated.toLocaleTimeString()}
                  </p>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <SensorCard 
                icon={Droplets} 
                label="Turbidity" 
                value={data?.sensors?.turbidityOut} 
                unit="NTU" 
                status={getSensorStatus(data?.sensors?.turbidityOut, {warnMin:-1, warnMax:5, critMin:-1, critMax:10})} 
              />
              <SensorCard 
                icon={Thermometer} 
                label="Temperature" 
                value={data?.sensors?.temperature} 
                unit="°C" 
                status={getSensorStatus(data?.sensors?.temperature, {warnMin:10, warnMax:35, critMin:5, critMax:45})} 
              />
              <SensorCard 
                icon={FlaskConical} 
                label="pH Level" 
                value={data?.sensors?.ph} 
                unit="pH" 
                status={getSensorStatus(data?.sensors?.ph, {warnMin:6.5, warnMax:8.5, critMin:5.5, critMax:9.5})} 
              />
              <SensorCard 
                icon={TestTube} 
                label="TDS" 
                value={data?.sensors?.tds} 
                unit="ppm" 
                status={getSensorStatus(data?.sensors?.tds, {warnMin:-1, warnMax:300, critMin:-1, critMax:500})} 
              />
              <SensorCard 
                icon={Waves} 
                label="Flow Rate" 
                value={data?.sensors?.flowIn} 
                unit="L/min" 
                status={data?.sensors?.flowIn === 0 ? 'CRITICAL' : getSensorStatus(data?.sensors?.flowIn, {warnMin:1.0, warnMax:999, critMin:-1, critMax:999})} 
              />
            </div>
          </section>
          
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-card border-t border-border py-4 px-8 text-center text-sm text-muted shrink-0">
        JalRakshak v2.0 Platform &copy; 2026. All rights reserved.
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
