'use client';
import { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';

type MapUser = {
  id: string;
  name: string | null;
  lastLat: number;
  lastLng: number;
  lastCity: string | null;
  
  
  locationUpdatedAt: string;
};

export default function WorldMap() {
  const [users, setUsers] = useState<MapUser[]>([]);
  const [sharing, setSharing] = useState(false);
  const [shared, setShared] = useState(false);
  const [MapComponents, setMapComponents] = useState<any>(null);

  useEffect(() => {
    // Dynamically import leaflet components to avoid SSR issues
    import('react-leaflet').then(({ MapContainer, TileLayer, Marker, Popup }) => {
      import('leaflet').then((L) => {
        // Fix default marker icons
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        });
        setMapComponents({ MapContainer, TileLayer, Marker, Popup, L });
      });
    });

    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const res = await fetch('/api/location');
      const data = await res.json();
      setUsers(data.users || []);
    } catch {
      // silently ignore if not premium
    }
  }

  async function shareLocation() {
    setSharing(true);
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude: lat, longitude: lng } = pos.coords;
      // Reverse geocode with public API
      let city = '';
      try {
        const geo = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
        const geoData = await geo.json();
        city = geoData.address?.city || geoData.address?.town || geoData.address?.village || '';
      } catch { /* ignore */ }

      await fetch('/api/location', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat, lng, city }),
      });

      setShared(true);
      setSharing(false);
      await fetchUsers();
    }, () => {
      setSharing(false);
      alert('Could not get your location. Please allow location access.');
    });
  }

  return (
    <div>
      <div className="h-[400px] w-full relative">
        {MapComponents ? (
          <MapComponents.MapContainer
            center={[20, 0]}
            zoom={2}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={false}
          >
            <MapComponents.TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {users.map((u) => (
              <MapComponents.Marker key={u.id} position={[u.lastLat, u.lastLng]}>
                <MapComponents.Popup>
                  <div className="text-sm font-sans">
                    <div className="font-bold text-gray-900 mb-1">
                      {u.name || 'Lyfe user'}
                    </div>
                    {u.lastCity && <div className="text-gray-500 text-xs">📍 {u.lastCity}</div>}
                    <div className="mt-2 flex gap-1 flex-wrap">
                      
                      
                    </div>
                  </div>
                </MapComponents.Popup>
              </MapComponents.Marker>
            ))}
          </MapComponents.MapContainer>
        ) : (
          <div className="h-full flex items-center justify-center bg-gray-50">
            <div className="text-center text-gray-400">
              <div className="text-4xl mb-2">🌍</div>
              <p className="text-sm">Loading map...</p>
            </div>
          </div>
        )}
      </div>
      <div className="p-5 border-t border-gray-100 flex items-center justify-between flex-wrap gap-3">
        <div className="text-sm text-gray-500">
          <span className="font-bold text-gray-900">{users.length}</span> users on the map
        </div>
        <button
          onClick={shareLocation}
          disabled={sharing || shared}
          className={`text-sm font-bold px-5 py-2.5 rounded-xl transition ${shared ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-green-500 hover:bg-green-600 text-white shadow-md shadow-green-100'} disabled:opacity-60`}
        >
          {shared ? '✅ You\'re on the map!' : sharing ? '📍 Getting location...' : '📍 Share my location'}
        </button>
      </div>
    </div>
  );
}
