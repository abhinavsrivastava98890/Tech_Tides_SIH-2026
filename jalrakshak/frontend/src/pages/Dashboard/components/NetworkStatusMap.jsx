import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Mock locations in Jharkhand
const mockSites = [
  { id: 1, name: "Dhanbad Plant A", lat: 23.7915, lng: 86.4304, status: "safe" },
  { id: 2, name: "Bokaro Sector 4", lat: 23.6693, lng: 86.1511, status: "warning" },
  { id: 3, name: "Ranchi Kanke", lat: 23.3441, lng: 85.3096, status: "safe" },
  { id: 4, name: "Palamu Village", lat: 24.0333, lng: 84.0667, status: "critical" },
  { id: 5, name: "Sahibganj River", lat: 25.2425, lng: 87.6469, status: "offline" }
];

export default function NetworkStatusMap() {
  const jharkhandCenter = [23.6102, 85.2799]; // Approximate center of Jharkhand

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Network Status (Jharkhand)</h3>
      <div className="h-[400px] w-full rounded-md overflow-hidden border border-slate-200">
        <MapContainer center={jharkhandCenter} zoom={7} style={{ height: '100%', w: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {mockSites.map(site => (
            <Marker key={site.id} position={[site.lat, site.lng]}>
              <Popup>
                <div className="text-sm">
                  <p className="font-semibold">{site.name}</p>
                  <p className="capitalize text-slate-600">Status: {site.status}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      <div className="flex gap-4 mt-4 text-sm text-slate-600">
        <span className="flex items-center"><span className="w-3 h-3 rounded-full bg-status-safe mr-2"></span>Normal</span>
        <span className="flex items-center"><span className="w-3 h-3 rounded-full bg-status-warning mr-2"></span>Warning</span>
        <span className="flex items-center"><span className="w-3 h-3 rounded-full bg-status-maintenance mr-2"></span>Maintenance</span>
        <span className="flex items-center"><span className="w-3 h-3 rounded-full bg-status-critical mr-2"></span>Critical</span>
        <span className="flex items-center"><span className="w-3 h-3 rounded-full bg-status-offline mr-2"></span>Offline</span>
      </div>
    </div>
  );
}
