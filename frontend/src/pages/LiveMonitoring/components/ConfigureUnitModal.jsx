import { X, Settings, Sliders, RefreshCw, Power, Check, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function ConfigureUnitModal({ isOpen, onClose, deviceId }) {
  const [activeTab, setActiveTab] = useState('parameters');
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [activeAction, setActiveAction] = useState(null);
  const { t } = useTranslation();

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }, 1000);
  };

  const handleAction = (actionName) => {
    setActiveAction(actionName);
    setTimeout(() => {
      setActiveAction(null);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="flex items-center text-slate-800">
            <Settings className="w-5 h-5 mr-2 text-indigo-600" />
            <h2 className="text-lg font-semibold">{t('configure_unit')}: {deviceId}</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-full md:w-48 bg-slate-50 border-r border-slate-100 p-4 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-x-hidden">
            <button 
              onClick={() => setActiveTab('parameters')}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'parameters' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:bg-slate-200'}`}
            >
              <Sliders className="w-4 h-4 mr-2" /> Parameters
            </button>
            <button 
              onClick={() => setActiveTab('maintenance')}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'maintenance' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:bg-slate-200'}`}
            >
              <RefreshCw className="w-4 h-4 mr-2" /> Maintenance
            </button>
            <button 
              onClick={() => setActiveTab('power')}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'power' ? 'bg-red-100 text-red-700' : 'text-slate-600 hover:bg-red-50 hover:text-red-600'}`}
            >
              <Power className="w-4 h-4 mr-2" /> System Power
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {activeTab === 'parameters' && (
              <div className="space-y-6">
                <h3 className="text-md font-semibold text-slate-800 border-b pb-2">Operating Parameters</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Target pH Level</label>
                    <div className="flex space-x-2">
                      <input type="number" defaultValue={7.0} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Max Turbidity Threshold (NTU)</label>
                    <div className="flex space-x-2">
                      <input type="number" defaultValue={5.0} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Data Telemetry Interval (Seconds)</label>
                    <select className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                      <option value="10">10 Seconds (High Frequency)</option>
                      <option value="30">30 Seconds (Normal)</option>
                      <option value="60">1 Minute (Power Saving)</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <button 
                    onClick={handleSave}
                    disabled={isSaving || isSaved}
                    className={`flex items-center px-4 py-2 rounded-md transition-colors text-sm font-medium ${
                      isSaved ? 'bg-green-600 hover:bg-green-700 text-white' : 
                      isSaving ? 'bg-indigo-400 text-white cursor-not-allowed' : 
                      'bg-indigo-600 hover:bg-indigo-700 text-white'
                    }`}
                  >
                    {isSaving ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
                    ) : isSaved ? (
                      <><Check className="w-4 h-4 mr-2" /> Saved</>
                    ) : (
                      'Save Parameters'
                    )}
                  </button>
                </div>
              </div>
            )}
            
            {activeTab === 'maintenance' && (
              <div className="space-y-6">
                <h3 className="text-md font-semibold text-slate-800 border-b pb-2">Maintenance Actions</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="p-4 border border-slate-200 rounded-lg flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-slate-800">Calibrate Sensors</h4>
                      <p className="text-sm text-slate-500">Run auto-calibration sequence for pH and Turbidity.</p>
                    </div>
                    <button 
                      onClick={() => handleAction('calibrate')}
                      disabled={activeAction === 'calibrate'}
                      className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded hover:bg-slate-200 text-sm font-medium transition-colors min-w-[80px] flex justify-center items-center"
                    >
                      {activeAction === 'calibrate' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Start'}
                    </button>
                  </div>
                  <div className="p-4 border border-slate-200 rounded-lg flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-slate-800">Backwash Filter</h4>
                      <p className="text-sm text-slate-500">Initiate a manual backwash cycle immediately.</p>
                    </div>
                    <button 
                      onClick={() => handleAction('backwash')}
                      disabled={activeAction === 'backwash'}
                      className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded hover:bg-slate-200 text-sm font-medium transition-colors min-w-[80px] flex justify-center items-center"
                    >
                      {activeAction === 'backwash' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Execute'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'power' && (
              <div className="space-y-6">
                <h3 className="text-md font-semibold text-slate-800 border-b pb-2 text-red-600">Danger Zone</h3>
                <div className="p-4 bg-red-50 border border-red-100 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h4 className="font-medium text-red-800">Reboot System</h4>
                    <p className="text-sm text-red-600/80">Restart the microcontroller and all attached peripherals.</p>
                  </div>
                  <button 
                    onClick={() => handleAction('reboot')}
                    disabled={activeAction === 'reboot'}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm font-medium transition-colors shadow-sm whitespace-nowrap min-w-[110px] flex justify-center items-center"
                  >
                    {activeAction === 'reboot' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Reboot Now'}
                  </button>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h4 className="font-medium text-slate-800">Safe Shutdown</h4>
                    <p className="text-sm text-slate-500">Stop water flow and safely power down the unit.</p>
                  </div>
                  <button 
                    onClick={() => handleAction('poweroff')}
                    disabled={activeAction === 'poweroff'}
                    className="px-4 py-2 bg-slate-800 text-white rounded hover:bg-slate-900 text-sm font-medium transition-colors shadow-sm whitespace-nowrap min-w-[110px] flex justify-center items-center"
                  >
                    {activeAction === 'poweroff' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Power Off'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
