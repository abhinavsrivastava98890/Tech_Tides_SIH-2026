import { 
  Building2, 
  Wifi, 
  WifiOff, 
  AlertOctagon, 
  Droplets, 
  Wrench 
} from 'lucide-react';
import { useState, useEffect } from 'react';
import KPICard from './components/KPICard';
import NetworkStatusMap from './components/NetworkStatusMap';
import LiveSitesTable from './components/LiveSitesTable';
import RecentAlerts from './components/RecentAlerts';
import { alertService, telemetryService } from '../../services/api';

export default function Dashboard() {
  const [activeAlertsCount, setActiveAlertsCount] = useState(3);
  const [onlineUnits, setOnlineUnits] = useState(128);

  useEffect(() => {
    const fetchGlobalStats = async () => {
      try {
        const alertsRes = await alertService.getActive();
        if (alertsRes.success) {
          setActiveAlertsCount(alertsRes.data.length);
        }
        
        // If we get telemetry from ESP32, increment online units by 1
        const telRes = await telemetryService.getLatest();
        if (telRes.success && telRes.data) {
          setOnlineUnits(129); // 128 mock + 1 real ESP32
        }
      } catch (error) {
        console.error('Failed to load global stats');
      }
    };

    fetchGlobalStats();
    const interval = setInterval(fetchGlobalStats, 10000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-end space-y-2 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-text">Command Center</h1>
          <p className="text-sm text-muted mt-1">Overview of JalRakshak water treatment network.</p>
        </div>
        <div className="text-sm text-muted">
          Last updated: <span className="font-medium text-slate-700">Just now</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        <KPICard title="Total Sites" value="142" icon={Building2} colorClass="bg-accent" />
        <KPICard title="Online Units" value={onlineUnits} icon={Wifi} colorClass="bg-success" />
        <KPICard title="Offline Units" value="14" icon={WifiOff} colorClass="bg-status-offline" />
        <KPICard title="Critical Alerts" value={activeAlertsCount} icon={AlertOctagon} colorClass="bg-danger" />
        <KPICard title="Water Treated (Today)" value="2.4M" subtitle="Liters" icon={Droplets} colorClass="bg-teal" />
        <KPICard title="Maintenance Due" value="12" icon={Wrench} colorClass="bg-warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Main Section - Map */}
        <div className="lg:col-span-2 flex flex-col">
          <NetworkStatusMap />
        </div>
        
        {/* Right Section - Alerts */}
        <div className="lg:col-span-1 flex flex-col space-y-6">
          <RecentAlerts />
          
          <div className="bg-card rounded-lg shadow-sm border border-border p-5 flex-1">
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-slate-800">System Health</h3>
             </div>
             <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted">Network Uptime</span>
                    <span className="font-medium text-text">98.2%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-success h-2 rounded-full" style={{ width: '98.2%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted">Sensor Reliability</span>
                    <span className="font-medium text-text">94.5%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-accent h-2 rounded-full" style={{ width: '94.5%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted">Avg. Response Time</span>
                    <span className="font-medium text-text">2.4 hrs</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-teal h-2 rounded-full" style={{ width: '80%' }}></div>
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
