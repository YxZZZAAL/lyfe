'use client';
import { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { THEMES } from '@/lib/pets';

type MapUser = {
  id: string;
  name: string | null;
  lastLat: number;
  lastLng: number;
  lastCity: string | null;
  activePet: { id: string; name: string; emoji: string; rarity: string } | null;
  petCount: number;
  profileTheme: string;
  locationUpdatedAt: string;
};

export default function FullMap() {
  const [users, setUsers] = useState<MapUser[]>([]);
  const [sharing, setSharing] = useState(false);
  const [shared, setShared] = useState(false);
  const [selected, setSelected] = useState<MapUser | null>(null);
  const [Map, setMap] = useState<any>(null);

  useEffect(() => {
    Promise.all([import('react-leaflet'), import('leaflet')]).then(([rl, L]) => {
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });
      setMap({ ...rl, L });
    });
    fetchUsers();
    const interval = setInterval(fetchUsers, 30000);
    return () => clearInterval(interval);
  }, []);

  async function fetchUsers() {
    try {
      const res = await fetch('/api/location');
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } catch { /* ignore */ }
  }

  async function shareLocation() {
    setSharing(true);
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude: lat, longitude: lng } = pos.coords;
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
      alert('Please allow location access to share your pin.');
    });
  }

  const selectedTheme = selected ? THEMES.find(t => t.id === selected.profileTheme) : null;

  return (
    <div className="flex flex-col h-full min-h-[500px]">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-semibold text-gray-700">{users.length} user{users.length !== 1 ? 's' : ''} live</span>
          </div>
          <span className="text-gray-300">·</span>
          <span className="text-xs text-gray-400">Updates every 30s</span>
        </div>
        <button onClick={shareLocation} disabled={sharing || shared}
          className={`text-sm font-bold px-5 py-2 rounded-xl transition shadow-sm ${shared ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-green-500 hover:bg-green-600 text-white shadow-green-100'} disabled:opacity-60`}>
          {shared ? '📍 You\'re on the map!' : sharing ? 'Getting location...' : '📍 Drop my pin'}
        </button>
      </div>

      <div className="flex flex-1">
        {/* Map */}
        <div className="flex-1">
          {Map ? (
            <Map.MapContainer center={[30, 10]} zoom={2} style={{ height: '100%', minHeight: 460, width: '100%' }} scrollWheelZoom zoomControl>
              <Map.TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {users.map((u) => {
                const icon = Map.L.divIcon({
                  className: '',
                  html: `<div style="background:white;border:2px solid #22c55e;border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;font-size:18px;box-shadow:0 2px 8px rgba(0,0,0,0.15);cursor:pointer">${u.activePet?.emoji || '👤'}</div>`,
                  iconSize: [36, 36],
                  iconAnchor: [18, 18],
                });
                return (
                  <Map.Marker key={u.id} position={[u.lastLat, u.lastLng]} icon={icon}
                    eventHandlers={{ click: () => setSelected(u) }}>
                  </Map.Marker>
                );
              })}
            </Map.MapContainer>
          ) : (
            <div className="h-full flex items-center justify-center bg-green-50">
              <div className="text-center text-gray-400">
                <div className="text-4xl mb-2 animate-bounce">🌍</div>
                <p className="text-sm">Loading map...</p>
              </div>
            </div>
          )}
        </div>

        {/* Side panel */}
        <div className="w-72 border-l border-gray-100 flex flex-col flex-shrink-0 overflow-y-auto">
          {selected ? (
            <div className="p-5">
              <button onClick={() => setSelected(null)} className="text-xs text-gray-400 hover:text-gray-700 mb-4 flex items-center gap-1">← Back to list</button>
              <div className={`bg-gradient-to-br ${selectedTheme?.gradient || 'from-green-50 to-emerald-50'} rounded-2xl p-4 mb-4`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl shadow-sm">
                    {selected.activePet?.emoji || '👤'}
                  </div>
                  <div>
                    <div className="font-black text-gray-900">{selected.name || 'Lyfe user'}</div>
                    {selected.lastCity && <div className="text-xs text-gray-500">📍 {selected.lastCity}</div>}
                  </div>
                </div>
                {selected.activePet && (
                  <div className="bg-white rounded-xl p-2.5 flex items-center gap-2">
                    <span className="text-xl">{selected.activePet.emoji}</span>
                    <div>
                      <div className="text-xs font-bold text-gray-800">{selected.activePet.name}</div>
                      <div className="text-xs text-gray-400 capitalize">{selected.activePet.rarity} companion</div>
                    </div>
                  </div>
                )}
              </div>
              <div className="text-xs text-gray-500 text-center">{selected.petCount} companion{selected.petCount !== 1 ? 's' : ''} collected</div>
              <div className="text-xs text-gray-400 text-center mt-1">
                Last seen {new Date(selected.locationUpdatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ) : (
            <div className="p-4 space-y-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-1 mb-3">Live users</p>
              {users.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <div className="text-3xl mb-2">🌐</div>
                  <p className="text-sm">No one on the map yet.<br />Drop your pin first!</p>
                </div>
              ) : users.map((u) => (
                <button key={u.id} onClick={() => setSelected(u)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-green-50 border border-transparent hover:border-green-200 transition text-left">
                  <div className="w-9 h-9 bg-green-100 rounded-xl flex items-center justify-center text-lg flex-shrink-0">
                    {u.activePet?.emoji || '👤'}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-gray-800 truncate">{u.name || 'Lyfe user'}</div>
                    <div className="text-xs text-gray-400 truncate">{u.lastCity || 'Unknown city'}</div>
                  </div>
                  {u.activePet && (
                    <div className="ml-auto text-xs capitalize text-gray-300">{u.activePet.rarity}</div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
