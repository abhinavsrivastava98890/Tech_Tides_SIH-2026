import { useEffect, useState } from 'react';
import { CheckCircle2, AlertTriangle, AlertOctagon, XCircle } from 'lucide-react';
import { telemetryService } from '../../../services/api';

const StatusBadge = ({ status }) => {
  let color = 'bg-slate-100 text-slate-700';
  let Icon = null;

  if (status === 'Safe' || status === 'Online') {
    color = 'bg-green-100 text-green-700';
    Icon = CheckCircle2;
  }
  else if (status === 'Warning') {
    color = 'bg-yellow-100 text-yellow-700';
    Icon = AlertTriangle;
  }
  else if (status === 'Critical') {
    color = 'bg-red-100 text-red-700';
    Icon = AlertOctagon;
  }
  else if (status === 'Offline' || status === 'Unknown') {
    color = 'bg-slate-200 text-slate-700';
    Icon = XCircle;
  }
  else if (status === 'Maintenance') {
    color = 'bg-orange-100 text-orange-700';
    Icon = AlertTriangle;
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
      {Icon && <Icon className="w-3.5 h-3.5 mr-1" />}
      {status}
    </span>
  );
};
import { useTranslation } from 'react-i18next';

export default function LiveSitesTable() {
  const { t } = useTranslation();
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTelemetry = async () => {
    try {
      const response = await telemetryService.getLatest();
      if (response.success && response.data) {
        const telemetry = response.data;
        
        // Map backend state to UI status
        let waterStatus = 'Unknown';
        if (telemetry.systemState === 'PASS' || telemetry.systemState === 'FILTRATION' || telemetry.systemState === 'UV_ACTIVE') {
          waterStatus = 'Safe';
        } else if (telemetry.systemState === 'REJECT' || telemetry.systemState === 'CRITICAL' || telemetry.systemState === 'FAULT') {
          waterStatus = 'Critical';
        } else {
          waterStatus = 'Warning'; // Boot, Standby etc
        }

        const realSite = {
          id: telemetry.deviceId,
          village: 'Test Bench',
          district: 'Lab',
          source: 'Simulated',
          unit: 'Online',
          water: waterStatus,
          active: 'ESP32 Node'
        };

        setSites([realSite]);
      } else {
        setSites([]);
      }
    } catch (error) {
      console.error('Failed to load telemetry data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
      <div className="px-6 py-4 border-b border-border flex justify-between items-center">
        <h3 className="text-lg font-semibold text-slate-800">{t('live_sites')}</h3>
        <button className="text-sm text-primary font-medium hover:underline">{t('view_all')}</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-card text-muted uppercase text-xs font-semibold">
            <tr>
              <th className="px-6 py-3">{t('site_id')}</th>
              <th className="px-6 py-3">{t('village_district')}</th>
              <th className="px-6 py-3">{t('water_source')}</th>
              <th className="px-6 py-3">{t('unit_status')}</th>
              <th className="px-6 py-3">{t('water_quality')}</th>
              <th className="px-6 py-3">{t('active_modules')}</th>
              <th className="px-6 py-3">{t('action')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sites.map((row) => (
              <tr key={row.id} className="hover:bg-card transition-colors">
                <td className="px-6 py-4 font-medium text-text">
                  {row.id}
                  {row.district === 'Lab' && <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-accent text-white">REAL</span>}
                </td>
                <td className="px-6 py-4">
                  <div>{row.village}</div>
                  <div className="text-xs text-muted">{row.district}</div>
                </td>
                <td className="px-6 py-4 text-muted">{row.source}</td>
                <td className="px-6 py-4"><StatusBadge status={row.unit} /></td>
                <td className="px-6 py-4"><StatusBadge status={row.water} /></td>
                <td className="px-6 py-4 text-muted">{row.active}</td>
                <td className="px-6 py-4">
                  <button className="text-primary hover:text-primary font-medium">{t('details')}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
