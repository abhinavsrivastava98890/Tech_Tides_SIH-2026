import { useState } from 'react';
import { ArrowLeft, MapPin, Users, Calendar, Activity, Settings, AlertTriangle, PenTool } from 'lucide-react';

export default function SiteDetail({ site, onBack }) {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'monitoring', label: 'Live Monitoring' },
    { id: 'profile', label: 'Water Profile' },
    { id: 'config', label: 'Treatment Config' },
    { id: 'alerts', label: 'Alerts' },
    { id: 'maintenance', label: 'Maintenance' },
    { id: 'history', label: 'History' },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-4 flex items-center">
        <button onClick={onBack} className="mr-4 text-muted hover:text-slate-800 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-text flex items-center">
            {site.village} Treatment Unit
            <span className="ml-3 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
              {site.unit}
            </span>
          </h2>
          <div className="text-sm text-muted flex items-center mt-1">
            <span className="mr-4">Site ID: <span className="font-medium text-slate-700">{site.id}</span></span>
            <span className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-1" /> {site.block}, {site.district}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-card border-b border-border px-6">
        <nav className="flex space-x-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'border-accent text-primary'
                  : 'border-transparent text-muted hover:text-slate-700 hover:border-border'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 md:p-6 overflow-y-auto">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <div className="bg-card rounded-lg shadow-sm border border-border p-5">
              <h3 className="text-base font-semibold text-slate-800 mb-4 border-b pb-2">Site Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Source Type</span>
                  <span className="font-medium text-text">{site.source}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Population Served</span>
                  <span className="font-medium text-text flex items-center"><Users className="w-4 h-4 mr-1 text-slate-400"/> {site.population.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Installation Date</span>
                  <span className="font-medium text-text flex items-center"><Calendar className="w-4 h-4 mr-1 text-slate-400"/> 12 Aug 2024</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Unit Model</span>
                  <span className="font-medium text-text">JalRakshak V2.1 Modular</span>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg shadow-sm border border-border p-5">
              <h3 className="text-base font-semibold text-slate-800 mb-4 border-b pb-2">Current Configuration</h3>
              <div className="space-y-3">
                <div className="flex items-center text-sm p-2 bg-card rounded border border-slate-100">
                  <Activity className="w-4 h-4 mr-2 text-primary" />
                  <span className="font-medium text-slate-700">Common Filtration Module</span>
                </div>
                <div className="flex items-center text-sm p-2 bg-accent/10 rounded border border-accent/20">
                  <Settings className="w-4 h-4 mr-2 text-primary" />
                  <span className="font-medium text-primary">Fluoride Removal Module (Activated Alumina)</span>
                </div>
                <div className="flex items-center text-sm p-2 bg-card rounded border border-slate-100">
                  <Activity className="w-4 h-4 mr-2 text-primary" />
                  <span className="font-medium text-slate-700">UV Disinfection</span>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg shadow-sm border border-border p-5">
               <h3 className="text-base font-semibold text-slate-800 mb-4 border-b pb-2">Maintenance Status</h3>
               <div className="space-y-4">
                 <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted">Common Filter Life</span>
                      <span className="font-medium text-text">45%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className="bg-accent h-2 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                 </div>
                 <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted">Fluoride Module Media Life</span>
                      <span className="font-medium text-text">12%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className="bg-warning h-2 rounded-full" style={{ width: '12%' }}></div>
                    </div>
                    <p className="text-xs text-warning mt-1 flex items-center">
                      <AlertTriangle className="w-3 h-3 mr-1" /> Media replacement recommended soon
                    </p>
                 </div>
               </div>
               <button className="mt-4 w-full flex items-center justify-center px-4 py-2 border border-accent text-primary rounded-md text-sm font-medium hover:bg-accent/10 transition-colors">
                 <PenTool className="w-4 h-4 mr-2" /> Schedule Maintenance
               </button>
            </div>
          </div>
        )}

        {activeTab !== 'overview' && (
          <div className="flex items-center justify-center h-64 border-2 border-dashed border-border rounded-lg text-slate-400 capitalize">
            {activeTab} content placeholder
          </div>
        )}
      </div>
    </div>
  );
}
