import { Droplets } from 'lucide-react';

export default function TreatmentPerformance({ parameter, inlet, outlet, unit, removalPercent, isWarning = false }) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-slate-700 flex items-center">
          <Droplets className="w-4 h-4 mr-2 text-brand-teal" />
          {parameter}
        </h4>
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${isWarning ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
          {removalPercent}% Reduction
        </span>
      </div>
      
      <div className="flex justify-between items-center text-sm">
        <div className="text-center">
          <p className="text-slate-500 mb-1">Inlet</p>
          <p className="font-bold text-slate-800">{inlet} <span className="text-xs font-normal text-slate-500">{unit}</span></p>
        </div>
        
        <div className="flex-1 px-4">
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
            <div className="bg-slate-300 h-full" style={{ width: '40%' }}></div>
            <div className={`h-full ${isWarning ? 'bg-status-warning' : 'bg-brand-teal'}`} style={{ width: '60%' }}></div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-slate-500 mb-1">Outlet</p>
          <p className="font-bold text-slate-800">{outlet} <span className="text-xs font-normal text-slate-500">{unit}</span></p>
        </div>
      </div>
    </div>
  );
}
