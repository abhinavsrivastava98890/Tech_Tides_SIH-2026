import { useState, useEffect } from 'react';
import { Filter, MoreVertical, Search, CheckCircle2, AlertTriangle, XCircle, MapPin } from 'lucide-react';
import { telemetryService } from '../../../services/api';

export default function SiteListTable({ onSelectSite }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sites, setSites] = useState([]);

  useEffect(() => {
    const fetchSites = async () => {
      try {
        const response = await telemetryService.getLatest();
        if (response.success && response.data) {
           const telemetry = response.data;
           let waterStatus = 'Unknown';
           if (telemetry.systemState === 'PASS' || telemetry.systemState === 'FILTRATION' || telemetry.systemState === 'UV_ACTIVE') {
             waterStatus = 'Safe';
           } else if (telemetry.systemState === 'REJECT' || telemetry.systemState === 'CRITICAL' || telemetry.systemState === 'FAULT') {
             waterStatus = 'Critical';
           } else {
             waterStatus = 'Warning';
           }

           const realSite = {
             id: telemetry.deviceId,
             village: 'Test Bench',
             district: 'Lab',
             block: 'Local',
             source: 'Simulated',
             population: 1,
             unit: 'Online',
             water: waterStatus,
             lastTest: 'Live'
           };
           setSites([realSite]);
        } else {
           setSites([]);
        }
      } catch (err) {
        console.error('Failed to load sites');
      }
    };
    fetchSites();
    const int = setInterval(fetchSites, 10000);
    return () => clearInterval(int);
  }, []);

  const StatusBadge = ({ status }) => {
    let color = 'bg-slate-100 text-slate-700';
    let Icon = null;
  
    if (status === 'Safe' || status === 'Online') {
      color = 'bg-green-100 text-green-700';
      Icon = CheckCircle2;
    } else if (status === 'Warning') {
      color = 'bg-yellow-100 text-yellow-700';
      Icon = AlertTriangle;
    } else if (status === 'Critical') {
      color = 'bg-red-100 text-red-700';
      Icon = AlertTriangle;
    } else if (status === 'Maintenance') {
      color = 'bg-orange-100 text-orange-700';
      Icon = AlertTriangle;
    } else if (status === 'Offline') {
      color = 'bg-slate-200 text-slate-700';
      Icon = XCircle;
    }
  
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
        {Icon && <Icon className="w-3.5 h-3.5 mr-1" />}
        {status}
      </span>
    );
  };

  return (
    <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
      <div className="p-4 border-b border-border flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-96">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </span>
          <input
            type="text"
            placeholder="Search by Site ID, Village, or District..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2 border border-border rounded-md text-sm font-medium text-slate-700 bg-card hover:bg-card">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </button>
          <button className="flex-1 sm:flex-none px-4 py-2 bg-accent text-white rounded-md text-sm font-medium hover:bg-accent/90 transition-colors">
            + Add New Site
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-sm text-left whitespace-nowrap">
          <thead className="bg-card text-muted uppercase text-xs font-semibold">
            <tr>
              <th className="px-6 py-3">Site ID</th>
              <th className="px-6 py-3">Location</th>
              <th className="px-6 py-3">Source Type</th>
              <th className="px-6 py-3">Population</th>
              <th className="px-6 py-3">Unit Status</th>
              <th className="px-6 py-3">Water Quality</th>
              <th className="px-6 py-3">Last Test</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sites.filter(s => s.village.toLowerCase().includes(searchTerm.toLowerCase()) || s.id.toLowerCase().includes(searchTerm.toLowerCase())).map((row) => (
              <tr key={row.id} className="hover:bg-card transition-colors cursor-pointer" onClick={() => onSelectSite(row)}>
                <td className="px-6 py-4 font-medium text-text">{row.id}</td>
                <td className="px-6 py-4">
                  <div className="font-medium">{row.village}</div>
                  <div className="text-xs text-muted flex items-center mt-0.5">
                    <MapPin className="w-3 h-3 mr-1" />
                    {row.block}, {row.district}
                  </div>
                </td>
                <td className="px-6 py-4 text-muted">{row.source}</td>
                <td className="px-6 py-4 text-muted">{row.population.toLocaleString()}</td>
                <td className="px-6 py-4"><StatusBadge status={row.unit} /></td>
                <td className="px-6 py-4"><StatusBadge status={row.water} /></td>
                <td className="px-6 py-4 text-muted">{row.lastTest}</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-slate-400 hover:text-muted p-1" onClick={(e) => { e.stopPropagation(); }}>
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
