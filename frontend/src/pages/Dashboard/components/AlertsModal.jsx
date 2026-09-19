import { X, AlertOctagon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function AlertsModal({ isOpen, onClose, alerts }) {
  const { t } = useTranslation();
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-red-100 flex justify-between items-center bg-red-50">
          <div className="flex items-center text-red-700">
            <AlertOctagon className="w-5 h-5 mr-2" />
            <h2 className="text-lg font-semibold">{t('critical_alerts')}</h2>
          </div>
          <button onClick={onClose} className="text-red-400 hover:text-red-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto">
          {alerts && alerts.length > 0 ? (
            <div className="space-y-4">
              {alerts.map((alert, idx) => (
                <div key={idx} className="p-4 border border-red-100 bg-red-50/50 rounded-lg flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-slate-800 text-sm">Site: {alert.deviceId || 'Unknown Site'}</h4>
                    <p className="text-sm text-slate-600 mt-1">{alert.message || 'Critical parameter out of range'}</p>
                  </div>
                  <div className="text-xs font-medium px-2 py-1 bg-red-100 text-red-700 rounded-full">
                    {alert.severity || 'CRITICAL'}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500">
              No critical alerts at the moment.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
