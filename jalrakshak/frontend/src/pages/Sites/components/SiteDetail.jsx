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
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center">
        <button onClick={onBack} className="mr-4 text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center">
            {site.village} Treatment Unit
            <span className="ml-3 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
              {site.unit}
            </span>
          </h2>
          <div className="text-sm text-slate-500 flex items-center mt-1">
            <span className="mr-4">Site ID: <span className="font-medium text-slate-700">{site.id}</span></span>
            <span className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-1" /> {site.block}, {site.district}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200 px-6">
        <nav className="flex space-x-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'border-brand-blue text-brand-blue'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
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
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">
              <h3 className="text-base font-semibold text-slate-800 mb-4 border-b pb-2">Site Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Source Type</span>
                  <span className="font-medium text-slate-900">{site.source}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Population Served</span>
                  <span className="font-medium text-slate-900 flex items-center"><Users className="w-4 h-4 mr-1 text-slate-400"/> {site.population.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Installation Date</span>
                  <span className="font-medium text-slate-900 flex items-center"><Calendar className="w-4 h-4 mr-1 text-slate-400"/> 12 Aug 2024</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Unit Model</span>
                  <span className="font-medium text-slate-900">JalRakshak V2.1 Modular</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">
              <h3 className="text-base font-semibold text-slate-800 mb-4 border-b pb-2">Current Configuration</h3>
              <div className="space-y-3">
                <div className="flex items-center text-sm p-2 bg-slate-50 rounded border border-slate-100">
                  <Activity className="w-4 h-4 mr-2 text-brand-blue" />
                  <span className="font-medium text-slate-700">Common Filtration Module</span>
                </div>
                <div className="flex items-center text-sm p-2 bg-blue-50 rounded border border-blue-100">
                  <Settings className="w-4 h-4 mr-2 text-brand-blue" />
                  <span className="font-medium text-blue-900">Fluoride Removal Module (Activated Alumina)</span>
                </div>
                <div className="flex items-center text-sm p-2 bg-slate-50 rounded border border-slate-100">
                  <Activity className="w-4 h-4 mr-2 text-brand-blue" />
                  <span className="font-medium text-slate-700">UV Disinfection</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">
               <h3 className="text-base font-semibold text-slate-800 mb-4 border-b pb-2">Maintenance Status</h3>
               <div className="space-y-4">
                 <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-600">Common Filter Life</span>
                      <span className="font-medium text-slate-900">45%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className="bg-brand-blue h-2 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                 </div>
                 <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-600">Fluoride Module Media Life</span>
                      <span className="font-medium text-slate-900">12%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className="bg-status-warning h-2 rounded-full" style={{ width: '12%' }}></div>
                    </div>
                    <p className="text-xs text-status-warning mt-1 flex items-center">
                      <AlertTriangle className="w-3 h-3 mr-1" /> Media replacement recommended soon
                    </p>
                 </div>
               </div>
               <button className="mt-4 w-full flex items-center justify-center px-4 py-2 border border-brand-blue text-brand-blue rounded-md text-sm font-medium hover:bg-blue-50 transition-colors">
                 <PenTool className="w-4 h-4 mr-2" /> Schedule Maintenance
               </button>
            </div>
          </div>
        )}

        {activeTab !== 'overview' && (
          <div className="flex items-center justify-center h-64 border-2 border-dashed border-slate-200 rounded-lg text-slate-400 capitalize">
            {activeTab} content placeholder
          </div>
        )}
      </div>
    </div>
  );
}
