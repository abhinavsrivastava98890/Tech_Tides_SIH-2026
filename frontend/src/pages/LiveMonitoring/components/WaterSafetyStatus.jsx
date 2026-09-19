import { ShieldCheck, AlertTriangle, ShieldAlert, WifiOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function WaterSafetyStatus({ status = 'safe' }) {
  const { t } = useTranslation();
  let Icon = ShieldCheck;
  let textKey = "safe_to_drink";
  let colorClass = "border border-emerald-200 shadow-emerald-500/10 text-emerald-600";
  
  if (status === 'warning') {
    Icon = AlertTriangle;
    textKey = "attention_required";
    colorClass = "border border-amber-300 shadow-amber-500/10 text-amber-600";
  } else if (status === 'critical') {
    Icon = ShieldAlert;
    textKey = "do_not_drink";
    colorClass = "border-2 border-red-400 shadow-red-500/20 text-red-600";
  } else if (status === 'offline') {
    Icon = WifiOff;
    textKey = "sensor_offline";
    colorClass = "border border-slate-200 shadow-slate-500/5 text-slate-500";
  }

  return (
    <div className={`bg-white/60 backdrop-blur-md rounded-xl p-6 flex flex-col items-center justify-center shadow-lg h-full transition-all duration-300 hover:shadow-xl ${colorClass}`}>
      <Icon className={`w-20 h-20 mb-4 opacity-90 ${status === 'critical' ? 'animate-pulse' : ''}`} />
      <h2 className="text-3xl font-black tracking-wider mb-2 text-center">{t(textKey)}</h2>
    </div>
  );
}
