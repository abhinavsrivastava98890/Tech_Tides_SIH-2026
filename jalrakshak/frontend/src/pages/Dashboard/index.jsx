import { 
  Building2, 
  Wifi, 
  WifiOff, 
  AlertOctagon, 
  Droplets, 
  Wrench 
} from 'lucide-react';
import KPICard from './components/KPICard';
import NetworkStatusMap from './components/NetworkStatusMap';
import LiveSitesTable from './components/LiveSitesTable';
import RecentAlerts from './components/RecentAlerts';

export default function Dashboard() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-end space-y-2 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Command Center</h1>
          <p className="text-sm text-slate-500 mt-1">Overview of JalRakshak water treatment network.</p>
        </div>
        <div className="text-sm text-slate-500">
          Last updated: <span className="font-medium text-slate-700">Just now</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        <KPICard title="Total Sites" value="142" icon={Building2} colorClass="bg-brand-blue" />
        <KPICard title="Online Units" value="128" icon={Wifi} colorClass="bg-status-safe" />
        <KPICard title="Offline Units" value="14" icon={WifiOff} colorClass="bg-status-offline" />
        <KPICard title="Critical Alerts" value="3" icon={AlertOctagon} colorClass="bg-status-critical" />
        <KPICard title="Water Treated (Today)" value="2.4M" subtitle="Liters" icon={Droplets} colorClass="bg-brand-teal" />
        <KPICard title="Maintenance Due" value="12" icon={Wrench} colorClass="bg-status-maintenance" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Main Section - Map */}
        <div className="lg:col-span-2 flex flex-col">
          <NetworkStatusMap />
        </div>
        
        {/* Right Section - Alerts */}
        <div className="lg:col-span-1 flex flex-col space-y-6">
          <RecentAlerts />
          
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5 flex-1">
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-slate-800">System Health</h3>
             </div>
             <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600">Network Uptime</span>
                    <span className="font-medium text-slate-900">98.2%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-status-safe h-2 rounded-full" style={{ width: '98.2%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600">Sensor Reliability</span>
                    <span className="font-medium text-slate-900">94.5%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-brand-blue h-2 rounded-full" style={{ width: '94.5%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600">Avg. Response Time</span>
                    <span className="font-medium text-slate-900">2.4 hrs</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-brand-teal h-2 rounded-full" style={{ width: '80%' }}></div>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Table */}
      <LiveSitesTable />
    </div>
  );
}
