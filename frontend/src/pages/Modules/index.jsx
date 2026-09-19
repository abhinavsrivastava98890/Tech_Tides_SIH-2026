import { Settings2, Zap, AlertTriangle, ShieldCheck, Cpu, Droplet, Filter, Beaker, FlaskConical } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import ModuleConfigModal from './components/ModuleConfigModal';

export default function Modules() {
  const { t } = useTranslation();
  const [selectedModule, setSelectedModule] = useState(null);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

  const modules = [
    { id: 'MOD-FL-22', type: t('Fluoride Removal'), status: t('Active'), life: 45, site: 'JR-DH-01' },
    { id: 'MOD-AS-09', type: t('Arsenic Removal'), status: t('Warning'), life: 12, site: 'JR-SG-07' },
    { id: 'MOD-FE-14', type: t('Iron/Manganese'), status: t('Active'), life: 78, site: 'JR-PL-02' },
  ];

  const getModuleIcon = (type) => {
    const tStr = String(type).toLowerCase();
    if (tStr.includes('fluoride') || tStr.includes('फ्लोराइड')) return <Beaker className="w-5 h-5" />;
    if (tStr.includes('arsenic') || tStr.includes('आर्सेनिक')) return <FlaskConical className="w-5 h-5" />;
    if (tStr.includes('iron') || tStr.includes('आयरन')) return <Filter className="w-5 h-5" />;
    return <Droplet className="w-5 h-5" />;
  };

  const getModuleColor = (type) => {
    const tStr = String(type).toLowerCase();
    if (tStr.includes('fluoride') || tStr.includes('फ्लोराइड')) return 'text-cyan-600 bg-cyan-50';
    if (tStr.includes('arsenic') || tStr.includes('आर्सेनिक')) return 'text-purple-600 bg-purple-50';
    if (tStr.includes('iron') || tStr.includes('आयरन')) return 'text-orange-600 bg-orange-50';
    return 'text-blue-600 bg-blue-50';
  };

  return (
    <div className="p-6 max-w-7xl mx-auto h-full overflow-y-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text">{t('Treatment Modules')}</h1>
        <p className="text-sm text-muted mt-1">{t('Manage plug-and-play regional water treatment modules.')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Module Inventory & Status */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-lg font-semibold text-slate-800">{t('Installed Modules')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {modules.map(mod => (
              <div key={mod.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-5 hover:shadow-md hover:border-blue-200 transition-all duration-300">
                <div className="flex justify-between items-start mb-4 sm:mb-5">
                  <div className="flex items-center">
                    <div className={`p-2 sm:p-2.5 rounded-lg mr-3 ${getModuleColor(mod.type)}`}>
                      {getModuleIcon(mod.type)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 text-sm sm:text-base">{mod.type}</h3>
                      <p className="text-[11px] sm:text-xs text-slate-500 font-medium">ID: {mod.id}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-[10px] uppercase tracking-wider font-bold rounded-md ${mod.status === t('Warning') ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {mod.status}
                  </span>
                </div>
                
                <div className="bg-slate-50 rounded-lg p-2.5 sm:p-3 mb-3 sm:mb-4 border border-slate-100">
                  <p className="text-[10px] sm:text-[11px] text-slate-500 mb-0.5 sm:mb-1 uppercase tracking-wider font-semibold">{t('Installed at:')}</p>
                  <p className="text-sm text-slate-800 font-semibold">{mod.site}</p>
                </div>
                
                <div className="mb-1 sm:mb-2">
                  <div className="flex justify-between text-[11px] sm:text-xs mb-1.5 sm:mb-2">
                    <span className="text-slate-600 font-medium">{t('Estimated Life')}</span>
                    <span className={`font-bold ${mod.life < 20 ? 'text-amber-600' : 'text-emerald-600'}`}>{mod.life}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 sm:h-2">
                    <div className={`h-1.5 sm:h-2 rounded-full ${mod.life < 20 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${mod.life}%` }}></div>
                  </div>
                </div>
                
                <div className="mt-3 sm:mt-5 pt-3 sm:pt-4 border-t border-slate-100 flex justify-end">
                  <button 
                    onClick={() => {
                      setSelectedModule(mod);
                      setIsConfigModalOpen(true);
                    }}
                    className="text-xs sm:text-sm text-blue-600 font-semibold hover:text-blue-800 transition-colors flex items-center"
                  >
                    <Settings2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" /> {t('Configuration')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-slate-800">{t('AI Recommendations')}</h2>
          
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg shadow-sm border border-indigo-100 p-5 relative overflow-hidden">
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-indigo-500 opacity-5 rounded-full blur-xl"></div>
            
            <div className="flex items-center mb-4 text-indigo-700 relative z-10">
              <Zap className="w-5 h-5 mr-2 fill-indigo-200" />
              <h3 className="font-semibold">{t('Recommendation Engine')}</h3>
            </div>
            
            <div className="space-y-4 relative z-10">
              <div className="bg-white rounded-lg shadow-sm border border-indigo-50 p-4">
                <p className="text-sm text-slate-500 mb-4">{t('Site:')} <strong className="text-slate-800">JR-PL-02 (Palamu)</strong></p>
                
                <div className="flex flex-col sm:flex-row gap-3 mb-4">
                  <div className="bg-red-50 px-3 py-2 rounded-md border border-red-100 flex-1">
                    <p className="text-[11px] text-slate-500 uppercase tracking-wider">{t('Profile: Fluoride')}</p>
                    <p className="text-sm text-red-600 font-bold mt-0.5">{t('HIGH')}</p>
                  </div>
                  <div className="bg-red-50 px-3 py-2 rounded-md border border-red-100 flex-1">
                    <p className="text-[11px] text-slate-500 uppercase tracking-wider">{t('Profile: Iron')}</p>
                    <p className="text-sm text-red-600 font-bold mt-0.5">{t('HIGH')}</p>
                  </div>
                </div>

                <div className="bg-emerald-50 rounded-md p-3 text-sm border border-emerald-100 mb-3">
                  <h4 className="text-xs font-semibold text-emerald-800 mb-2 uppercase tracking-wider">{t('Recommended Modules')}</h4>
                  <div className="space-y-2">
                    <p className="flex items-center text-emerald-700 font-medium"><ShieldCheck className="w-4 h-4 mr-2 text-emerald-500"/> {t('Common Filtration')}</p>
                    <p className="flex items-center text-emerald-700 font-medium"><ShieldCheck className="w-4 h-4 mr-2 text-emerald-500"/> {t('Fluoride Module')}</p>
                    <p className="flex items-center text-emerald-700 font-medium"><ShieldCheck className="w-4 h-4 mr-2 text-emerald-500"/> {t('Iron Module')}</p>
                  </div>
                </div>
                
                <p className="text-xs text-slate-500 italic bg-slate-50 p-2 rounded border border-slate-100">{t('* RO module not recommended (TDS is normal).')}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <h3 className="font-semibold text-slate-800 mb-4">{t('Module Inventory')}</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center">
                <p className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold mb-1">{t('Available')}</p>
                <p className="text-xl font-bold text-slate-800">42</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center">
                <p className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold mb-1">{t('Installed')}</p>
                <p className="text-xl font-bold text-slate-800">118</p>
              </div>
              <div className="bg-red-50 p-3 rounded-lg border border-red-100 col-span-2 flex justify-between items-center">
                <p className="text-[11px] text-red-600 uppercase tracking-wider font-semibold">{t('Needs Replacement')}</p>
                <p className="text-xl font-bold text-red-600">5</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <ModuleConfigModal 
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        moduleData={selectedModule}
      />
    </div>
  );
}
