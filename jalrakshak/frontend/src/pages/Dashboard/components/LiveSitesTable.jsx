import { CheckCircle2, AlertTriangle, AlertOctagon, XCircle } from 'lucide-react';

const mockTableData = [
  { id: 'JR-DH-01', village: 'Baliapur', district: 'Dhanbad', source: 'Groundwater', unit: 'Online', water: 'Safe', active: 'Common + Fluoride' },
  { id: 'JR-BK-04', village: 'Chas', district: 'Bokaro', source: 'Surface Water', unit: 'Warning', water: 'Safe', active: 'Common Only' },
  { id: 'JR-PL-02', village: 'Hussainabad', district: 'Palamu', source: 'Groundwater', unit: 'Online', water: 'Critical', active: 'Common + Iron' },
  { id: 'JR-SG-07', village: 'Barhait', district: 'Sahibganj', source: 'Groundwater', unit: 'Maintenance', water: 'Warning', active: 'Common + Arsenic' },
  { id: 'JR-RN-12', village: 'Kanke', district: 'Ranchi', source: 'Open Well', unit: 'Offline', water: 'Unknown', active: 'Common Only' },
];

const StatusBadge = ({ status }) => {
  let color = 'bg-slate-100 text-slate-700';
  let Icon = null;

  if (status === 'Safe' || status === 'Online') {
    color = 'bg-green-100 text-green-700';
    Icon = CheckCircle2;
  }
  else if (status === 'Warning') {
    color = 'bg-yellow-100 text-yellow-700';
    Icon = AlertTriangle;
  }
  else if (status === 'Critical') {
    color = 'bg-red-100 text-red-700';
    Icon = AlertOctagon;
  }
  else if (status === 'Offline' || status === 'Unknown') {
    color = 'bg-slate-200 text-slate-700';
    Icon = XCircle;
  }
  else if (status === 'Maintenance') {
    color = 'bg-orange-100 text-orange-700';
    Icon = AlertTriangle;
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
      {Icon && <Icon className="w-3.5 h-3.5 mr-1" />}
      {status}
    </span>
  );
};

export default function LiveSitesTable() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-slate-800">Live Sites</h3>
        <button className="text-sm text-brand-blue font-medium hover:underline">View All</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-semibold">
            <tr>
              <th className="px-6 py-3">Site ID</th>
              <th className="px-6 py-3">Village / District</th>
              <th className="px-6 py-3">Water Source</th>
              <th className="px-6 py-3">Unit Status</th>
              <th className="px-6 py-3">Water Quality</th>
              <th className="px-6 py-3">Active Modules</th>
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {mockTableData.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">{row.id}</td>
                <td className="px-6 py-4">
                  <div>{row.village}</div>
                  <div className="text-xs text-slate-500">{row.district}</div>
                </td>
                <td className="px-6 py-4 text-slate-600">{row.source}</td>
                <td className="px-6 py-4"><StatusBadge status={row.unit} /></td>
                <td className="px-6 py-4"><StatusBadge status={row.water} /></td>
                <td className="px-6 py-4 text-slate-600">{row.active}</td>
                <td className="px-6 py-4">
                  <button className="text-brand-blue hover:text-brand-navy font-medium">Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
