import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockData = [
  { time: '10:00', pH: 7.2, tds: 450, turbidity: 4.5 },
  { time: '11:00', pH: 7.3, tds: 440, turbidity: 4.2 },
  { time: '12:00', pH: 7.1, tds: 460, turbidity: 3.8 },
  { time: '13:00', pH: 6.9, tds: 480, turbidity: 5.1 },
  { time: '14:00', pH: 6.8, tds: 510, turbidity: 6.2 }, // Spike
  { time: '15:00', pH: 7.0, tds: 470, turbidity: 4.0 },
  { time: '16:00', pH: 7.2, tds: 450, turbidity: 3.5 },
];

export default function LiveCharts() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5 h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-slate-800">Live Event Stream</h3>
        <select className="border border-slate-300 rounded-md text-sm px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-brand-blue">
          <option>Last 6 Hours</option>
          <option>Last 24 Hours</option>
          <option>Last 7 Days</option>
        </select>
      </div>

      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={mockData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
            <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
            <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Line yAxisId="left" type="monotone" dataKey="tds" name="TDS (ppm)" stroke="#1e3a8a" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            <Line yAxisId="left" type="monotone" dataKey="turbidity" name="Turbidity (NTU)" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
            <Line yAxisId="right" type="monotone" dataKey="pH" name="pH" stroke="#0d9488" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-6 border-t border-slate-100 pt-4 flex gap-4 text-sm justify-center">
        <span className="flex items-center text-slate-600">
          <span className="w-3 h-3 rounded-full bg-brand-blue mr-2"></span> TDS
        </span>
        <span className="flex items-center text-slate-600">
          <span className="w-3 h-3 rounded-full bg-status-warning mr-2"></span> Turbidity
        </span>
        <span className="flex items-center text-slate-600">
          <span className="w-3 h-3 rounded-full bg-brand-teal mr-2"></span> pH
        </span>
      </div>
    </div>
  );
}
