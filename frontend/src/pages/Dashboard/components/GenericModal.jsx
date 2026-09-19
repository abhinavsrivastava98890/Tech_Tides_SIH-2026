import { X } from 'lucide-react';

export default function GenericModal({ isOpen, onClose, title, icon: Icon, colorClass, children }) {
  if (!isOpen) return null;

  // Derive light background for header
  let headerBg = 'bg-slate-50';
  let iconColor = 'text-slate-600';

  if (colorClass.includes('accent')) {
    headerBg = 'bg-blue-50';
    iconColor = 'text-blue-600';
  } else if (colorClass.includes('success')) {
    headerBg = 'bg-green-50';
    iconColor = 'text-green-600';
  } else if (colorClass.includes('status-offline')) {
    headerBg = 'bg-slate-100';
    iconColor = 'text-slate-600';
  } else if (colorClass.includes('danger')) {
    headerBg = 'bg-red-50';
    iconColor = 'text-red-600';
  } else if (colorClass.includes('teal')) {
    headerBg = 'bg-teal-50';
    iconColor = 'text-teal-600';
  } else if (colorClass.includes('warning')) {
    headerBg = 'bg-orange-50';
    iconColor = 'text-orange-600';
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in fade-in zoom-in-95 duration-200">
        <div className={`px-6 py-4 border-b border-slate-100 flex justify-between items-center ${headerBg}`}>
          <div className="flex items-center">
            {Icon && <Icon className={`w-5 h-5 mr-2 ${iconColor}`} />}
            <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
