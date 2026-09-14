import { Settings2, Zap, AlertTriangle, ShieldCheck, Cpu } from 'lucide-react';

export default function Modules() {
  const modules = [
    { id: 'MOD-FL-22', type: 'Fluoride Removal', status: 'Active', life: 45, site: 'JR-DH-01' },
    { id: 'MOD-AS-09', type: 'Arsenic Removal', status: 'Warning', life: 12, site: 'JR-SG-07' },
    { id: 'MOD-FE-14', type: 'Iron/Manganese', status: 'Active', life: 78, site: 'JR-PL-02' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto h-full overflow-y-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text">Treatment Modules</h1>
        <p className="text-sm text-muted mt-1">Manage plug-and-play regional water treatment modules.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Module Inventory & Status */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-lg font-semibold text-slate-800">Installed Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {modules.map(mod => (
              <div key={mod.id} className="bg-card rounded-lg shadow-sm border border-border p-5">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-background rounded border border-slate-100 mr-3">
                      <Cpu className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-text">{mod.type}</h3>
                      <p className="text-xs text-muted">ID: {mod.id}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${mod.status === 'Warning' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                    {mod.status}
                  </span>
                </div>
                
                <div className="text-sm text-muted mb-2">Installed at: <span className="font-medium">{mod.site}</span></div>
                
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted">Estimated Life</span>
                    <span className="font-medium">{mod.life}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className={`h-2 rounded-full ${mod.life < 20 ? 'bg-warning' : 'bg-teal'}`} style={{ width: `${mod.life}%` }}></div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-slate-100 flex justify-end">
                  <button className="text-sm text-primary font-medium hover:underline">Configuration</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-slate-800">AI Recommendations</h2>
          
          <div className="bg-[#6FA8C6] rounded-lg shadow-sm border border-slate-800 p-5 text-white">
            <div className="flex items-center mb-4 text-teal">
              <Zap className="w-5 h-5 mr-2" />
              <h3 className="font-semibold">Recommendation Engine</h3>
            </div>
            
            <div className="space-y-4">
              <div className="bg-slate-800 rounded p-3">
                <p className="text-sm text-slate-300 mb-2">Site: <strong className="text-white">JR-PL-02 (Palamu)</strong></p>
                <div className="text-xs space-y-1 mb-3 text-slate-400">
                  <p>Profile: Fluoride <span className="text-warning font-bold">HIGH</span></p>
                  <p>Profile: Iron <span className="text-warning font-bold">HIGH</span></p>
                </div>
                <div className="bg-slate-900 rounded p-2 text-sm border border-slate-700">
                  <p className="flex items-center text-success mb-1"><ShieldCheck className="w-3.5 h-3.5 mr-2"/> Common Filtration</p>
                  <p className="flex items-center text-success mb-1"><ShieldCheck className="w-3.5 h-3.5 mr-2"/> Fluoride Module</p>
                  <p className="flex items-center text-success"><ShieldCheck className="w-3.5 h-3.5 mr-2"/> Iron Module</p>
                </div>
                <p className="text-xs text-slate-400 mt-2 italic">* RO module not recommended (TDS is normal).</p>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-lg shadow-sm border border-border p-5">
            <h3 className="font-semibold text-slate-800 mb-3">Module Inventory</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between items-center"><span className="text-muted">Available</span><span className="font-bold">42</span></li>
              <li className="flex justify-between items-center"><span className="text-muted">Installed</span><span className="font-bold">118</span></li>
              <li className="flex justify-between items-center"><span className="text-muted">Needs Replacement</span><span className="font-bold text-warning">5</span></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
