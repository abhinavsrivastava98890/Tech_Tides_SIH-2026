import { AlertOctagon, AlertTriangle, Info } from 'lucide-react';

const mockAlerts = [
  { id: 1, site: 'Palamu Village', issue: 'Turbidity Critical', time: '10 mins ago', severity: 'critical' },
  { id: 2, site: 'Bokaro Sector 4', issue: 'Filter pressure drop', time: '1 hr ago', severity: 'warning' },
  { id: 3, site: 'Sahibganj River', issue: 'Unit offline', time: '2 hrs ago', severity: 'warning' },
  { id: 4, site: 'Dhanbad Plant A', issue: 'Routine backwash', time: '5 hrs ago', severity: 'info' },
];

export default function RecentAlerts() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-slate-800">Recent Alerts</h3>
        <button className="text-sm text-brand-blue font-medium hover:underline">View All</button>
      </div>
      <div className="space-y-4">
        {mockAlerts.map(alert => {
          let Icon = Info;
          let color = 'text-brand-blue';
          let bgColor = 'bg-blue-50';

          if (alert.severity === 'critical') {
            Icon = AlertOctagon;
            color = 'text-status-critical';
            bgColor = 'bg-red-50';
          } else if (alert.severity === 'warning') {
            Icon = AlertTriangle;
            color = 'text-status-warning';
            bgColor = 'bg-yellow-50';
          }

          return (
            <div key={alert.id} className="flex items-start p-3 rounded-md hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
              <div className={`p-2 rounded-full ${bgColor} mr-3 shrink-0`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">{alert.issue}</p>
                <p className="text-xs text-slate-500">{alert.site}</p>
              </div>
              <div className="text-xs text-slate-400 whitespace-nowrap ml-2">
                {alert.time}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
