import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTranslation } from 'react-i18next';
import { telemetryService } from '../../../services/api';

export default function LiveCharts() {
  const { t } = useTranslation();
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await telemetryService.getHistory(50); // Last 50 readings
        if (res.success && res.data && res.data.length > 0) {
          // Transform API data for chart — reverse to show oldest first (left to right)
          const transformed = res.data
            .slice()
            .reverse()
            .map((entry) => {
              const date = new Date(entry.timestamp);
              return {
                time: date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
                pH: entry.sensors?.ph ?? null,
                tds: entry.sensors?.tds ?? null,
                turbidity: entry.sensors?.turbidityOut ?? null,
                temperature: entry.sensors?.temperature ?? null,
                flow: entry.sensors?.flowIn ?? null,
              };
            });
          setChartData(transformed);
        }
      } catch (error) {
        console.error('Failed to fetch telemetry history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
    const interval = setInterval(fetchHistory, 30000); // Refresh chart every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white/60 backdrop-blur-md rounded-lg shadow-sm border border-white/40 p-5">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-slate-800">{t('live_event_stream')}</h3>
        <span className="text-xs text-slate-400">
          {chartData.length > 0 ? `${chartData.length} ${t('readings')}` : t('waiting_for_data')}
        </span>
      </div>

      <div className="h-[250px] w-full">
        {loading ? (
          <div className="flex items-center justify-center h-full text-slate-400">
            {t('loading_sensor_history')}
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex items-center justify-center h-full text-slate-400">
            {t('no_telemetry_start_esp32')}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Line yAxisId="left" type="monotone" dataKey="tds" name="TDS (ppm)" stroke="#1e3a8a" strokeWidth={3} dot={false} activeDot={{ r: 6 }} connectNulls />
              <Line yAxisId="left" type="monotone" dataKey="turbidity" name="Turbidity (NTU)" stroke="#f59e0b" strokeWidth={3} dot={false} activeDot={{ r: 6 }} connectNulls />
              <Line yAxisId="right" type="monotone" dataKey="pH" name="pH" stroke="#0d9488" strokeWidth={3} dot={false} activeDot={{ r: 6 }} connectNulls />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
      
      <div className="mt-6 border-t border-slate-100 pt-4 flex gap-4 text-sm justify-center">
        <span className="flex items-center text-muted">
          <span className="w-3 h-3 rounded-full bg-accent mr-2"></span> TDS
        </span>
        <span className="flex items-center text-muted">
          <span className="w-3 h-3 rounded-full bg-warning mr-2"></span> Turbidity
        </span>
        <span className="flex items-center text-muted">
          <span className="w-3 h-3 rounded-full bg-teal mr-2"></span> pH
        </span>
      </div>
    </div>
  );
}
