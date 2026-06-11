/**
 * EventMiniMap — componente client-only que encapsula el mini-mapa de Leaflet
 * para la pantalla de detalle de evento.
 *
 * Se importa siempre con lazy() + Suspense desde EventDetailScreen para que
 * Leaflet nunca se evalúe en el servidor (SSR), donde `window` no existe.
 */
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Corregir los íconos por defecto de Leaflet (empaquetado con Vite)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

interface EventMiniMapProps {
  lat: number;
  lng: number;
}

export default function EventMiniMap({ lat, lng }: EventMiniMapProps) {
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={15}
      scrollWheelZoom={false}
      className="h-full w-full"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={[lat, lng]} />
    </MapContainer>
  );
}
