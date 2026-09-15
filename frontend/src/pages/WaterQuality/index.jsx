import { useState } from 'react';
import { FileText, Plus, Filter, Download, Droplet } from 'lucide-react';


export default function WaterQuality() {
  const [activeTab, setActiveTab] = useState('tests');

  return (
    <div className="p-6 max-w-7xl mx-auto h-full overflow-y-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text">Water Quality Profiles</h1>
          <p className="text-sm text-muted mt-1">Manage specialized lab & field water tests for contaminants.</p>
        </div>
        <button className="mt-4 md:mt-0 px-4 py-2 bg-accent text-white rounded-md text-sm font-medium hover:bg-accent/90 transition-colors flex items-center">
          <Plus className="w-4 h-4 mr-2" /> Add Water Test
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-card border-b border-border px-6 rounded-t-lg shadow-sm">
        <nav className="flex space-x-6">
          <button
            onClick={() => setActiveTab('tests')}
            className={`py-4 px-1 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'tests' ? 'border-accent text-primary' : 'border-transparent text-muted hover:text-slate-700'
            }`}
          >
            Specialized Test Results
          </button>
          <button
            onClick={() => setActiveTab('profiles')}
            className={`py-4 px-1 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'profiles' ? 'border-accent text-primary' : 'border-transparent text-muted hover:text-slate-700'
            }`}
          >
            Source Contamination Profiles
          </button>
        </nav>
      </div>

      <div className="bg-card rounded-b-lg shadow-sm border border-border border-t-0 p-6">
        <div className="flex justify-between mb-4">
          <div className="flex space-x-2">
            <button className="px-3 py-1.5 border border-border rounded-md text-sm text-muted flex items-center hover:bg-card">
              <Filter className="w-4 h-4 mr-2" /> Filter
            </button>
            <select className="border border-border rounded-md text-sm px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-accent text-muted">
              <option>All Parameters</option>
              <option>Fluoride</option>
              <option>Arsenic</option>
              <option>Iron</option>
              <option>Nitrate</option>
            </select>
          </div>
          <button className="px-3 py-1.5 border border-border rounded-md text-sm text-muted flex items-center hover:bg-card">
            <Download className="w-4 h-4 mr-2" /> Export
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-card text-muted uppercase text-xs font-semibold">
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
            <tbody className="divide-y divide-border">
              {/* Empty state for live implementation */}
              <tr>
                <td colSpan="8" className="px-4 py-8 text-center text-slate-500">
                  No specialized lab test records found in the database.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="mt-8 bg-accent/10 border border-accent/20 rounded-lg p-4 flex">
           <Droplet className="w-6 h-6 text-primary mr-3 shrink-0" />
           <p className="text-sm text-primary">
             <strong>Note:</strong> Live sensors (pH, TDS, Turbidity) cannot directly measure complex contaminants like Fluoride or Arsenic. 
             This table relies on periodic field test kits or laboratory analysis data entered by technicians.
           </p>
        </div>
      </div>
    </div>
  );
}
