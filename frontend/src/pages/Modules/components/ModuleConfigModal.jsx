import { X, Settings2, Loader2, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function ModuleConfigModal({ isOpen, onClose, moduleData }) {
  const { t } = useTranslation();
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen || !moduleData) return null;

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsSaved(true);
      setTimeout(() => {
        setIsSaved(false);
        onClose();
      }, 1500);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-slate-500" />
            <h2 className="text-lg font-bold text-slate-800">{t('Configure Module')}</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto">
          <div className="mb-6 bg-blue-50 p-3 rounded-lg border border-blue-100">
            <h3 className="font-semibold text-blue-900">{moduleData.type}</h3>
            <p className="text-xs text-blue-700 mt-1">ID: {moduleData.id} | Site: {moduleData.site}</p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('Backwash Frequency (Hours)')}</label>
              <input type="number" defaultValue="24" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 text-sm" />
              <p className="text-xs text-slate-500 mt-1">Time interval between automatic backwash cycles.</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('Flow Rate Limit (L/hr)')}</label>
              <input type="number" defaultValue="1500" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 text-sm" />
            </div>

            {(moduleData.type.includes('Fluoride') || moduleData.type.includes('Arsenic')) && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('Chemical Dosing Rate (ml/min)')}</label>
                <input type="number" defaultValue="15" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 text-sm" />
              </div>
            )}
            
            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500" />
                <span className="text-sm font-medium text-slate-700">{t('Auto-bypass on failure')}</span>
              </label>
            </div>
          </div>
        </div>
        
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <button 
            type="button"
            onClick={onClose}
            disabled={isSaving || isSaved}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            {t('Cancel')}
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving || isSaved}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center ${
              isSaved ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 
              isSaving ? 'bg-blue-400 text-white cursor-not-allowed' : 
              'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isSaving ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> {t('Saving...')}</>
            ) : isSaved ? (
              <><CheckCircle2 className="w-4 h-4 mr-2" /> {t('Saved')}</>
            ) : (
              t('Save Configuration')
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
