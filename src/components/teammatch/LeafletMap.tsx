import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import { MapPin, Navigation } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface LeafletMapProps {
  canchas?: any[];
  onCanchaClick?: (cancha: any) => void;
  onLocationSelect?: (lat: number, lng: number) => void;
  userLocation?: { lat: number; lng: number } | null;
}

// ── Componente que vuela el mapa a la ubicación del usuario ──────────────────
function FlyToUser({ location }: { location: { lat: number; lng: number } | null }) {
  const map = useMap();
  if (location) {
    map.flyTo([location.lat, location.lng], 16, { duration: 1.5 });
  }
  return null;
}

// ── Componente principal exportado ────────────────────────────────────────────
export default function LeafletMap({
  canchas = [],
  onCanchaClick,
  onLocationSelect,
  userLocation,
}: LeafletMapProps) {
  // BLOQUEO ABSOLUTO DE SSR — Leaflet necesita window
  if (typeof window === "undefined") return null;

  // ── Construir ícono "Pin Verde" para cada cancha ───────────────────────────
  function buildCanchaIcon(isActive = false) {
    const html = renderToStaticMarkup(
      <div
        className={`relative grid h-11 w-11 place-items-center rounded-full text-white shadow-pop ring-4 ring-background transition-all ${
          isActive ? "bg-emerald-600 scale-125" : "bg-emerald-500"
        }`}
      >
        <MapPin size={20} />
        <div className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 bg-emerald-500" />
      </div>
    );

    return L.divIcon({
      className: "custom-leaflet-icon bg-transparent border-none",
      html,
      iconSize: [44, 44],
      iconAnchor: [22, 44],
    });
  }

  // ── Construir ícono "Pin Azul" para la ubicación del usuario ───────────────
  function buildUserIcon() {
    const html = renderToStaticMarkup(
      <div className="user-location-pin">
        {/* Anillo pulsante exterior */}
        <div className="user-pulse-ring" />
        {/* Pin principal */}
        <div className="user-pin-body">
          <Navigation size={18} style={{ transform: "rotate(0deg)" }} />
        </div>
        {/* Punta inferior del pin */}
        <div className="user-pin-tip" />
      </div>
    );

    return L.divIcon({
      className: "custom-leaflet-icon bg-transparent border-none",
      html,
      iconSize: [52, 52],
      iconAnchor: [26, 52],
    });
  }

  const canchaIcon = buildCanchaIcon();
  const userIcon = buildUserIcon();

  return (
    <MapContainer
      center={[10.4806, -66.8551]}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapClickHandler onLocationSelect={onLocationSelect} />

      {/* Volar al usuario cuando se active su ubicación */}
      {userLocation && <FlyToUser location={userLocation} />}

      {/* Renderizar la ubicación del usuario (Pin Azul) */}
      {userLocation && userIcon && (
        <Marker
          key="user-location"
          position={[userLocation.lat, userLocation.lng]}
          icon={userIcon}
          interactive={false}
        />
      )}

      {/* Renderizar Canchas (Pines Verdes) usando lat/lng ya procesados */}
      {canchas.map((c: any) => {
        // Las canchas vienen pre-procesadas desde MapScreen con lat/lng numéricos
        const lat = c.lat;
        const lng = c.lng;

        // Validar que las coordenadas sean números válidos
        if (lat == null || lng == null || isNaN(lat) || isNaN(lng)) {
          console.warn(`⚠️ Cancha "${c.name}" sin coordenadas válidas:`, { lat, lng });
          return null;
        }

        return (
          <Marker
            key={`cancha-${c.id}`}
            position={[lat, lng]}
            icon={canchaIcon}
            eventHandlers={{
              click: () => {
                console.log("📍 Cancha tocada en el mapa:", c.name, { lat, lng });
                if (onCanchaClick) onCanchaClick(c);
              },
            }}
          />
        );
      })}
    </MapContainer>
  );
}

function MapClickHandler({ onLocationSelect }: { onLocationSelect?: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      if (onLocationSelect) {
        onLocationSelect(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
}
