import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { telemetryService } from '../../../services/api';
import { useTranslation } from 'react-i18next';

// Fix for default marker icons in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function NetworkStatusMap() {
  const { t } = useTranslation();
  const jharkhandCenter = [23.6102, 85.2799]; // Approximate center of Jharkhand
  const [liveSite, setLiveSite] = useState(null);

  useEffect(() => {
    const fetchTelemetry = async () => {
      try {
        const response = await telemetryService.getLatest();
        if (response.success && response.data) {
          setLiveSite({
            id: response.data.deviceId,
            name: "ESP32 Live Node",
            lat: 23.6102, // Hardcoded for this prototype
            lng: 85.2799,
            status: response.data.systemState
          });
        } else {
          setLiveSite(null);
        }
      } catch (error) {
        console.error('Failed to load map data');
      }
    };
    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-card p-4 rounded-lg shadow-sm border border-border">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">{t('network_status_jharkhand')}</h3>
      <div className="h-[400px] w-full rounded-md overflow-hidden border border-border">
        <MapContainer center={jharkhandCenter} zoom={7} style={{ height: '100%', w: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {liveSite && (
            <Marker position={[liveSite.lat, liveSite.lng]}>
              <Popup>
                <div className="text-sm">
                  <p className="font-semibold">{liveSite.name} ({liveSite.id})</p>
                  <p className="text-muted">Status: <span className="font-bold">{liveSite.status}</span></p>
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
      <div className="flex gap-4 mt-4 text-sm text-muted">
        <span className="flex items-center"><span className="w-3 h-3 rounded-full bg-success mr-2"></span>{t('status_normal')}</span>
        <span className="flex items-center"><span className="w-3 h-3 rounded-full bg-warning mr-2"></span>{t('status_warning')}</span>
        <span className="flex items-center"><span className="w-3 h-3 rounded-full bg-warning mr-2"></span>{t('status_maintenance')}</span>
        <span className="flex items-center"><span className="w-3 h-3 rounded-full bg-danger mr-2"></span>{t('status_critical')}</span>
        <span className="flex items-center"><span className="w-3 h-3 rounded-full bg-status-offline mr-2"></span>{t('status_offline')}</span>
      </div>
    </div>
  );
}
