import { useState } from 'react';
import { Filter, MoreVertical, Search, CheckCircle2, AlertTriangle, XCircle, MapPin } from 'lucide-react';

const mockSites = [
  { id: 'JR-DH-01', village: 'Baliapur', district: 'Dhanbad', block: 'Baliapur', source: 'Groundwater', population: 2400, unit: 'Online', water: 'Safe', lastTest: '2 Days Ago' },
  { id: 'JR-DH-02', village: 'Tundi', district: 'Dhanbad', block: 'Tundi', source: 'Handpump', population: 1200, unit: 'Online', water: 'Safe', lastTest: '5 Days Ago' },
  { id: 'JR-BK-04', village: 'Chas', district: 'Bokaro', block: 'Chas', source: 'Surface Water', population: 3500, unit: 'Warning', water: 'Safe', lastTest: '1 Week Ago' },
  { id: 'JR-PL-02', village: 'Hussainabad', district: 'Palamu', block: 'Hussainabad', source: 'Groundwater', population: 4100, unit: 'Online', water: 'Critical', lastTest: 'Today' },
  { id: 'JR-SG-07', village: 'Barhait', district: 'Sahibganj', block: 'Barhait', source: 'Groundwater', population: 1800, unit: 'Maintenance', water: 'Warning', lastTest: '3 Days Ago' },
];

export default function SiteListTable({ onSelectSite }) {
  const [searchTerm, setSearchTerm] = useState('');

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
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-96">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </span>
          <input
            type="text"
            placeholder="Search by Site ID, Village, or District..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 bg-white hover:bg-slate-50">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </button>
          <button className="flex-1 sm:flex-none px-4 py-2 bg-brand-blue text-white rounded-md text-sm font-medium hover:bg-blue-800 transition-colors">
            + Add New Site
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-sm text-left whitespace-nowrap">
          <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-semibold">
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
          <tbody className="divide-y divide-slate-200">
            {mockSites.filter(s => s.village.toLowerCase().includes(searchTerm.toLowerCase()) || s.id.toLowerCase().includes(searchTerm.toLowerCase())).map((row) => (
              <tr key={row.id} className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => onSelectSite(row)}>
                <td className="px-6 py-4 font-medium text-slate-900">{row.id}</td>
                <td className="px-6 py-4">
                  <div className="font-medium">{row.village}</div>
                  <div className="text-xs text-slate-500 flex items-center mt-0.5">
                    <MapPin className="w-3 h-3 mr-1" />
                    {row.block}, {row.district}
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-600">{row.source}</td>
                <td className="px-6 py-4 text-slate-600">{row.population.toLocaleString()}</td>
                <td className="px-6 py-4"><StatusBadge status={row.unit} /></td>
                <td className="px-6 py-4"><StatusBadge status={row.water} /></td>
                <td className="px-6 py-4 text-slate-600">{row.lastTest}</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-slate-400 hover:text-slate-600 p-1" onClick={(e) => { e.stopPropagation(); }}>
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
