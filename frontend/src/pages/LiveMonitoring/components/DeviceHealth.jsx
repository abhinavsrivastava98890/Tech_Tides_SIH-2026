import { Cpu, Zap, Wifi, Server, Activity } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function DeviceHealth() {
  const { t } = useTranslation();
  
  const components = [
    { name: t('main_power'), status: t('online'), icon: Zap, color: 'text-success' },
    { name: t('internet'), status: t('strong'), icon: Wifi, color: 'text-success' },
    { name: t('controller'), status: t('active'), icon: Cpu, color: 'text-success' },
    { name: t('feed_pump'), status: t('running'), icon: Activity, color: 'text-primary' },
    { name: t('uv_lamp'), status: t('warning'), icon: Server, color: 'text-warning' },
  ];

  return (
    <div className="bg-card rounded-lg shadow-sm border border-border p-5">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">{t('device_health')}</h3>
      <div className="space-y-4">
        {components.map((comp, i) => {
          const Icon = comp.icon;
          return (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`p-2 rounded-full bg-card mr-3`}>
                  <Icon className={`w-4 h-4 ${comp.color}`} />
                </div>
                <span className="text-sm font-medium text-slate-700">{comp.name}</span>
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                comp.status === t('warning') ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
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
