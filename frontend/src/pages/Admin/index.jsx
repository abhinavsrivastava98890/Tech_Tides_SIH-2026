import { useState } from 'react';
import { Users, Shield, Sliders, Database, Bell, Settings, FileText } from 'lucide-react';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('users');

  const settingsTabs = [
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'roles', label: 'Roles & Permissions', icon: Shield },
    { id: 'thresholds', label: 'Global Thresholds', icon: Sliders },
    { id: 'devices', label: 'Device Registry', icon: Database },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'system', label: 'System Settings', icon: Settings },
    { id: 'audit', label: 'Audit Logs', icon: FileText },
  ];

  return (
    <div className="flex flex-col md:flex-row h-full bg-card">
      {/* Settings Sidebar */}
      <div className="w-full md:w-64 bg-card border-b md:border-b-0 md:border-r border-border shrink-0">
        <div className="p-4 md:p-6 border-b border-border">
          <h1 className="text-xl font-bold text-text">Administration</h1>
        </div>
        <nav className="p-2 md:p-4 flex md:block overflow-x-auto md:space-y-1">
          {settingsTabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-auto md:w-full flex-shrink-0 flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive ? 'bg-accent/10 text-primary' : 'text-muted hover:bg-card hover:text-text'
                }`}
              >
                <Icon className={`w-4 h-4 mr-2 md:mr-3 ${isActive ? 'text-primary' : 'text-slate-400'}`} />
                <span className="whitespace-nowrap">{tab.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Settings Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        
        {activeTab === 'users' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-text">User Management</h2>
                <p className="text-sm text-muted mt-1">Manage platform users, technicians, and operators.</p>
              </div>
              <button className="px-4 py-2 bg-accent text-white rounded-md text-sm font-medium hover:bg-accent/90 transition-colors">
                + Add User
              </button>
            </div>
            
            <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-card text-muted uppercase text-xs font-semibold">
                  <tr>
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Role</th>
                    <th className="px-6 py-3">Phone</th>
                    <th className="px-6 py-3">Assigned Region</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr className="hover:bg-card">
                    <td className="px-6 py-4 font-medium text-text">Super Admin</td>
                    <td className="px-6 py-4 text-muted">Super Admin</td>
                    <td className="px-6 py-4 text-muted">+91 98765 43210</td>
                    <td className="px-6 py-4 text-muted">All Jharkhand</td>
                    <td className="px-6 py-4"><span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Active</span></td>
                  </tr>
                  <tr className="hover:bg-card">
                    <td className="px-6 py-4 font-medium text-text">Ramesh K.</td>
                    <td className="px-6 py-4 text-muted">Technician</td>
                    <td className="px-6 py-4 text-muted">+91 98765 43211</td>
                    <td className="px-6 py-4 text-muted">Dhanbad, Bokaro</td>
                    <td className="px-6 py-4"><span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Active</span></td>
                  </tr>
                  <tr className="hover:bg-card">
                    <td className="px-6 py-4 font-medium text-text">Suresh M.</td>
                    <td className="px-6 py-4 text-muted">Technician</td>
                    <td className="px-6 py-4 text-muted">+91 98765 43212</td>
                    <td className="px-6 py-4 text-muted">Sahibganj, Pakur</td>
                    <td className="px-6 py-4"><span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Active</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'thresholds' && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-text">Global Threshold Configuration</h2>
              <p className="text-sm text-muted mt-1">Configure warning and critical limits for sensor parameters. These trigger automated alerts.</p>
            </div>
            
            <div className="bg-card rounded-lg shadow-sm border border-border p-6 max-w-2xl">
              <h3 className="font-semibold text-slate-800 mb-4 border-b pb-2">Turbidity Limits</h3>
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Warning Threshold (NTU)</label>
                  <input type="number" defaultValue="2.0" className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 text-red-600">Critical Threshold (NTU)</label>
                  <input type="number" defaultValue="5.0" className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-500" />
                </div>
              </div>

              <h3 className="font-semibold text-slate-800 mb-4 border-b pb-2">TDS Limits</h3>
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Warning Threshold (ppm)</label>
                  <input type="number" defaultValue="400" className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 text-red-600">Critical Threshold (ppm)</label>
                  <input type="number" defaultValue="500" className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-500" />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-border">
                <button className="px-4 py-2 border border-border text-slate-700 rounded-md text-sm font-medium hover:bg-card transition-colors">
                  Discard Changes
                </button>
                <button className="px-4 py-2 bg-accent text-white rounded-md text-sm font-medium hover:bg-accent/90 transition-colors">
                  Save Thresholds
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab !== 'users' && activeTab !== 'thresholds' && (
          <div className="flex items-center justify-center h-64 border-2 border-dashed border-border rounded-lg text-slate-400 capitalize">
            {activeTab} Settings Placeholder
          </div>
        )}
      </div>
    </div>
  );
}
