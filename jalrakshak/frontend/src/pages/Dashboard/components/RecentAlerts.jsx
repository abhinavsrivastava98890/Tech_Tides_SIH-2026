import { useEffect, useState } from 'react';
import { AlertOctagon, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';
import { alertService } from '../../services/api';

export default function RecentAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = async () => {
    try {
      const response = await alertService.getActive();
      if (response.success) {
        setAlerts(response.data);
      }
    } catch (error) {
      console.error('Failed to load alerts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-slate-800">Recent Alerts</h3>
        <button className="text-sm text-brand-blue font-medium hover:underline">View All</button>
      </div>
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-4 text-sm text-slate-500">Loading alerts...</div>
        ) : alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center bg-green-50 rounded-lg border border-green-100">
             <CheckCircle2 className="w-8 h-8 text-green-500 mb-2" />
             <p className="text-sm font-medium text-green-800">System Normal</p>
             <p className="text-xs text-green-600 mt-1">No active faults detected across the network.</p>
          </div>
        ) : (
          alerts.map(alert => {
            let Icon = Info;
            let color = 'text-brand-blue';
            let bgColor = 'bg-blue-50';

            if (alert.severity === 'CRITICAL') {
              Icon = AlertOctagon;
              color = 'text-status-critical';
              bgColor = 'bg-red-50';
            } else if (alert.severity === 'WARNING' || alert.severity === 'HIGH') {
              Icon = AlertTriangle;
              color = 'text-status-warning';
              bgColor = 'bg-yellow-50';
            }

            const timeStr = new Date(alert.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

            return (
              <div key={alert._id} className="flex items-start p-3 rounded-md hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                <div className={`p-2 rounded-full ${bgColor} mr-3 shrink-0`}>
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{alert.faultName}</p>
                  <p className="text-xs text-slate-500 truncate">{alert.message}</p>
                </div>
                <div className="text-xs text-slate-400 whitespace-nowrap ml-2">
                  {timeStr}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
