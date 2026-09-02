import { useState } from 'react';
import { FileText, Plus, Filter, Download, Droplet } from 'lucide-react';

const mockLabTests = [
  { id: 'WT-001', site: 'JR-DH-01', date: '2024-08-10', parameter: 'Fluoride', result: 1.8, limit: 1.5, unit: 'mg/L', status: 'Elevated' },
  { id: 'WT-002', site: 'JR-DH-01', date: '2024-08-10', parameter: 'Iron', result: 0.2, limit: 0.3, unit: 'mg/L', status: 'Safe' },
  { id: 'WT-003', site: 'JR-SG-07', date: '2024-08-05', parameter: 'Arsenic', result: 0.04, limit: 0.01, unit: 'mg/L', status: 'Critical' },
  { id: 'WT-004', site: 'JR-PL-02', date: '2024-08-01', parameter: 'Nitrate', result: 42, limit: 45, unit: 'mg/L', status: 'Warning' },
];

export default function WaterQuality() {
  const [activeTab, setActiveTab] = useState('tests');

  return (
    <div className="p-6 max-w-7xl mx-auto h-full overflow-y-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Water Quality Profiles</h1>
          <p className="text-sm text-slate-500 mt-1">Manage specialized lab & field water tests for contaminants.</p>
        </div>
        <button className="mt-4 md:mt-0 px-4 py-2 bg-brand-blue text-white rounded-md text-sm font-medium hover:bg-blue-800 transition-colors flex items-center">
          <Plus className="w-4 h-4 mr-2" /> Add Water Test
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200 px-6 rounded-t-lg shadow-sm">
        <nav className="flex space-x-6">
          <button
            onClick={() => setActiveTab('tests')}
            className={`py-4 px-1 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'tests' ? 'border-brand-blue text-brand-blue' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Specialized Test Results
          </button>
          <button
            onClick={() => setActiveTab('profiles')}
            className={`py-4 px-1 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'profiles' ? 'border-brand-blue text-brand-blue' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Source Contamination Profiles
          </button>
        </nav>
      </div>

      <div className="bg-white rounded-b-lg shadow-sm border border-slate-200 border-t-0 p-6">
        <div className="flex justify-between mb-4">
          <div className="flex space-x-2">
            <button className="px-3 py-1.5 border border-slate-300 rounded-md text-sm text-slate-600 flex items-center hover:bg-slate-50">
              <Filter className="w-4 h-4 mr-2" /> Filter
            </button>
            <select className="border border-slate-300 rounded-md text-sm px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-brand-blue text-slate-600">
              <option>All Parameters</option>
              <option>Fluoride</option>
              <option>Arsenic</option>
              <option>Iron</option>
              <option>Nitrate</option>
            </select>
          </div>
          <button className="px-3 py-1.5 border border-slate-300 rounded-md text-sm text-slate-600 flex items-center hover:bg-slate-50">
            <Download className="w-4 h-4 mr-2" /> Export
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-semibold">
              <tr>
                <th className="px-4 py-3 border-b">Test ID</th>
                <th className="px-4 py-3 border-b">Site ID</th>
                <th className="px-4 py-3 border-b">Date</th>
                <th className="px-4 py-3 border-b">Parameter</th>
                <th className="px-4 py-3 border-b text-right">Result</th>
                <th className="px-4 py-3 border-b text-right">Limit</th>
                <th className="px-4 py-3 border-b text-center">Status</th>
                <th className="px-4 py-3 border-b">Report</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {mockLabTests.map((test) => (
                <tr key={test.id} className="hover:bg-slate-50">
                  <td className="px-4 py-4 font-medium text-slate-900">{test.id}</td>
                  <td className="px-4 py-4 text-brand-blue cursor-pointer hover:underline">{test.site}</td>
                  <td className="px-4 py-4 text-slate-600">{test.date}</td>
                  <td className="px-4 py-4 font-medium text-slate-800">{test.parameter}</td>
                  <td className="px-4 py-4 text-right font-semibold">{test.result} <span className="text-xs font-normal text-slate-500">{test.unit}</span></td>
                  <td className="px-4 py-4 text-right text-slate-500">{test.limit} <span className="text-xs">{test.unit}</span></td>
                  <td className="px-4 py-4 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      test.status === 'Safe' ? 'bg-green-100 text-green-700' :
                      test.status === 'Warning' || test.status === 'Elevated' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {test.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-slate-400 hover:text-brand-blue cursor-pointer">
                    <FileText className="w-5 h-5" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-8 bg-blue-50 border border-blue-100 rounded-lg p-4 flex">
           <Droplet className="w-6 h-6 text-brand-blue mr-3 shrink-0" />
           <p className="text-sm text-blue-900">
             <strong>Note:</strong> Live sensors (pH, TDS, Turbidity) cannot directly measure complex contaminants like Fluoride or Arsenic. 
             This table relies on periodic field test kits or laboratory analysis data entered by technicians.
           </p>
        </div>
      </div>
    </div>
  );
}
