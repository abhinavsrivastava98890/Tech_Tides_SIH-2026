import { Wrench, CheckCircle, Clock, Calendar, Filter, Plus, AlertTriangle } from 'lucide-react';

const workOrders = [
  { id: 'WO-24-089', site: 'JR-DH-01', task: 'Replace Pre-Filter Cartridge', type: 'Preventive', status: 'Due Today', date: '01 Sep 2026', technician: 'Rahul K.' },
  { id: 'WO-24-090', site: 'JR-PL-02', task: 'Calibrate pH Sensor', type: 'Sensor Calibration', status: 'In Progress', date: '01 Sep 2026', technician: 'Amit S.' },
  { id: 'WO-24-091', site: 'JR-BK-04', task: 'Inspect Feed Pump', type: 'Corrective', status: 'Overdue', date: '30 Aug 2026', technician: 'Unassigned' },
  { id: 'WO-24-085', site: 'JR-SG-07', task: 'Arsenic Module Media Replacement', type: 'Module Replacement', status: 'Completed', date: '28 Aug 2026', technician: 'Suresh M.' },
];

export default function Maintenance() {
  return (
    <div className="p-6 max-w-7xl mx-auto h-full overflow-y-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text">Maintenance & Work Orders</h1>
          <p className="text-sm text-muted mt-1">Manage preventive and corrective maintenance workflows.</p>
        </div>
        <button className="mt-4 md:mt-0 px-4 py-2 bg-accent text-white rounded-md text-sm font-medium hover:bg-accent/90 transition-colors flex items-center shadow-sm">
          <Plus className="w-4 h-4 mr-2" /> Create Work Order
        </button>
      </div>

      {/* Dashboard KPI */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-card rounded-lg border border-border p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-muted font-medium">Due Today</p>
            <p className="text-2xl font-bold text-text mt-1">12</p>
          </div>
          <div className="p-3 bg-accent/10 text-primary rounded-full"><Clock className="w-5 h-5"/></div>
        </div>
        <div className="bg-card rounded-lg border border-red-200 p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-red-500 font-medium">Overdue</p>
            <p className="text-2xl font-bold text-red-700 mt-1">3</p>
          </div>
          <div className="p-3 bg-red-50 text-red-600 rounded-full"><AlertTriangle className="w-5 h-5"/></div>
        </div>
        <div className="bg-card rounded-lg border border-border p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-muted font-medium">In Progress</p>
            <p className="text-2xl font-bold text-text mt-1">8</p>
          </div>
          <div className="p-3 bg-orange-50 text-orange-600 rounded-full"><Wrench className="w-5 h-5"/></div>
        </div>
        <div className="bg-card rounded-lg border border-border p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-muted font-medium">Completed (Week)</p>
            <p className="text-2xl font-bold text-text mt-1">45</p>
          </div>
          <div className="p-3 bg-green-50 text-green-600 rounded-full"><CheckCircle className="w-5 h-5"/></div>
        </div>
      </div>

      <div className="bg-card rounded-lg shadow-sm border border-border">
        <div className="p-4 border-b border-border flex justify-between items-center">
          <h3 className="text-lg font-semibold text-slate-800">Active Work Orders</h3>
          <button className="px-3 py-1.5 border border-border rounded-md text-sm text-muted flex items-center hover:bg-card">
            <Filter className="w-4 h-4 mr-2" /> Filter List
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-card text-muted uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-3">Work Order ID</th>
                <th className="px-6 py-3">Task Description</th>
                <th className="px-6 py-3">Site ID</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Due Date</th>
                <th className="px-6 py-3">Assigned To</th>
                <th className="px-6 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {workOrders.map(wo => (
                <tr key={wo.id} className="hover:bg-card cursor-pointer">
                  <td className="px-6 py-4 font-medium text-primary">{wo.id}</td>
                  <td className="px-6 py-4 font-medium text-text">{wo.task}</td>
                  <td className="px-6 py-4 text-muted">{wo.site}</td>
                  <td className="px-6 py-4 text-muted">
                    <span className="bg-slate-100 px-2 py-1 rounded text-xs">{wo.type}</span>
                  </td>
                  <td className="px-6 py-4 text-muted flex items-center"><Calendar className="w-3 h-3 mr-1"/> {wo.date}</td>
                  <td className="px-6 py-4 text-muted">{wo.technician}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      wo.status === 'Completed' ? 'bg-green-100 text-green-700' :
                      wo.status === 'Overdue' ? 'bg-red-100 text-red-700' :
                      wo.status === 'In Progress' ? 'bg-orange-100 text-orange-700' :
                      'bg-accent/20 text-accent'
                    }`}>
                      {wo.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
