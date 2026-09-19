import { BarChart3, Download, PieChart, Activity, Droplets } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

const uptimeData = [
  { name: 'Mon', uptime: 98 }, { name: 'Tue', uptime: 99 }, { name: 'Wed', uptime: 97 },
  { name: 'Thu', uptime: 95 }, { name: 'Fri', uptime: 98 }, { name: 'Sat', uptime: 99 }, { name: 'Sun', uptime: 100 },
];

const alertData = [
  { name: 'Dhanbad', critical: 4, warning: 12 },
  { name: 'Bokaro', critical: 2, warning: 8 },
  { name: 'Ranchi', critical: 1, warning: 5 },
  { name: 'Palamu', critical: 7, warning: 15 },
  { name: 'Sahibganj', critical: 5, warning: 10 },
];

export default function Analytics() {
  return (
    <div className="p-6 max-w-7xl mx-auto h-full overflow-y-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text">Analytics & Reports</h1>
          <p className="text-sm text-muted mt-1">System-wide performance, water quality trends, and operational metrics.</p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 w-full md:w-auto">
           <select className="border border-border rounded-md text-sm px-3 py-2 bg-card text-slate-700 w-full sm:w-auto">
             <option>Last 7 Days</option>
             <option>Last 30 Days</option>
             <option>This Quarter</option>
             <option>This Year</option>
           </select>
           <button className="px-4 py-2 bg-card border border-border text-slate-700 rounded-md text-sm font-medium hover:bg-card transition-colors flex items-center justify-center shadow-sm w-full sm:w-auto">
             <Download className="w-4 h-4 mr-2" /> Export Report
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-card rounded-lg shadow-sm border border-border p-5 flex items-center">
          <div className="p-4 bg-accent/10 text-primary rounded-full mr-4"><Droplets className="w-6 h-6"/></div>
          <div>
            <p className="text-sm text-muted font-medium">Total Water Treated</p>
            <p className="text-2xl font-bold text-text">14.2M <span className="text-sm font-normal text-muted">Liters</span></p>
          </div>
        </div>
        <div className="bg-card rounded-lg shadow-sm border border-border p-5 flex items-center">
          <div className="p-4 bg-green-50 text-success rounded-full mr-4"><Activity className="w-6 h-6"/></div>
          <div>
            <p className="text-sm text-muted font-medium">Average System Uptime</p>
            <p className="text-2xl font-bold text-text">97.8%</p>
          </div>
        </div>
        <div className="bg-card rounded-lg shadow-sm border border-border p-5 flex items-center">
          <div className="p-4 bg-yellow-50 text-warning rounded-full mr-4"><BarChart3 className="w-6 h-6"/></div>
          <div>
            <p className="text-sm text-muted font-medium">Module Replacements</p>
            <p className="text-2xl font-bold text-text">24 <span className="text-sm font-normal text-muted">this month</span></p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Uptime Trend */}
        <div className="bg-card rounded-lg shadow-sm border border-border p-5">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Network Uptime Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={uptimeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorUptime" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis domain={[90, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip />
                <Area type="monotone" dataKey="uptime" stroke="#0d9488" strokeWidth={3} fillOpacity={1} fill="url(#colorUptime)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alerts by District */}
        <div className="bg-card rounded-lg shadow-sm border border-border p-5">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Alerts by District</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={alertData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip cursor={{fill: '#f8fafc'}}/>
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }}/>
                <Bar dataKey="warning" name="Warnings" stackId="a" fill="#eab308" radius={[0, 0, 4, 4]} />
                <Bar dataKey="critical" name="Critical" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Table Placeholder */}
      <div className="bg-card rounded-lg shadow-sm border border-border p-5">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Scheduled Reports</h3>
        <div className="flex items-center justify-center h-32 border-2 border-dashed border-border rounded-lg text-slate-400">
           Reports table placeholder
        </div>
      </div>
    </div>
  );
}
