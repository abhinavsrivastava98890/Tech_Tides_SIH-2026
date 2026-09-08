import { Cpu, Zap, Wifi, Server, Activity } from 'lucide-react';

export default function DeviceHealth() {
  const components = [
    { name: 'Main Power', status: 'Online', icon: Zap, color: 'text-status-safe' },
    { name: 'Internet / 4G', status: 'Strong', icon: Wifi, color: 'text-status-safe' },
    { name: 'Controller', status: 'Active', icon: Cpu, color: 'text-status-safe' },
    { name: 'Feed Pump', status: 'Running', icon: Activity, color: 'text-brand-blue' },
    { name: 'UV Lamp', status: 'Warning', icon: Server, color: 'text-status-warning' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Device Health</h3>
      <div className="space-y-4">
        {components.map((comp, i) => {
          const Icon = comp.icon;
          return (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`p-2 rounded-full bg-slate-50 mr-3`}>
                  <Icon className={`w-4 h-4 ${comp.color}`} />
                </div>
                <span className="text-sm font-medium text-slate-700">{comp.name}</span>
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                comp.status === 'Warning' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
              }`}>
                {comp.status}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
