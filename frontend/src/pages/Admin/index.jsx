import { useState } from 'react';
import { Users, Shield, Sliders, Database, Bell, Settings, FileText, X, Upload, Terminal, Loader2, CheckCircle2, Wifi, WifiOff, Signal } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Admin() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('users');
  
  const [usersList, setUsersList] = useState([
    { id: 1, name: 'Super Admin', role: 'Super Admin', phone: '+91 98765 43210', region: 'All Jharkhand', status: 'Active' },
    { id: 2, name: 'Ramesh K.', role: 'Technician', phone: '+91 98765 43211', region: 'Dhanbad, Bokaro', status: 'Active' },
    { id: 3, name: 'Suresh M.', role: 'Technician', phone: '+91 98765 43212', region: 'Sahibganj, Pakur', status: 'Active' },
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', role: 'Technician', phone: '', region: '', status: 'Active' });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    setUsersList([...usersList, { ...newUser, id: Date.now() }]);
    setIsAddModalOpen(false);
    setNewUser({ name: '', role: 'Technician', phone: '', region: '', status: 'Active' });
  };

  const [otaUpdating, setOtaUpdating] = useState(null);
  const [otaSuccess, setOtaSuccess] = useState([]);

  const handleOtaUpdate = (deviceId) => {
    setOtaUpdating(deviceId);
    setTimeout(() => {
      setOtaUpdating(null);
      setOtaSuccess(prev => [...prev, deviceId]);
      setTimeout(() => setOtaSuccess(prev => prev.filter(id => id !== deviceId)), 3000);
    }, 2500);
  };

  const settingsTabs = [
    { id: 'users', label: t('users_management') || 'User Management', icon: Users },
    { id: 'roles', label: t('roles_permissions') || 'Roles & Permissions', icon: Shield },
    { id: 'thresholds', label: t('global_thresholds') || 'Global Thresholds', icon: Sliders },
    { id: 'devices', label: t('device_registry') || 'Device Registry', icon: Database },
    { id: 'ota', label: t('firmware_updates') || 'Firmware (OTA)', icon: Upload },
    { id: 'notifications', label: t('notifications_settings') || 'Notifications', icon: Bell },
    { id: 'system', label: t('system_settings') || 'System Settings', icon: Settings },
    { id: 'audit', label: t('audit_logs') || 'Audit Logs', icon: FileText },
    { id: 'logs', label: t('system_logs') || 'System Logs', icon: Terminal },
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
                <h2 className="text-xl font-bold text-text">{t('users_management') || 'User Management'}</h2>
                <p className="text-sm text-muted mt-1">{t('manage_users_desc') || 'Manage platform users, technicians, and operators.'}</p>
              </div>
              <button onClick={() => setIsAddModalOpen(true)} className="px-4 py-2 bg-accent text-white rounded-md text-sm font-medium hover:bg-accent/90 transition-colors">
                {t('add_user') || '+ Add User'}
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
                  {usersList.map((user) => (
                    <tr key={user.id} className="hover:bg-card">
                      <td className="px-6 py-4 font-medium text-text">{user.name}</td>
                      <td className="px-6 py-4 text-muted">{user.role}</td>
                      <td className="px-6 py-4 text-muted">{user.phone}</td>
                      <td className="px-6 py-4 text-muted">{user.region}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}`}>
                          {user.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Add User Modal */}
            {isAddModalOpen && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
                  <div className="flex justify-between items-center p-4 border-b border-border">
                    <h3 className="font-semibold text-lg text-slate-800">Add New User</h3>
                    <button onClick={() => setIsAddModalOpen(false)} className="text-slate-500 hover:text-slate-700">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <form onSubmit={handleAddSubmit} className="p-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                      <input required type="text" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent" placeholder="e.g. Amit Kumar" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                      <select value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})} className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent">
                        <option>Technician</option>
                        <option>Operator</option>
                        <option>Admin</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                      <input required type="text" value={newUser.phone} onChange={e => setNewUser({...newUser, phone: e.target.value})} className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent" placeholder="+91 " />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Assigned Region</label>
                      <input required type="text" value={newUser.region} onChange={e => setNewUser({...newUser, region: e.target.value})} className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent" placeholder="e.g. Ranchi" />
                    </div>
                    <div className="pt-4 flex justify-end space-x-3 border-t border-border">
                      <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 border border-border text-slate-700 rounded-md text-sm font-medium hover:bg-slate-50 transition-colors">
                        Cancel
                      </button>
                      <button type="submit" className="px-4 py-2 bg-accent text-white rounded-md text-sm font-medium hover:bg-accent/90 transition-colors">
                        Save User
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
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

        {activeTab === 'roles' && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-text">{t('roles_permissions') || 'Roles & Permissions'}</h2>
              <p className="text-sm text-muted mt-1">{t('manage_roles_desc') || 'Manage what different user roles can view and do.'}</p>
            </div>
            <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden max-w-4xl">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-muted uppercase text-xs font-semibold border-b border-border">
                  <tr>
                    <th className="px-6 py-4">{t('permission') || 'Permission'}</th>
                    <th className="px-6 py-4 text-center">Super Admin</th>
                    <th className="px-6 py-4 text-center">Technician</th>
                    <th className="px-6 py-4 text-center">Operator</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    { key: 'View Analytics', text: t('view_analytics') || 'View Analytics' },
                    { key: 'Manage Users', text: t('manage_users') || 'Manage Users' },
                    { key: 'Edit Thresholds', text: t('edit_thresholds') || 'Edit Thresholds' },
                    { key: 'Export Reports', text: t('export_reports') || 'Export Reports' },
                    { key: 'Acknowledge Alerts', text: t('acknowledge_alerts') || 'Acknowledge Alerts' }
                  ].map((perm, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4 font-medium text-slate-700">{perm.text}</td>
                      <td className="px-6 py-4 text-center"><input type="checkbox" defaultChecked className="accent-teal-600 w-4 h-4" /></td>
                      <td className="px-6 py-4 text-center"><input type="checkbox" defaultChecked={perm.key !== 'Manage Users' && perm.key !== 'Edit Thresholds'} className="accent-teal-600 w-4 h-4" /></td>
                      <td className="px-6 py-4 text-center"><input type="checkbox" defaultChecked={perm.key === 'View Analytics' || perm.key === 'Acknowledge Alerts'} className="accent-teal-600 w-4 h-4" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-4 border-t border-border bg-slate-50 flex justify-end">
                <button className="px-4 py-2 bg-accent text-white rounded-md text-sm font-medium hover:bg-accent/90 transition-colors">{t('save_permissions') || 'Save Permissions'}</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'devices' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-text">{t('device_registry') || 'Device Registry'}</h2>
                <p className="text-sm text-muted mt-1">{t('manage_devices_desc') || 'Manage connected IoT sensors and modules.'}</p>
              </div>
              <button className="px-4 py-2 bg-accent text-white rounded-md text-sm font-medium hover:bg-accent/90 transition-colors">
                {t('add_device') || '+ Add Device'}
              </button>
            </div>
            <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-muted uppercase text-xs font-semibold border-b border-border">
                  <tr>
                    <th className="px-6 py-3">{t('device_id') || 'Device ID'}</th>
                    <th className="px-6 py-3">{t('location') || 'Location'}</th>
                    <th className="px-6 py-3">{t('device_type') || 'Type'}</th>
                    <th className="px-6 py-3">{t('last_sync') || 'Last Sync'}</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    { id: 'SEN-001', loc: 'Dhanbad Plant A', type: 'Multi-Sensor', sync: '2 mins ago', status: 'Online' },
                    { id: 'SEN-002', loc: 'Bokaro Main', type: 'Turbidity Sensor', sync: '5 mins ago', status: 'Online' },
                    { id: 'MOD-104', loc: 'Ranchi East', type: 'Flow Module', sync: '2 hours ago', status: 'Offline' }
                  ].map((dev, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4 font-medium text-slate-800">{dev.id}</td>
                      <td className="px-6 py-4 text-slate-600">{dev.loc}</td>
                      <td className="px-6 py-4 text-slate-600">{dev.type}</td>
                      <td className="px-6 py-4 text-slate-600">{dev.sync}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${dev.status === 'Online' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {dev.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-text">{t('notifications_settings') || 'Notification Settings'}</h2>
              <p className="text-sm text-muted mt-1">{t('manage_notifications_desc') || 'Configure how and when you receive system alerts.'}</p>
            </div>
            <div className="bg-card rounded-lg shadow-sm border border-border p-6 max-w-2xl space-y-6">
              {[
                { title: t('email_alerts_title') || 'Email Alerts for Critical Thresholds', desc: t('email_alerts_desc') || 'Receive immediate emails when any parameter crosses a critical limit.' },
                { title: t('sms_alerts_title') || 'SMS Alerts for System Failures', desc: t('sms_alerts_desc') || 'Get text messages if a sensor goes offline for more than 1 hour.' },
                { title: t('weekly_summary_title') || 'Weekly Analytics Summary', desc: t('weekly_summary_desc') || 'Receive a PDF report of water quality metrics every Monday morning.' },
                { title: t('push_notif_title') || 'Browser Push Notifications', desc: t('push_notif_desc') || 'Show desktop notifications for new warnings while dashboard is open.' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between pb-4 border-b border-border last:border-0 last:pb-0">
                  <div>
                    <h3 className="text-sm font-medium text-slate-800">{item.title}</h3>
                    <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked={idx !== 3} className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'system' && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-text">{t('system_settings') || 'System Settings'}</h2>
              <p className="text-sm text-muted mt-1">{t('manage_system_desc') || 'Core platform configuration and preferences.'}</p>
            </div>
            <div className="bg-card rounded-lg shadow-sm border border-border p-6 max-w-2xl space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('data_retention') || 'Data Retention Period'}</label>
                <select className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent">
                  <option>{t('days_30') || '30 Days'}</option>
                  <option>{t('days_90') || '90 Days'}</option>
                  <option>{t('year_1') || '1 Year'}</option>
                  <option>{t('forever') || 'Forever'}</option>
                </select>
                <p className="text-xs text-slate-500 mt-1">{t('data_retention_desc') || 'How long historical telemetry data is kept in the hot database.'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('sys_language') || 'System Language Preference'}</label>
                <select className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent">
                  <option>English</option>
                  <option>Hindi (हिंदी)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('timezone') || 'Timezone'}</label>
                <select className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent">
                  <option>IST (Indian Standard Time)</option>
                  <option>UTC (Coordinated Universal Time)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('backup_freq') || 'Database Backup Frequency'}</label>
                <select className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent">
                  <option>{t('daily') || 'Daily'}</option>
                  <option>{t('weekly') || 'Weekly'}</option>
                  <option>{t('monthly') || 'Monthly'}</option>
                </select>
              </div>
              <div className="pt-4 border-t border-border flex justify-end">
                <button className="px-4 py-2 bg-accent text-white rounded-md text-sm font-medium hover:bg-accent/90 transition-colors">{t('save_settings') || 'Save Settings'}</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'audit' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-text">{t('audit_logs') || 'Audit Logs'}</h2>
                <p className="text-sm text-muted mt-1">{t('manage_audit_desc') || 'Track system changes and user activities.'}</p>
              </div>
              <button className="px-4 py-2 border border-border text-slate-700 rounded-md text-sm font-medium hover:bg-slate-50 transition-colors">
                {t('export_csv') || 'Export CSV'}
              </button>
            </div>
            <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-muted uppercase text-xs font-semibold border-b border-border">
                  <tr>
                    <th className="px-6 py-3">{t('timestamp') || 'Timestamp'}</th>
                    <th className="px-6 py-3">{t('user') || 'User'}</th>
                    <th className="px-6 py-3">{t('action_performed') || 'Action Performed'}</th>
                    <th className="px-6 py-3">{t('ip_address') || 'IP Address'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    { time: 'Sep 19, 10:45 AM', user: 'Super Admin', action: 'Updated Turbidity Critical Threshold to 5.0 NTU', ip: '192.168.1.45' },
                    { time: 'Sep 19, 09:12 AM', user: 'Ramesh K.', action: 'Acknowledged Alert #ALT-892', ip: '10.0.0.12' },
                    { time: 'Sep 18, 04:30 PM', user: 'Super Admin', action: 'Added New User: Suresh M.', ip: '192.168.1.45' },
                    { time: 'Sep 18, 11:20 AM', user: 'System', action: 'Generated Weekly Analytics Report', ip: 'localhost' }
                  ].map((log, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4 whitespace-nowrap text-slate-500">{log.time}</td>
                      <td className="px-6 py-4 font-medium text-slate-700">{log.user}</td>
                      <td className="px-6 py-4 text-slate-600">{log.action}</td>
                      <td className="px-6 py-4 text-slate-400 font-mono text-xs">{log.ip}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'ota' && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-text">{t('firmware_updates') || 'Firmware (OTA) Updates'}</h2>
              <p className="text-sm text-muted mt-1">{t('firmware_desc') || 'Push remote firmware updates to registered IoT devices.'}</p>
            </div>
            <div className="bg-card rounded-lg shadow-sm border border-border p-6 max-w-3xl mb-6">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
                <div>
                  <h3 className="font-semibold text-slate-800">{t('latest_firmware') || 'Latest Firmware Available'}</h3>
                  <p className="text-xs text-slate-500 mt-1">v3.2.1 — Released: Sep 15, 2026</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">STABLE</span>
              </div>
              <div className="text-sm text-slate-600 space-y-1">
                <p>• Improved sensor polling interval (5s → 2s)</p>
                <p>• Fixed pH calibration drift on boot</p>
                <p>• Added watchdog timer for connectivity drops</p>
                <p>• Memory optimization for ESP32-S3 modules</p>
              </div>
            </div>

            <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden max-w-3xl">
              <div className="p-4 bg-slate-50 border-b border-border">
                <h3 className="font-semibold text-slate-800">{t('registered_devices') || 'Registered Devices'}</h3>
              </div>
              <div className="divide-y divide-border">
                {[
                  { id: 'SEN-001', loc: 'Dhanbad Plant A', current: 'v3.1.0', hw: 'ESP32-S3', status: 'Online' },
                  { id: 'SEN-002', loc: 'Bokaro Main', current: 'v3.2.1', hw: 'ESP32-S3', status: 'Online' },
                  { id: 'SEN-003', loc: 'Ranchi East', current: 'v3.0.2', hw: 'ESP32-C3', status: 'Online' },
                  { id: 'MOD-104', loc: 'Palamu Block', current: 'v2.9.5', hw: 'ESP32-S3', status: 'Offline' },
                  { id: 'SEN-005', loc: 'Sahibganj Ward 3', current: 'v3.1.0', hw: 'ESP32-S3', status: 'Online' },
                ].map(dev => (
                  <div key={dev.id} className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-800">{dev.id}</span>
                        <span className={`w-2 h-2 rounded-full ${dev.status === 'Online' ? 'bg-green-500' : 'bg-red-400'}`}></span>
                        <span className="text-xs text-slate-500">{dev.status}</span>
                      </div>
                      <p className="text-sm text-slate-500 mt-0.5">{dev.loc} • {dev.hw} • Current: <span className={`font-mono ${dev.current === 'v3.2.1' ? 'text-green-600' : 'text-amber-600'}`}>{dev.current}</span></p>
                    </div>
                    <div>
                      {dev.current === 'v3.2.1' ? (
                        <span className="flex items-center text-green-600 text-sm font-medium"><CheckCircle2 className="w-4 h-4 mr-1" /> Up to date</span>
                      ) : dev.status === 'Offline' ? (
                        <span className="text-sm text-slate-400 italic">Device offline</span>
                      ) : otaUpdating === dev.id ? (
                        <button disabled className="px-4 py-2 bg-indigo-400 text-white rounded-md text-sm font-medium flex items-center cursor-not-allowed">
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Updating...
                        </button>
                      ) : otaSuccess.includes(dev.id) ? (
                        <button disabled className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium flex items-center">
                          <CheckCircle2 className="w-4 h-4 mr-2" /> Updated!
                        </button>
                      ) : (
                        <button onClick={() => handleOtaUpdate(dev.id)} className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center shadow-sm">
                          <Upload className="w-4 h-4 mr-2" /> Update to v3.2.1
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'logs' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-text">{t('system_logs') || 'System Logs'}</h2>
                <p className="text-sm text-muted mt-1">{t('system_logs_desc') || 'Raw IoT telemetry logs, connection events, and system diagnostics.'}</p>
              </div>
              <div className="flex gap-2">
                <span className="flex items-center px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-xs font-bold">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                  LIVE
                </span>
              </div>
            </div>
            <div className="bg-slate-900 rounded-lg shadow-sm border border-slate-700 overflow-hidden max-w-4xl font-mono text-xs">
              <div className="px-4 py-3 bg-slate-800 border-b border-slate-700 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-slate-400" />
                <span className="text-slate-300 font-semibold text-sm">IoT Telemetry Stream</span>
              </div>
              <div className="p-4 space-y-1 max-h-[500px] overflow-y-auto">
                {[
                  { time: '19:25:01.342', level: 'INFO', device: 'SEN-001', msg: 'Telemetry ping received — pH: 7.2, Turbidity: 1.8 NTU, TDS: 320 ppm', signal: '98%' },
                  { time: '19:25:01.510', level: 'INFO', device: 'SEN-002', msg: 'Telemetry ping received — pH: 6.9, Turbidity: 2.1 NTU, TDS: 410 ppm', signal: '94%' },
                  { time: '19:25:02.001', level: 'WARN', device: 'SEN-003', msg: 'High latency detected — response time 1200ms (threshold: 500ms)', signal: '62%' },
                  { time: '19:25:02.103', level: 'INFO', device: 'SEN-005', msg: 'Telemetry ping received — pH: 7.4, Turbidity: 0.9 NTU, TDS: 280 ppm', signal: '91%' },
                  { time: '19:24:58.700', level: 'ERROR', device: 'MOD-104', msg: 'Connection timeout — no response after 3 retries. Device marked offline.', signal: '0%' },
                  { time: '19:24:55.120', level: 'INFO', device: 'SEN-001', msg: 'Telemetry ping received — pH: 7.2, Turbidity: 1.7 NTU, TDS: 318 ppm', signal: '99%' },
                  { time: '19:24:55.340', level: 'INFO', device: 'SEN-002', msg: 'Telemetry ping received — pH: 6.8, Turbidity: 2.0 NTU, TDS: 412 ppm', signal: '95%' },
                  { time: '19:24:50.001', level: 'INFO', device: 'SYSTEM', msg: 'Watchdog heartbeat — all online nodes responding within SLA.', signal: '-' },
                  { time: '19:24:45.800', level: 'WARN', device: 'SEN-003', msg: 'Signal strength degraded — RSSI: -78dBm (fair). Consider antenna check.', signal: '58%' },
                  { time: '19:24:40.230', level: 'INFO', device: 'SEN-001', msg: 'OTA firmware update check — current v3.1.0, latest v3.2.1. Update pending.', signal: '98%' },
                  { time: '19:24:35.100', level: 'INFO', device: 'SEN-005', msg: 'Backwash cycle completed — duration 45s, water used 12L.', signal: '90%' },
                  { time: '19:24:30.050', level: 'ERROR', device: 'MOD-104', msg: 'TCP handshake failed — MQTT broker connection refused (ECONNREFUSED).', signal: '0%' },
                ].map((log, idx) => (
                  <div key={idx} className="flex items-start gap-3 py-1 hover:bg-slate-800/50 px-2 rounded">
                    <span className="text-slate-500 whitespace-nowrap">{log.time}</span>
                    <span className={`font-bold whitespace-nowrap ${
                      log.level === 'ERROR' ? 'text-red-400' : 
                      log.level === 'WARN' ? 'text-amber-400' : 
                      'text-green-400'
                    }`}>[{log.level}]</span>
                    <span className="text-cyan-400 whitespace-nowrap">{log.device}</span>
                    <span className="text-slate-300">{log.msg}</span>
                    {log.signal !== '-' && (
                      <span className={`ml-auto whitespace-nowrap flex items-center gap-1 ${
                        parseInt(log.signal) > 80 ? 'text-green-500' :
                        parseInt(log.signal) > 50 ? 'text-amber-500' :
                        'text-red-500'
                      }`}>
                        <Signal className="w-3 h-3" />{log.signal}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
