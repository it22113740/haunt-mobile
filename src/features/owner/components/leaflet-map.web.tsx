import { useHauntColors } from '@/theme/colors';
import 'leaflet/dist/leaflet.css';
import { useEffect, useMemo } from 'react';
import { Circle, MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';

type LeafletMapProps = {
  lat: number;
  lng: number;
  radiusMeters: number;
  onChange: (pin: { lat: number; lng: number }) => void;
};

function FollowPin({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng]);
  }, [lat, lng, map]);
  return null;
}

export function LeafletMap({ lat, lng, radiusMeters, onChange }: LeafletMapProps) {
  const colors = useHauntColors();
  const icon = useMemo(
    () =>
      L.divIcon({
        className: '',
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        html: `<div style="width:28px;height:28px;border-radius:14px;background:${colors.accent};border:3px solid ${colors.onAccent};box-shadow:0 2px 8px rgba(28,22,18,.25)"></div>`,
      }),
    [colors.accent, colors.onAccent],
  );

  return (
    <div style={{ height: 240, overflow: 'hidden', borderRadius: 24 }}>
      <MapContainer center={[lat, lng]} zoom={15} style={{ height: '100%', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <FollowPin lat={lat} lng={lng} />
        <Circle
          center={[lat, lng]}
          radius={radiusMeters}
          pathOptions={{ color: colors.accent, fillColor: colors.accent, fillOpacity: 0.18 }}
        />
        <Marker
          position={[lat, lng]}
          icon={icon}
          draggable
          eventHandlers={{
            dragend: (event) => {
              const point = event.target.getLatLng();
              onChange({ lat: point.lat, lng: point.lng });
            },
          }}
        />
      </MapContainer>
    </div>
  );
}
