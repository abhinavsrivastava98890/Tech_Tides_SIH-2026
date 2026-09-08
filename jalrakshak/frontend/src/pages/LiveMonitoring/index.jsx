import { RefreshCw } from 'lucide-react';
import SensorCard from './components/SensorCard';
import WaterSafetyStatus from './components/WaterSafetyStatus';
import TreatmentPerformance from './components/TreatmentPerformance';
import DeviceHealth from './components/DeviceHealth';
import LiveCharts from './components/LiveCharts';

export default function LiveMonitoring() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <h1 className="text-2xl font-bold text-slate-900">Dhanbad Plant A</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
              Online
            </span>
          </div>
          <div className="text-sm text-slate-500 flex items-center space-x-4">
            <span>Unit ID: JR-DH-01</span>
            <span>Village: Baliapur</span>
            <span>District: Dhanbad</span>
          </div>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-4 text-sm">
          <div className="flex items-center text-slate-500">
            <RefreshCw className="w-4 h-4 mr-2 animate-spin-slow" />
            Last heartbeat: Just now
          </div>
          <button className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-md hover:bg-slate-50 transition-colors font-medium shadow-sm">
            Configure Unit
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Left Column - Live Sensors */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <SensorCard title="pH Level" value="7.2" unit="" normalRange="6.5 - 8.5" status="safe" time="Live" trend="stable" />
            <SensorCard title="TDS" value="450" unit="ppm" normalRange="< 500" status="safe" time="Live" trend="down" />
            <SensorCard title="Turbidity" value="4.5" unit="NTU" normalRange="< 5" status="warning" time="Live" trend="up" />
            <SensorCard title="Temperature" value="28" unit="°C" normalRange="20 - 35" status="safe" time="Live" trend="stable" />
            <SensorCard title="Flow Rate" value="1200" unit="LPH" normalRange="1000 - 1500" status="safe" time="Live" trend="stable" />
            <SensorCard title="Pressure" value="2.4" unit="bar" normalRange="2.0 - 3.0" status="safe" time="Live" trend="down" />
          </div>
          
          <LiveCharts />
        </div>

        {/* Right Column - Status & Performance */}
        <div className="space-y-6">
          <div className="h-48">
            <WaterSafetyStatus status="warning" />
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Treatment Performance</h3>
            <div className="space-y-4">
              <TreatmentPerformance parameter="Turbidity" inlet="32.0" outlet="4.5" unit="NTU" removalPercent="85.9" isWarning={true} />
              <TreatmentPerformance parameter="TDS" inlet="890" outlet="450" unit="ppm" removalPercent="49.4" />
            </div>
          </div>
          
          <DeviceHealth />
        </div>
      </div>
    </div>
  );
}
