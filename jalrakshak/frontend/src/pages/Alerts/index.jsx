import { useState } from 'react';
import { AlertOctagon, AlertTriangle, Info, CheckCircle2, User, Clock, Search, Filter } from 'lucide-react';

const mockAlerts = [
  { id: 'INC-1024', site: 'Palamu Village (JR-PL-02)', parameter: 'Turbidity', value: '15 NTU', threshold: '5 NTU', severity: 'Critical', status: 'Unassigned', time: '10 mins ago' },
  { id: 'INC-1023', site: 'Bokaro Sector 4 (JR-BK-04)', parameter: 'Filter Pressure', value: '1.2 bar', threshold: '1.5 bar', severity: 'High', status: 'Assigned', time: '1 hr ago', assignee: 'Ramesh K.' },
  { id: 'INC-1022', site: 'Sahibganj River (JR-SG-07)', parameter: 'Connectivity', value: 'Offline', threshold: 'N/A', severity: 'Warning', status: 'Assigned', time: '2 hrs ago', assignee: 'Suresh M.' },
  { id: 'INC-1021', site: 'Dhanbad Plant A (JR-DH-01)', parameter: 'Routine Backwash', value: 'Started', threshold: 'N/A', severity: 'Info', status: 'Resolved', time: '5 hrs ago' },
];

export default function Alerts() {
  const [selectedAlert, setSelectedAlert] = useState(mockAlerts[0]);

  const SeverityBadge = ({ severity }) => {
    let color = 'bg-blue-100 text-blue-700';
    let Icon = Info;
    
    if (severity === 'Critical') { color = 'bg-red-100 text-red-700'; Icon = AlertOctagon; }
    else if (severity === 'High') { color = 'bg-orange-100 text-orange-700'; Icon = AlertTriangle; }
    else if (severity === 'Warning') { color = 'bg-yellow-100 text-yellow-700'; Icon = AlertTriangle; }

    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${color}`}>
        <Icon className="w-3 h-3 mr-1" /> {severity}
      </span>
    );
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="px-6 py-5 border-b border-slate-200 bg-white shrink-0">
        <h1 className="text-2xl font-bold text-slate-900">Alerts & Incidents</h1>
        <p className="text-sm text-slate-500 mt-1">Manage system alerts and automated incident responses.</p>
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Alert List */}
        <div className="w-full md:w-2/5 h-1/2 md:h-auto flex flex-col border-b md:border-b-0 md:border-r border-slate-200 bg-white shrink-0 md:shrink">
          <div className="p-4 border-b border-slate-200 flex space-x-2">
             <div className="relative flex-1">
               <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                 <Search className="h-4 w-4 text-slate-400" />
               </span>
               <input type="text" placeholder="Search alerts..." className="w-full pl-10 pr-3 py-1.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue" />
             </div>
             <button className="px-3 py-1.5 border border-slate-200 rounded-md bg-slate-50 text-slate-600 hover:bg-slate-100">
               <Filter className="w-4 h-4" />
             </button>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {mockAlerts.map(alert => (
              <div 
                key={alert.id}
                onClick={() => setSelectedAlert(alert)}
                className={`p-4 border-b border-slate-100 cursor-pointer transition-colors ${selectedAlert.id === alert.id ? 'bg-blue-50 border-l-4 border-l-brand-blue' : 'hover:bg-slate-50 border-l-4 border-l-transparent'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-semibold text-slate-500">{alert.id}</span>
                  <SeverityBadge severity={alert.severity} />
                </div>
                <h3 className="text-sm font-semibold text-slate-900 mb-1">{alert.parameter} Issue</h3>
                <p className="text-xs text-slate-600 mb-2 truncate">{alert.site}</p>
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <span className="flex items-center"><Clock className="w-3 h-3 mr-1"/> {alert.time}</span>
                  <span className={`px-2 py-0.5 rounded-full ${alert.status === 'Unassigned' ? 'bg-slate-100' : alert.status === 'Resolved' ? 'bg-green-100 text-green-700' : 'bg-brand-blue text-white'}`}>
                    {alert.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alert Detail */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
          {selectedAlert ? (
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-200 bg-slate-900 text-white">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedAlert.parameter} Alert</h2>
                    <p className="text-slate-300 mt-1">{selectedAlert.id} • {selectedAlert.time}</p>
                  </div>
                  <SeverityBadge severity={selectedAlert.severity} />
                </div>
                <div className="flex items-center text-sm text-slate-300">
                  <User className="w-4 h-4 mr-2" />
                  Status: <strong className="ml-1 text-white">{selectedAlert.status}</strong> 
                  {selectedAlert.assignee && <span className="ml-2">({selectedAlert.assignee})</span>}
                </div>
              </div>

              <div className="p-4 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8">
                  <div className="p-4 bg-slate-50 rounded border border-slate-100">
                    <p className="text-xs text-slate-500 mb-1 uppercase tracking-wider font-semibold">Location</p>
                    <p className="font-medium text-slate-900">{selectedAlert.site}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded border border-slate-100">
                    <p className="text-xs text-slate-500 mb-1 uppercase tracking-wider font-semibold">Automated Action Taken</p>
                    <p className="font-medium text-slate-900">{selectedAlert.severity === 'Critical' ? 'Water Dispensing Shutoff' : 'Notification Sent'}</p>
                  </div>
                  <div className="p-4 bg-red-50 rounded border border-red-100">
                    <p className="text-xs text-red-500 mb-1 uppercase tracking-wider font-semibold">Current Value</p>
                    <p className="font-bold text-red-700 text-xl">{selectedAlert.value}</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded border border-green-100">
                    <p className="text-xs text-green-600 mb-1 uppercase tracking-wider font-semibold">Expected Threshold</p>
                    <p className="font-bold text-green-700 text-xl">{selectedAlert.threshold}</p>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-6">
                  <h3 className="font-semibold text-slate-800 mb-4">Incident Actions</h3>
                  <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
                    <button className="w-full md:w-auto px-4 py-2 bg-brand-blue text-white rounded-md text-sm font-medium hover:bg-blue-800 transition-colors">
                      Acknowledge
                    </button>
                    <button className="w-full md:w-auto px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-md text-sm font-medium hover:bg-slate-50 transition-colors">
                      Assign Technician
                    </button>
                    <button className="w-full md:w-auto px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-md text-sm font-medium hover:bg-slate-50 transition-colors text-red-600 hover:text-red-700 hover:border-red-300">
                      Escalate
                    </button>
                    <div className="hidden md:block flex-1"></div>
                    <button className="w-full md:w-auto px-4 py-2 bg-green-100 text-green-700 rounded-md text-sm font-medium hover:bg-green-200 transition-colors flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 mr-2" /> Mark Resolved
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
             <div className="flex items-center justify-center h-full text-slate-400">
               Select an alert to view details
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
