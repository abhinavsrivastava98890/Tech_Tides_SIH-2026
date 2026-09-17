import { ShieldCheck, AlertTriangle, ShieldAlert, WifiOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function WaterSafetyStatus({ status = 'safe' }) {
  const { t } = useTranslation();
  let Icon = ShieldCheck;
  let textKey = "safe_to_drink";
  let colorClass = "bg-success text-white";
  
  if (status === 'warning') {
    Icon = AlertTriangle;
    textKey = "attention_required";
    colorClass = "bg-warning text-text";
  } else if (status === 'critical') {
    Icon = ShieldAlert;
    textKey = "do_not_drink";
    colorClass = "bg-danger text-white";
  } else if (status === 'offline') {
    Icon = WifiOff;
    textKey = "sensor_offline";
    colorClass = "bg-status-offline text-white";
  }

  return (
    <div className={`rounded-xl p-6 flex flex-col items-center justify-center shadow-md ${colorClass} h-full`}>
      <Icon className="w-20 h-20 mb-4 opacity-90" />
      <h2 className="text-3xl font-black tracking-wider mb-2 text-center">{t(textKey)}</h2>
    </div>
  );
}
