import { RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';
import SensorCard from './components/SensorCard';
import WaterSafetyStatus from './components/WaterSafetyStatus';
import TreatmentPerformance from './components/TreatmentPerformance';
import DeviceHealth from './components/DeviceHealth';
import LiveCharts from './components/LiveCharts';
import { telemetryService } from '../../services/api';

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
      <div className="bg-[#EFE9E1] rounded-lg shadow-sm border border-slate-200 p-5 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <h1 className="text-2xl font-bold text-slate-900">Live Monitoring</h1>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
              sensorData ? 'bg-green-100 text-green-700 border-green-200' : 'bg-slate-100 text-slate-500 border-slate-200'
            }`}>
              {sensorData ? 'Online' : 'Offline'}
            </span>
          </div>
          <div className="text-sm text-slate-500 flex items-center space-x-4">
            <span>Unit ID: {deviceId}</span>
            <span>Last Data: {getTimeAgo()}</span>
          </div>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-4 text-sm">
          <div className="flex items-center text-slate-500">
            <RefreshCw className={`w-4 h-4 mr-2 ${sensorData ? 'animate-spin-slow' : ''}`} />
            Last heartbeat: {sensorData ? getTimeAgo() : 'N/A'}
          </div>
          <button className="bg-[#EFE9E1] border border-slate-300 text-slate-700 px-4 py-2 rounded-md hover:bg-[#EFE9E1] transition-colors font-medium shadow-sm">
            Configure Unit
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Left Column - Live Sensors */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <SensorCard 
              title="pH Level" 
              value={sensorData?.ph != null ? sensorData.ph.toFixed(2) : '--'} 
              unit="" 
              normalRange="6.5 - 8.5" 
              status={getSensorStatus('ph', sensorData?.ph)} 
              time={sensorData ? 'Live' : 'Offline'} 
              trend="stable" 
            />
            <SensorCard 
              title="TDS" 
              value={sensorData?.tds != null ? Math.round(sensorData.tds).toString() : '--'} 
              unit="ppm" 
              normalRange="< 500" 
              status={getSensorStatus('tds', sensorData?.tds)} 
              time={sensorData ? 'Live' : 'Offline'} 
              trend="stable" 
            />
            <SensorCard 
              title="Turbidity" 
              value={sensorData?.turbidityOut != null ? sensorData.turbidityOut.toFixed(1) : '--'} 
              unit="NTU" 
              normalRange="< 5" 
              status={getSensorStatus('turbidity', sensorData?.turbidityOut)} 
              time={sensorData ? 'Live' : 'Offline'} 
              trend="stable" 
            />
            <SensorCard 
              title="Temperature" 
              value={sensorData?.temperature != null ? sensorData.temperature.toFixed(1) : '--'} 
              unit="°C" 
              normalRange="10 - 35" 
              status={getSensorStatus('temperature', sensorData?.temperature)} 
              time={sensorData ? 'Live' : 'Offline'} 
              trend="stable" 
            />
            <SensorCard 
              title="Flow Rate" 
              value={sensorData?.flowIn != null ? sensorData.flowIn.toFixed(2) : '--'} 
              unit="L/min" 
              normalRange="> 0.5" 
              status={getSensorStatus('flow', sensorData?.flowIn)} 
              time={sensorData ? 'Live' : 'Offline'} 
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
          
          <div className="bg-[#EFE9E1] rounded-lg shadow-sm border border-slate-200 p-5">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Treatment Performance</h3>
            <div className="space-y-4">
              <TreatmentPerformance 
                parameter="Turbidity" 
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
                parameter="TDS" 
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
