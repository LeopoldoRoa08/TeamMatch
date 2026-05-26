import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import { MapPin } from "lucide-react";
import "leaflet/dist/leaflet.css";

// ── Props ─────────────────────────────────────────────────────────────────────
interface LeafletMapProps {
  canchas?: any[];
  onCanchaClick?: (cancha: any) => void;
}

// ── Componente principal exportado ────────────────────────────────────────────
export default function LeafletMap({
  canchas = [],
  onCanchaClick,
}: LeafletMapProps) {
  // BLOQUEO ABSOLUTO DE SSR — Leaflet necesita window
  if (typeof window === "undefined") return null;

  // ── Construir ícono "Pin Verde" para cada cancha ───────────────────────────
  function buildCanchaIcon(isActive = false) {
    if (!(window as any).L) return null;

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

    const L = (window as any).L;
    return L.divIcon({
      className: "custom-leaflet-icon bg-transparent border-none",
      html,
      iconSize: [44, 44],
      iconAnchor: [22, 44],
    });
  }

  const canchaIcon = buildCanchaIcon();

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
