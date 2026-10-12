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
        iconSize: [30, 40],
        iconAnchor: [15, 40],
        html: `<svg width="30" height="40" viewBox="-15 -38 30 40"><path d="M0 0c-9-11-13-17-13-23a13 13 0 0 1 26 0c0 6-4 12-13 23z" fill="${colors.accent}" stroke="${colors.ink}" stroke-width="1.6"/><circle cy="-23" r="4" fill="${colors.ink}"/></svg>`,
      }),
    [colors.accent, colors.ink],
  );

  return (
    <div style={{ height: 230, overflow: 'hidden' }}>
      <MapContainer center={[lat, lng]} zoom={15} style={{ height: '100%', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <FollowPin lat={lat} lng={lng} />
        <Circle
          center={[lat, lng]}
          radius={radiusMeters}
          pathOptions={{ color: colors.accentDeep, weight: 1.5, dashArray: '5 4', fillColor: colors.accent, fillOpacity: 0.12 }}
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
