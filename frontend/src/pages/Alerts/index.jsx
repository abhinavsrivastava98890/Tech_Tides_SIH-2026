import { useState, useEffect } from 'react';
import { AlertOctagon, AlertTriangle, Info, CheckCircle2, User, Clock, Search, Filter } from 'lucide-react';
import { alertService } from '../../services/api';
import { useTranslation } from 'react-i18next';

export default function Alerts() {
  const { t } = useTranslation();
  const [alerts, setAlerts] = useState([]);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchCategory, setSearchCategory] = useState('All');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [isResolving, setIsResolving] = useState(false);
  const [showAllAlerts, setShowAllAlerts] = useState(false);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await alertService.getActive();
        if (res.success && res.data) {
          const formattedAlerts = res.data.map(a => ({
            id: a.alertId || a._id,
            site: a.deviceId,
            parameter: a.faultName,
            value: `Code: ${a.faultCode}`,
            threshold: 'N/A',
            severity: a.severity.charAt(0).toUpperCase() + a.severity.slice(1).toLowerCase(),
            status: a.resolved ? 'Resolved' : 'Active',
            time: new Date(a.timestamp).toLocaleTimeString(),
            message: a.message
          }));
          setAlerts(formattedAlerts);
          if (formattedAlerts.length > 0 && !selectedAlert) {
            setSelectedAlert(formattedAlerts[0]);
          }
        }
      } catch (err) {
        console.error('Failed to fetch live alerts', err);
      }
    };
    fetchAlerts();
    const int = setInterval(fetchAlerts, 10000);
    return () => clearInterval(int);
  }, []);

  const filteredAlerts = alerts.filter(alert => {
    let matchesSearch = true;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (searchCategory === 'All') {
        matchesSearch = alert.parameter.toLowerCase().includes(q) || 
                        alert.site.toLowerCase().includes(q) ||
                        alert.id.toLowerCase().includes(q);
      } else if (searchCategory === 'ID') {
        matchesSearch = alert.id.toLowerCase().includes(q);
      } else if (searchCategory === 'Location') {
        matchesSearch = alert.site.toLowerCase().includes(q);
      } else if (searchCategory === 'Parameter') {
        matchesSearch = alert.parameter.toLowerCase().includes(q);
      }
    }
    
    let matchesSeverity = filterSeverity === 'All' ? true : alert.severity === filterSeverity;
    let matchesStatus = filterStatus === 'All' ? true : alert.status === filterStatus;
    
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const handleResolve = async () => {
    if (!selectedAlert || selectedAlert.status === 'Resolved' || isResolving) return;
    setIsResolving(true);
    try {
      await alertService.resolveAlert(selectedAlert.id);
      const updatedAlerts = alerts.map(a => 
        a.id === selectedAlert.id ? { ...a, status: 'Resolved' } : a
      );
      setAlerts(updatedAlerts);
      setSelectedAlert({ ...selectedAlert, status: 'Resolved' });
    } catch (err) {
      console.error('Failed to resolve alert', err);
      alert('Failed to resolve alert.');
    } finally {
      setIsResolving(false);
    }
  };

  const handleAction = (actionName) => {
    if (!selectedAlert) return;
    alert(`${actionName} action triggered for ${selectedAlert.id}`);
  };

  const SeverityBadge = ({ severity }) => {
    let color = 'bg-accent/20 text-accent';
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
    <div className="flex justify-center h-full bg-transparent md:p-6">
      <div className="flex flex-col h-full w-full max-w-7xl bg-white md:rounded-2xl md:shadow-sm md:border border-slate-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 bg-white shrink-0">
          <h1 className="text-2xl font-bold text-slate-800">{t('page_alerts')}</h1>
          <p className="text-sm text-slate-600 mt-1">{t('desc_alerts')}</p>
        </div>

        <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-slate-50">
        {/* Alert List */}
        <div className={`w-full md:w-5/12 lg:w-1/2 flex flex-col border-b md:border-b-0 md:border-r border-slate-200 md:mr-3 lg:mr-4 shadow-[1px_0_4px_rgba(0,0,0,0.02)] bg-white shrink-0 md:shrink ${selectedAlert ? 'hidden md:flex' : 'flex-1 md:flex-auto'}`}>
          <div className="p-4 border-b border-slate-100 flex space-x-2 bg-slate-50/50 relative z-40">
             <div className="relative flex-1">
               <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                 <Search className="h-4 w-4 text-slate-400" />
               </span>
               <input 
                 type="text" 
                 placeholder={`Search ${searchCategory === 'All' ? 'alerts' : searchCategory.toLowerCase()}...`}
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all shadow-sm" 
               />
             </div>
             <div>
               <button 
                 onClick={() => setShowFilterMenu(!showFilterMenu)}
                 className={`px-3 py-2 border rounded-lg text-sm font-medium flex items-center gap-2 transition-all shadow-sm ${showFilterMenu || filterSeverity !== 'All' || filterStatus !== 'All' || searchCategory !== 'All' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
               >
                 <Filter className="w-4 h-4" />
                 <span className="hidden xl:inline">Filters</span>
               </button>
               
               {showFilterMenu && (
                 <div className="absolute left-4 right-4 md:left-auto md:right-4 top-full mt-2 md:w-[340px] bg-white border border-slate-200 rounded-lg shadow-2xl z-50 p-4">
                    
                    <div className="mb-5">
                      <label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-wider">Search Category</label>
                      <div className="flex flex-wrap gap-1.5">
                        {['All Fields', 'Alert ID', 'Location', 'Parameter'].map(cat => {
                           const value = cat === 'All Fields' ? 'All' : cat === 'Alert ID' ? 'ID' : cat;
                           return (
                             <button
                               key={cat}
                               onClick={() => setSearchCategory(value)}
                               className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${searchCategory === value ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                             >
                               {cat}
                             </button>
                           );
                        })}
                      </div>
                    </div>
                    
                    <div className="mb-5">
                      <label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-wider">Severity</label>
                      <div className="flex flex-wrap gap-1.5">
                        {['All', 'Critical', 'High', 'Warning'].map(sev => (
                           <button
                             key={sev}
                             onClick={() => setFilterSeverity(sev)}
                             className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${filterSeverity === sev ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                           >
                             {sev === 'All' ? 'All Severities' : sev}
                           </button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-wider">Status</label>
                      <div className="flex flex-wrap gap-1.5">
                        {['All', 'Active', 'Resolved'].map(stat => (
                           <button
                             key={stat}
                             onClick={() => setFilterStatus(stat)}
                             className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${filterStatus === stat ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                           >
                             {stat === 'All' ? 'All Statuses' : stat}
                           </button>
                        ))}
                      </div>
                    </div>

                 </div>
               )}
             </div>
          </div>
          
          <div className="flex-1 overflow-y-auto bg-slate-50/30 pb-4">
            {filteredAlerts.length === 0 ? (
              <div className="p-8 text-center text-slate-500">No alerts found.</div>
            ) : (
              <>
                {(showAllAlerts ? filteredAlerts : filteredAlerts.slice(0, 3)).map(alert => {
                  const isActive = selectedAlert?.id === alert.id;
                  return (
                    <div 
                      key={alert.id}
                      onClick={() => setSelectedAlert(alert)}
                      className={`p-4 border-b border-slate-100 cursor-pointer transition-all duration-200 relative ${
                        isActive 
                          ? 'bg-blue-50/60' 
                          : 'hover:bg-slate-50 bg-white'
                      }`}
                    >
                      {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>}
                      
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">{alert.id}</span>
                        <SeverityBadge severity={alert.severity} />
                      </div>
                      
                      <h3 className={`text-sm font-bold mb-1 line-clamp-1 ${isActive ? 'text-blue-900' : 'text-slate-800'}`}>
                        {alert.parameter.replace(/_/g, ' ')} Issue
                      </h3>
                      
                      <p className="text-[11px] text-slate-500 mb-3 truncate font-medium">{alert.site}</p>
                      
                      <div className="flex justify-between items-center text-[11px] font-medium text-slate-500">
                        <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1.5 text-slate-400"/> {alert.time}</span>
                        <span className={`px-2 py-0.5 rounded text-[9px] uppercase tracking-wider font-bold ${
                          alert.status === 'Unassigned' ? 'bg-slate-100 text-slate-600' : 
                          alert.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700' : 
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {alert.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
                
                {filteredAlerts.length > 3 && (
                  <div className="p-3 text-center mt-2">
                    <button 
                      onClick={() => setShowAllAlerts(!showAllAlerts)} 
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-full transition-colors"
                    >
                      {showAllAlerts ? 'Show Less' : `View All Alerts (${filteredAlerts.length})`}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Alert Detail */}
        <div className={`flex-1 overflow-y-auto bg-white flex flex-col ${!selectedAlert ? 'hidden md:flex' : ''}`}>
          {selectedAlert ? (
            <div className="w-full flex flex-col min-h-full">
              <div className="border-b border-slate-200 bg-slate-800 text-white relative shrink-0">
                <div className="py-3 px-4 md:py-3.5 md:px-5 w-full max-w-3xl mx-auto">
                  <button 
                    onClick={() => setSelectedAlert(null)} 
                    className="md:hidden mb-2.5 text-[11px] text-slate-300 hover:text-white flex items-center font-bold bg-slate-700/50 px-2 py-1 rounded-md w-fit border border-slate-600"
                  >
                    ← Back to Alerts
                  </button>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h2 className="text-base font-bold leading-tight">{selectedAlert.parameter.replace(/_/g, ' ')} Alert</h2>
                      <p className="text-[11px] text-slate-300 mt-0.5">{selectedAlert.id} • {selectedAlert.time}</p>
                    </div>
                    <div className="scale-90 origin-top-right">
                      <SeverityBadge severity={selectedAlert.severity} />
                    </div>
                  </div>
                  <div className="flex items-center text-[10px] md:text-[11px] text-slate-300">
                    <User className="w-3 h-3 mr-1" />
                    Status: <strong className="ml-1 text-white">{selectedAlert.status}</strong> 
                    {selectedAlert.assignee && <span className="ml-1.5">({selectedAlert.assignee})</span>}
                  </div>
                </div>
              </div>

              <div className="flex-1 w-full max-w-3xl mx-auto p-4 md:p-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                  <div className="p-2 sm:p-2.5 bg-slate-50 rounded border border-slate-100">
                    <p className="text-[9px] text-slate-500 mb-0.5 uppercase tracking-wider font-bold">Location</p>
                    <p className="text-xs font-semibold text-slate-800">{selectedAlert.site}</p>
                  </div>
                  <div className="p-2 sm:p-2.5 bg-slate-50 rounded border border-slate-100">
                    <p className="text-[9px] text-slate-500 mb-0.5 uppercase tracking-wider font-bold">Action Taken</p>
                    <p className="text-xs font-semibold text-slate-800">{selectedAlert.severity === 'Critical' ? 'Water Dispensing Shutoff' : 'Notification Sent'}</p>
                  </div>
                  <div className="p-2 sm:p-2.5 bg-red-50 rounded border border-red-100">
                    <p className="text-[9px] text-red-500 mb-0.5 uppercase tracking-wider font-bold">Current Value</p>
                    <p className="font-bold text-red-700 text-sm">{selectedAlert.value}</p>
                  </div>
                  <div className="p-2 sm:p-2.5 bg-green-50 rounded border border-green-100">
                    <p className="text-[9px] text-green-600 mb-0.5 uppercase tracking-wider font-bold">Expected Threshold</p>
                    <p className="font-bold text-green-700 text-sm">{selectedAlert.threshold}</p>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-3 sm:pt-4">
                  <h3 className="text-xs font-bold text-slate-800 mb-2.5">Incident Actions</h3>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => handleAction('Acknowledge')} className="flex-1 sm:flex-none px-2.5 py-1.5 bg-blue-600 text-white rounded text-[11px] font-semibold hover:bg-blue-700 transition-colors">
                      Acknowledge
                    </button>
                    <button onClick={() => handleAction('Assign Technician')} className="flex-1 sm:flex-none px-2.5 py-1.5 bg-white border border-slate-200 text-slate-700 rounded text-[11px] font-semibold hover:bg-slate-50 transition-colors">
                      Assign Tech
                    </button>
                    <button onClick={() => handleAction('Escalate')} className="flex-1 sm:flex-none px-2.5 py-1.5 bg-white border border-slate-200 text-red-600 rounded text-[11px] font-semibold hover:bg-red-50 hover:border-red-200 transition-colors">
                      Escalate
                    </button>
                    <div className="hidden sm:block flex-1"></div>
                    <button 
                      onClick={handleResolve}
                      disabled={selectedAlert.status === 'Resolved' || isResolving}
                      className={`w-full sm:w-auto px-3 py-1.5 rounded text-[11px] font-bold flex items-center justify-center transition-colors ${selectedAlert.status === 'Resolved' ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'}`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> {isResolving ? 'Resolving...' : selectedAlert.status === 'Resolved' ? 'Resolved' : 'Mark Resolved'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
             <div className="flex items-center justify-center h-full text-slate-400 w-full text-sm font-medium">
               Select an alert to view details
             </div>
          )}
        </div>
      </div>
    </div>
    </div>
  );
}
