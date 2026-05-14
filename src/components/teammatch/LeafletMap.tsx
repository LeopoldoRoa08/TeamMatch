import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import "leaflet/dist/leaflet.css";

// ── Sincroniza el centro del mapa con el evento seleccionado ──────────────────
function MapFlyTo({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    if (typeof lat === "number" && typeof lng === "number" && !isNaN(lat) && !isNaN(lng)) {
      map.flyTo([lat, lng], 15, { animate: true, duration: 0.8 });
    }
  }, [lat, lng, map]);
  return null;
}

// ── Marcador temporal para selección de ubicación ──────────────────────────────
function LocationMarker({ onSelect }: { onSelect: (lat: number, lng: number) => void }) {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      if (onSelect) onSelect(e.latlng.lat, e.latlng.lng);
    },
  });

  if (!position) return null;
  // Bloqueo estricto de SSR para Leaflet globals
  if (typeof window === "undefined" || !(window as any).L) return null;

  const html = renderToStaticMarkup(
    <div className="relative grid h-11 w-11 place-items-center rounded-full ring-4 transition-all bg-destructive ring-background shadow-pop scale-110">
      <span className="text-lg">📍</span>
      <div className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 bg-destructive" />
    </div>
  );

  const L = (window as any).L;
  const redIcon = L.divIcon({
    className: "custom-leaflet-icon bg-transparent border-none",
    html,
    iconSize: [44, 44],
    iconAnchor: [22, 44],
  });

  return (
    <Marker position={position} icon={redIcon}>
      <Popup>Ubicación seleccionada</Popup>
    </Marker>
  );
}

// ── Componente exportado: el mapa Leaflet real ────────────────────────────────
export default function LeafletMap({ events = [], selectedId, onSelect, onLocationSelect }: any) {
  // BLOQUEO ABSOLUTO DE SSR
  if (typeof window === "undefined") return null;

  const selected = events.length > 0 ? (events.find((e: any) => e.id === selectedId) ?? events[0]) : null;

  // buildIcon se mueve dentro para asegurar que no se evalúa al cargar el módulo
  function buildIcon(event: any, isSelected: boolean) {
    if (typeof window === "undefined" || !(window as any).L) return null;

    const emoji =
      event.sport === "Running"
        ? "🏃"
        : event.sport === "Senderismo"
          ? "🥾"
          : event.sport === "Pádel"
            ? "🎾"
            : "🏐";

    const html = renderToStaticMarkup(
      <div
        className={`relative grid h-11 w-11 place-items-center rounded-full ring-4 transition-all ${
          isSelected
            ? "gradient-primary scale-110 ring-background shadow-pop"
            : "bg-secondary ring-card/80"
        }`}
      >
        <span className="text-lg">{emoji}</span>
        <div
          className={`absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 ${
            isSelected ? "bg-primary" : "bg-secondary"
          }`}
        />
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

  return (
    <MapContainer
      center={[10.49, -66.87]}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Marcador de selección de ubicación */}
      {onLocationSelect && <LocationMarker onSelect={onLocationSelect} />}

      {/* Vuela suavemente al marcador seleccionado */}
      {selected && <MapFlyTo lat={selected.lat} lng={selected.lng} />}

      {events.map((e: any) => {
        if (typeof e.lat !== "number" || typeof e.lng !== "number" || isNaN(e.lat) || isNaN(e.lng)) return null;

        const icon = buildIcon(e, e.id === selectedId);
        if (!icon) return null;

        return (
          <Marker
            key={e.id}
            position={[e.lat, e.lng]}
            icon={icon}
            eventHandlers={{
              click: () => {
                if (onSelect) onSelect(e.id);
              },
            }}
          >
            <Popup>
              <div className="font-semibold text-sm">{e.title}</div>
              <div className="text-xs text-muted-foreground">{e.sport || e.sport_id}</div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
