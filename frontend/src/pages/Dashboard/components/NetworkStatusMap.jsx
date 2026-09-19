import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Search } from 'lucide-react';
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

const JHARKHAND_LOCATIONS = {
  ranchi: [23.3441, 85.3096],
  dhanbad: [23.7957, 86.4304],
  jamshedpur: [22.8046, 86.2029],
  bokaro: [23.7337, 85.9926],
  hazaribagh: [23.9925, 85.3637],
  deoghar: [24.4828, 86.6997],
  giridih: [24.1856, 86.3031]
};

function MapController({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 9);
    }
  }, [center, map]);
  return null;
}

export default function NetworkStatusMap() {
  const { t } = useTranslation();
  const jharkhandCenter = [23.6102, 85.2799]; // Approximate center of Jharkhand
  const [liveSite, setLiveSite] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mapCenter, setMapCenter] = useState(jharkhandCenter);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setMapCenter(jharkhandCenter);
      setErrorMsg('');
      return;
    }
    
    const query = searchQuery.toLowerCase().trim();
    let found = false;
    for (const [key, coords] of Object.entries(JHARKHAND_LOCATIONS)) {
      if (key.includes(query) || query.includes(key)) {
        setMapCenter(coords);
        setErrorMsg('');
        found = true;
        break;
      }
    }
    
    if (!found) {
      setErrorMsg('Location not found in database');
      setTimeout(() => setErrorMsg(''), 3000);
    }
  };

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
      <div className="relative h-[400px] w-full rounded-md overflow-hidden border border-border">
        {/* Search Bar Overlay */}
        <div className="absolute top-4 right-4 z-[1000]">
          <form onSubmit={handleSearch} className="relative flex items-center bg-white rounded-md shadow-md border border-slate-200 overflow-hidden">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search district (e.g. Ranchi)..."
              className="px-3 py-2 text-sm outline-none w-48 focus:w-56 transition-all"
            />
            <button type="submit" className="px-3 py-2 bg-slate-50 hover:bg-slate-100 border-l border-slate-200 text-slate-500 transition-colors">
              <Search className="w-4 h-4" />
            </button>
          </form>
          {errorMsg && (
            <div className="absolute top-full right-0 mt-2 px-3 py-1 bg-red-100 text-red-600 text-xs rounded shadow-sm whitespace-nowrap animate-in fade-in">
              {errorMsg}
            </div>
          )}
        </div>

        <MapContainer center={jharkhandCenter} zoom={7} style={{ height: '100%', width: '100%' }}>
          <MapController center={mapCenter} />
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
