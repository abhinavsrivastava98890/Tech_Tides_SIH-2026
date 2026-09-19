import { useState } from 'react';
import { Wrench, CheckCircle, Clock, Calendar, Filter, Plus, AlertTriangle, X } from 'lucide-react';

const initialWorkOrders = [
  { id: 'WO-24-089', site: 'JR-DH-01', task: 'Replace Pre-Filter Cartridge', type: 'Preventive', status: 'Due Today', date: '01 Sep 2026', technician: 'Rahul K.' },
  { id: 'WO-24-090', site: 'JR-PL-02', task: 'Calibrate pH Sensor', type: 'Sensor Calibration', status: 'In Progress', date: '01 Sep 2026', technician: 'Amit S.' },
  { id: 'WO-24-091', site: 'JR-BK-04', task: 'Inspect Feed Pump', type: 'Corrective', status: 'Overdue', date: '30 Aug 2026', technician: 'Unassigned' },
  { id: 'WO-24-085', site: 'JR-SG-07', task: 'Arsenic Module Media Replacement', type: 'Module Replacement', status: 'Completed', date: '28 Aug 2026', technician: 'Suresh M.' },
];

export default function Maintenance() {
  const [workOrders, setWorkOrders] = useState(initialWorkOrders);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [filterStatus, setFilterStatus] = useState('All');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Work Order Form State
  const [newTask, setNewTask] = useState('');
  const [newSite, setNewSite] = useState('');
  const [newType, setNewType] = useState('Preventive');
  const [newDate, setNewDate] = useState('');

  const filteredOrders = workOrders.filter(wo => {
    if (filterStatus !== 'All' && wo.status !== filterStatus) return false;
    return true;
  });

  const handleCreateWorkOrder = (e) => {
    e.preventDefault();
    if (!newTask || !newSite || !newDate) return;

    const newWO = {
      id: `WO-24-${Math.floor(100 + Math.random() * 900)}`,
      site: newSite,
      task: newTask,
      type: newType,
      status: 'Due Today',
      date: new Date(newDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      technician: 'Unassigned'
    };
    
    setWorkOrders([newWO, ...workOrders]);
    setShowCreateModal(false);
    setNewTask('');
    setNewSite('');
    setNewDate('');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto h-full overflow-y-auto relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Maintenance & Work Orders</h1>
          <p className="text-sm text-slate-500 mt-1">Manage preventive and corrective maintenance workflows.</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="mt-4 md:mt-0 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2" /> Create Work Order
        </button>
      </div>

      {/* Dashboard KPI */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 font-medium">Due Today</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">12</p>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-full"><Clock className="w-5 h-5"/></div>
        </div>
        <div className="bg-white rounded-lg border border-red-200 p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-red-500 font-medium">Overdue</p>
            <p className="text-2xl font-bold text-red-700 mt-1">3</p>
          </div>
          <div className="p-3 bg-red-50 text-red-600 rounded-full"><AlertTriangle className="w-5 h-5"/></div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 font-medium">In Progress</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">8</p>
          </div>
          <div className="p-3 bg-orange-50 text-orange-600 rounded-full"><Wrench className="w-5 h-5"/></div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 font-medium">Completed (Week)</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">45</p>
          </div>
          <div className="p-3 bg-green-50 text-green-600 rounded-full"><CheckCircle className="w-5 h-5"/></div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 relative">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-lg font-semibold text-slate-800">Active Work Orders</h3>
          
          <div className="relative">
            <button 
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className={`px-3 py-1.5 border rounded-md text-sm flex items-center transition-colors ${filterStatus !== 'All' || showFilterMenu ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
              <Filter className="w-4 h-4 mr-2" /> Filter List
            </button>
            
            {showFilterMenu && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-slate-200 rounded-lg shadow-xl z-50 p-4">
                <label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-wider">Status</label>
                <div className="flex flex-wrap gap-1.5">
                  {['All', 'Due Today', 'In Progress', 'Overdue', 'Completed'].map(stat => (
                    <button
                      key={stat}
                      onClick={() => setFilterStatus(stat)}
                      className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${filterStatus === stat ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                      {stat}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="px-6 py-3 border-b border-slate-200">Work Order ID</th>
                <th className="px-6 py-3 border-b border-slate-200">Task Description</th>
                <th className="px-6 py-3 border-b border-slate-200">Site ID</th>
                <th className="px-6 py-3 border-b border-slate-200">Type</th>
                <th className="px-6 py-3 border-b border-slate-200">Due Date</th>
                <th className="px-6 py-3 border-b border-slate-200">Assigned To</th>
                <th className="px-6 py-3 border-b border-slate-200 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length > 0 ? filteredOrders.map(wo => (
                <tr key={wo.id} className="hover:bg-slate-50 transition-colors cursor-pointer group">
                  <td className="px-6 py-4 font-semibold text-blue-600 group-hover:text-blue-800">{wo.id}</td>
                  <td className="px-6 py-4 font-medium text-slate-800">{wo.task}</td>
                  <td className="px-6 py-4 text-slate-500 font-medium">{wo.site}</td>
                  <td className="px-6 py-4 text-slate-500">
                    <span className="bg-slate-100 border border-slate-200 px-2 py-1 rounded text-xs">{wo.type}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 flex items-center font-medium"><Calendar className="w-3.5 h-3.5 mr-1.5 text-slate-400"/> {wo.date}</td>
                  <td className="px-6 py-4 text-slate-500 font-medium">{wo.technician}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wider font-bold ${
                      wo.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                      wo.status === 'Overdue' ? 'bg-red-100 text-red-700' :
                      wo.status === 'In Progress' ? 'bg-orange-100 text-orange-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {wo.status}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-slate-500 font-medium">
                    No work orders found for the selected filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Work Order Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-lg font-bold text-slate-800">Create Work Order</h2>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateWorkOrder} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Task Description</label>
                  <input 
                    type="text" 
                    required
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="e.g. Replace pre-filter"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Site ID</label>
                  <input 
                    type="text" 
                    required
                    value={newSite}
                    onChange={(e) => setNewSite(e.target.value)}
                    placeholder="e.g. JR-DH-01"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 text-sm"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Type</label>
                    <select 
                      value={newType}
                      onChange={(e) => setNewType(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 text-sm bg-white"
                    >
                      <option value="Preventive">Preventive</option>
                      <option value="Corrective">Corrective</option>
                      <option value="Inspection">Inspection</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Due Date</label>
                    <input 
                      type="date" 
                      required
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 text-sm"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-lg text-sm font-bold transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-sm font-bold shadow-sm transition-colors"
                >
                  Create Work Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
