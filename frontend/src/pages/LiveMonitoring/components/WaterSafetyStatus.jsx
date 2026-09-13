import { ShieldCheck, AlertTriangle, ShieldAlert, WifiOff } from 'lucide-react';

export default function WaterSafetyStatus({ status = 'safe' }) {
  let Icon = ShieldCheck;
  let text = "SAFE TO DRINK";
  let hindiText = "पानी सुरक्षित है";
  let colorClass = "bg-status-safe text-white";
  
  if (status === 'warning') {
    Icon = AlertTriangle;
    text = "ATTENTION REQUIRED";
    hindiText = "फ़िल्टर की जाँच आवश्यक है";
    colorClass = "bg-status-warning text-slate-900";
  } else if (status === 'critical') {
    Icon = ShieldAlert;
    text = "DO NOT DRINK";
    hindiText = "सावधान! यह पानी पीने के लिए सुरक्षित नहीं है।";
    colorClass = "bg-status-critical text-white";
  } else if (status === 'offline') {
    Icon = WifiOff;
    text = "SENSOR OFFLINE";
    hindiText = "सेंसर काम नहीं कर रहा है";
    colorClass = "bg-status-offline text-white";
  }

  return (
    <div className={`rounded-xl p-6 flex flex-col items-center justify-center shadow-md ${colorClass} h-full`}>
      <Icon className="w-20 h-20 mb-4 opacity-90" />
      <h2 className="text-3xl font-black tracking-wider mb-2 text-center">{text}</h2>
      <p className="text-xl font-medium opacity-90 text-center">{hindiText}</p>
    </div>
  );
}
