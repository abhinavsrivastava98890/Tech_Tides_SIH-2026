import { BarChart3, Download, PieChart, Activity, Droplets } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { useTranslation } from 'react-i18next';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { addBrandHeaderToPDF } from '../../utils/pdfHelper';

const uptimeData = [
  { name: 'Mon', uptime: 98 }, { name: 'Tue', uptime: 99 }, { name: 'Wed', uptime: 97 },
  { name: 'Thu', uptime: 95 }, { name: 'Fri', uptime: 98 }, { name: 'Sat', uptime: 99 }, { name: 'Sun', uptime: 100 },
];

const alertData = (t) => [
  { name: t('dhanbad'), critical: 4, warning: 12 },
  { name: t('bokaro'), critical: 2, warning: 8 },
  { name: t('ranchi'), critical: 1, warning: 5 },
  { name: t('palamu'), critical: 7, warning: 15 },
  { name: t('sahibganj'), critical: 5, warning: 10 },
];

const CustomTooltip = ({ active, payload, label, suffix = '' }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 p-3 rounded shadow-sm text-sm">
        <p className="font-semibold text-slate-800 mb-2">{label}</p>
        <div className="space-y-1">
          {payload.map((entry, index) => (
            <div key={index} className="flex justify-between items-center space-x-4">
              <span className="text-slate-600 capitalize">{entry.name}</span>
              <span className="text-slate-900 font-medium">{entry.value}{suffix}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default function Analytics() {
  const { t } = useTranslation();

  const handleExport = () => {
    const doc = new jsPDF();
    
    // Add centralized branding header
    addBrandHeaderToPDF(doc, t);
    
    // Title
    doc.setTextColor(15, 23, 42); // slate-900
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(t('analytics_and_reports') || 'Analytics & Reports', 14, 42);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139); // slate-500
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 48);

    // KPI Summary Section
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text('Key Performance Indicators (KPIs)', 14, 62);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`• ${t('total_water_treated') || 'Total Water Treated'}: 14.2M ${t('liters') || 'Liters'}`, 14, 70);
    doc.text(`• ${t('average_system_uptime') || 'Average System Uptime'}: 97.8%`, 14, 76);
    doc.text(`• ${t('module_replacements') || 'Module Replacements'}: 24`, 14, 82);

    // Alert Data Table
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(t('alerts_by_district') || 'Alerts by District', 14, 95);

    const tableColumn = ["District", t('critical_alert') || "Critical", t('warnings') || "Warnings"];
    const tableRows = [];

    alertData(t).forEach(item => {
      const rowData = [
        item.name,
        item.critical,
        item.warning
      ];
      tableRows.push(rowData);
    });

    autoTable(doc, {
      startY: 100,
      head: [tableColumn],
      body: tableRows,
      theme: 'grid',
      headStyles: { fillColor: [13, 148, 136] }, // teal-600
    });

    doc.save('Analytics_Report.pdf');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto h-full overflow-y-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text">{t('analytics_and_reports')}</h1>
          <p className="text-sm text-muted mt-1">{t('analytics_desc')}</p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 w-full md:w-auto">
           <select className="border border-border rounded-md text-sm px-3 py-2 bg-card text-slate-700 w-full sm:w-auto">
             <option>{t('last_7_days')}</option>
             <option>{t('last_30_days')}</option>
             <option>{t('this_quarter')}</option>
             <option>{t('this_year')}</option>
           </select>
           <button onClick={handleExport} className="px-4 py-2 bg-card border border-border text-slate-700 rounded-md text-sm font-medium hover:bg-card transition-colors flex items-center justify-center shadow-sm w-full sm:w-auto">
             <Download className="w-4 h-4 mr-2" /> {t('export_report')}
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-card rounded-lg shadow-sm border border-border p-5 flex items-center">
          <div className="p-4 bg-accent/10 text-primary rounded-full mr-4"><Droplets className="w-6 h-6"/></div>
          <div>
            <p className="text-sm text-muted font-medium">{t('total_water_treated')}</p>
            <p className="text-2xl font-bold text-text">14.2M <span className="text-sm font-normal text-muted">{t('liters')}</span></p>
          </div>
        </div>
        <div className="bg-card rounded-lg shadow-sm border border-border p-5 flex items-center">
          <div className="p-4 bg-green-50 text-success rounded-full mr-4"><Activity className="w-6 h-6"/></div>
          <div>
            <p className="text-sm text-muted font-medium">{t('average_system_uptime')}</p>
            <p className="text-2xl font-bold text-text">97.8%</p>
          </div>
        </div>
        <div className="bg-card rounded-lg shadow-sm border border-border p-5 flex items-center">
          <div className="p-4 bg-yellow-50 text-warning rounded-full mr-4"><BarChart3 className="w-6 h-6"/></div>
          <div>
            <p className="text-sm text-muted font-medium">{t('module_replacements')}</p>
            <p className="text-2xl font-bold text-text">24 <span className="text-sm font-normal text-muted">{t('this_month')}</span></p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Uptime Trend */}
        <div className="bg-card rounded-lg shadow-sm border border-border p-5">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">{t('network_uptime_trend')}</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={uptimeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickMargin={10} />
                <YAxis domain={[90, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(val) => `${val}%`} tickMargin={10} />
                <Tooltip content={<CustomTooltip suffix="%" />} cursor={{ stroke: '#cbd5e1', strokeWidth: 1 }} />
                <Line type="monotone" dataKey="uptime" name={t('uptime')} stroke="#0ea5e9" strokeWidth={2} dot={{ r: 3, fill: '#0ea5e9', strokeWidth: 0 }} activeDot={{ r: 5, fill: '#0284c7', strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alerts by District */}
        <div className="bg-card rounded-lg shadow-sm border border-border p-5">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">{t('alerts_by_district')}</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={alertData(t)} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickMargin={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickMargin={10} />
                <Tooltip content={<CustomTooltip />} cursor={{fill: '#f8fafc'}}/>
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}/>
                <Bar dataKey="warning" name={t('warnings')} stackId="a" fill="#fbbf24" barSize={20} />
                <Bar dataKey="critical" name={t('critical_alert')} stackId="a" fill="#ef4444" barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Consumables & Cost Tracker */}
      <div className="bg-card rounded-lg shadow-sm border border-border p-5">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-800">{t('consumables_cost') || 'Consumables & Cost Tracker'}</h3>
            <p className="text-sm text-muted mt-0.5">{t('consumables_cost_desc') || 'Monthly usage of treatment media and estimated operational costs.'}</p>
          </div>
          <span className="mt-2 md:mt-0 px-3 py-1 bg-accent/10 text-primary text-xs font-bold rounded-full">{t('this_month') || 'This Month'}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-muted uppercase text-xs font-semibold border-b border-border">
              <tr>
                <th className="px-5 py-3">{t('consumable_item') || 'Consumable Item'}</th>
                <th className="px-5 py-3">{t('unit') || 'Unit'}</th>
                <th className="px-5 py-3 text-right">{t('quantity_used') || 'Qty Used'}</th>
                <th className="px-5 py-3 text-right">{t('unit_cost') || 'Unit Cost (₹)'}</th>
                <th className="px-5 py-3 text-right">{t('total_cost') || 'Total Cost (₹)'}</th>
                <th className="px-5 py-3 text-center">{t('stock_status') || 'Stock'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                { item: 'Activated Alumina (Arsenic)', unit: 'kg', qty: 120, unitCost: 350, stock: 'Sufficient' },
                { item: 'Pre-Filter Cartridge (5μ)', unit: 'pcs', qty: 18, unitCost: 220, stock: 'Low' },
                { item: 'Chlorine Tablets (NaDCC)', unit: 'strips', qty: 45, unitCost: 85, stock: 'Sufficient' },
                { item: 'Iron Removal Media (GFH)', unit: 'kg', qty: 80, unitCost: 420, stock: 'Sufficient' },
                { item: 'pH Calibration Buffer', unit: 'bottles', qty: 6, unitCost: 150, stock: 'Low' },
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50">
                  <td className="px-5 py-3 font-medium text-slate-800">{row.item}</td>
                  <td className="px-5 py-3 text-slate-500">{row.unit}</td>
                  <td className="px-5 py-3 text-right text-slate-700 font-semibold">{row.qty}</td>
                  <td className="px-5 py-3 text-right text-slate-500">₹{row.unitCost.toLocaleString()}</td>
                  <td className="px-5 py-3 text-right text-slate-800 font-bold">₹{(row.qty * row.unitCost).toLocaleString()}</td>
                  <td className="px-5 py-3 text-center">
                    <span className={`px-2 py-1 text-xs rounded-full font-semibold ${row.stock === 'Low' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                      {row.stock}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="border-t-2 border-border">
              <tr className="bg-slate-50">
                <td colSpan="4" className="px-5 py-3 text-right font-bold text-slate-700 uppercase text-xs tracking-wider">{t('total_monthly_cost') || 'Total Monthly Cost'}</td>
                <td className="px-5 py-3 text-right text-lg font-bold text-primary">₹{(120*350 + 18*220 + 45*85 + 80*420 + 6*150).toLocaleString()}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
