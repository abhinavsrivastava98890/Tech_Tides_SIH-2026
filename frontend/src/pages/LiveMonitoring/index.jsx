import { RefreshCw, Bell, Globe } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import SensorCard from './components/SensorCard';
import WaterSafetyStatus from './components/WaterSafetyStatus';
import TreatmentPerformance from './components/TreatmentPerformance';
import DeviceHealth from './components/DeviceHealth';
import LiveCharts from './components/LiveCharts';
import { telemetryService } from '../../services/api';
import usePushNotifications from '../../hooks/usePushNotifications';

// Threshold-based status calculation
function getSensorStatus(name, value) {
  if (value == null) return 'offline';
  switch (name) {
    case 'ph':
      if (value < 5.5 || value > 9.5) return 'critical';
      if (value < 6.5 || value > 8.5) return 'warning';
      return 'safe';
    case 'tds':
      if (value > 500) return 'critical';
      if (value > 300) return 'warning';
      return 'safe';
    case 'turbidity':
      if (value > 10) return 'critical';
      if (value > 5) return 'warning';
      return 'safe';
    case 'temperature':
      if (value < 5 || value > 45) return 'critical';
      if (value < 10 || value > 35) return 'warning';
      return 'safe';
    case 'flow':
      if (value === 0) return 'warning';
      if (value < 0.5) return 'warning';
      return 'safe';
    default:
      return 'safe';
  }
}

// Overall water safety from system state
function getOverallSafety(systemState) {
  if (systemState === 'CRITICAL') return 'critical';
  if (systemState === 'WARNING') return 'warning';
  return 'safe';
}

export default function LiveMonitoring() {
  const [sensorData, setSensorData] = useState(null);
  const [systemState, setSystemState] = useState('NORMAL');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [deviceId, setDeviceId] = useState('--');
  const [loading, setLoading] = useState(true);
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
        const res = await telemetryService.getLatest();
        if (res.success && res.data) {
          setSensorData(res.data.sensors);
          setSystemState(res.data.systemState || 'NORMAL');
          setDeviceId(res.data.deviceId || '--');
          setLastUpdated(new Date(res.data.timestamp));
        }
      } catch (error) {
        console.error('Failed to fetch live telemetry:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000); // Refresh every 10s (matches firmware interval)
    return () => clearInterval(interval);
  }, []);

  // Format time ago string
  const getTimeAgo = () => {
    if (!lastUpdated) return 'No data';
    const diffMs = Date.now() - lastUpdated.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    if (diffSec < 60) return `${diffSec}s ago`;
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    return `${Math.floor(diffMin / 60)}h ago`;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white/40 backdrop-blur-md rounded-lg shadow-lg border border-white/40 p-5 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <h1 className="text-2xl font-bold text-text">{t('page_live_monitoring')}</h1>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
              sensorData ? 'bg-green-100 text-green-700 border-green-200' : 'bg-slate-100 text-muted border-border'
            }`}>
              {sensorData ? t('online') : t('offline')}
            </span>
          </div>
          <div className="text-sm text-muted flex items-center space-x-4">
            <span>{t('unit_id')} {deviceId}</span>
            <span>{t('last_data')} {getTimeAgo()}</span>
          </div>
        </div>
        <div className="mt-4 md:mt-0 flex flex-wrap gap-4 items-center text-sm w-full md:w-auto">
          <div className="flex items-center text-muted">
            <RefreshCw className={`w-4 h-4 mr-2 ${sensorData ? 'animate-spin-slow' : ''}`} />
            {t('last_heartbeat')} {sensorData ? getTimeAgo() : 'N/A'}
          </div>
          <button 
            onClick={toggleSubscription}
            disabled={isLoading}
            title={isLoading ? t('wait') : isSubscribed ? t('notifications_on') : t('enable_notifications')}
            className="relative p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-200 disabled:opacity-50"
          >
            <Bell className="w-5 h-5" />
            {isSubscribed && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full border-2 border-white"></span>
            )}
          </button>
          <div className="relative">
            <button 
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="relative p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-200"
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
          <button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-md hover:from-blue-600 hover:to-indigo-700 transition-all font-medium shadow-md">
            {t('configure_unit')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Left Column - Live Sensors */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <SensorCard 
              title={t('ph_level')} 
              value={sensorData?.ph != null ? sensorData.ph.toFixed(2) : '--'} 
              unit="" 
              normalRange="6.5 - 8.5" 
              status={getSensorStatus('ph', sensorData?.ph)} 
              time={sensorData ? t('online') : t('offline')} 
              trend="stable" 
            />
            <SensorCard 
              title={t('tds')} 
              value={sensorData?.tds != null ? Math.round(sensorData.tds).toString() : '--'} 
              unit="ppm" 
              normalRange="< 500" 
              status={getSensorStatus('tds', sensorData?.tds)} 
              time={sensorData ? t('online') : t('offline')} 
              trend="stable" 
            />
            <SensorCard 
              title={t('turbidity')} 
              value={sensorData?.turbidityOut != null ? sensorData.turbidityOut.toFixed(1) : '--'} 
              unit="NTU" 
              normalRange="< 5" 
              status={getSensorStatus('turbidity', sensorData?.turbidityOut)} 
              time={sensorData ? t('online') : t('offline')} 
              trend="stable" 
            />
            <SensorCard 
              title={t('temperature')} 
              value={sensorData?.temperature != null ? sensorData.temperature.toFixed(1) : '--'} 
              unit="°C" 
              normalRange="10 - 35" 
              status={getSensorStatus('temperature', sensorData?.temperature)} 
              time={sensorData ? t('online') : t('offline')} 
              trend="stable" 
            />
            <SensorCard 
              title={t('flow_rate')} 
              value={sensorData?.flowIn != null ? sensorData.flowIn.toFixed(2) : '--'} 
              unit="L/min" 
              normalRange="> 0.5" 
              status={getSensorStatus('flow', sensorData?.flowIn)} 
              time={sensorData ? t('online') : t('offline')} 
              trend="stable" 
            />
          </div>
          
          <LiveCharts />
        </div>

        {/* Right Column - Status & Performance */}
        <div className="space-y-6">
          <div className="h-48">
            <WaterSafetyStatus status={getOverallSafety(systemState)} />
          </div>
          
          <div className="bg-card rounded-lg shadow-sm border border-border p-5">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">{t('treatment_performance')}</h3>
            <div className="space-y-4">
              <TreatmentPerformance 
                parameter={t('turbidity')} 
                inlet={sensorData?.turbidityRaw != null && sensorData.turbidityRaw >= 0 ? sensorData.turbidityRaw.toFixed(1) : '--'} 
                outlet={sensorData?.turbidityOut != null ? sensorData.turbidityOut.toFixed(1) : '--'} 
                unit="NTU" 
                removalPercent={
                  sensorData?.turbidityRaw > 0 && sensorData?.turbidityOut != null
                    ? ((1 - sensorData.turbidityOut / sensorData.turbidityRaw) * 100).toFixed(1)
                    : '--'
                } 
                isWarning={getSensorStatus('turbidity', sensorData?.turbidityOut) !== 'safe'} 
              />
              <TreatmentPerformance 
                parameter={t('tds')} 
                inlet="--" 
                outlet={sensorData?.tds != null ? Math.round(sensorData.tds).toString() : '--'} 
                unit="ppm" 
                removalPercent="--" 
              />
            </div>
          </div>
          
          <DeviceHealth />
        </div>
      </div>
    </div>
  );
}
