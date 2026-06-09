import { jsxs, jsx } from "react/jsx-runtime";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import { MapPin, Navigation } from "lucide-react";
import L from "leaflet";
function FlyToUser({ location }) {
  const map = useMap();
  if (location) {
    map.flyTo([location.lat, location.lng], 16, { duration: 1.5 });
  }
  return null;
}
function LeafletMap({
  canchas = [],
  onCanchaClick,
  onLocationSelect,
  userLocation
}) {
  if (typeof window === "undefined") return null;
  function buildCanchaIcon(isActive = false) {
    const html = renderToStaticMarkup(
      /* @__PURE__ */ jsxs(
        "div",
        {
          className: `relative grid h-11 w-11 place-items-center rounded-full text-white shadow-pop ring-4 ring-background transition-all ${isActive ? "bg-emerald-600 scale-125" : "bg-emerald-500"}`,
          children: [
            /* @__PURE__ */ jsx(MapPin, { size: 20 }),
            /* @__PURE__ */ jsx("div", { className: "absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 bg-emerald-500" })
          ]
        }
      )
    );
    return L.divIcon({
      className: "custom-leaflet-icon bg-transparent border-none",
      html,
      iconSize: [44, 44],
      iconAnchor: [22, 44]
    });
  }
  function buildUserIcon() {
    const html = renderToStaticMarkup(
      /* @__PURE__ */ jsxs("div", { className: "user-location-pin", children: [
        /* @__PURE__ */ jsx("div", { className: "user-pulse-ring" }),
        /* @__PURE__ */ jsx("div", { className: "user-pin-body", children: /* @__PURE__ */ jsx(Navigation, { size: 18, style: { transform: "rotate(0deg)" } }) }),
        /* @__PURE__ */ jsx("div", { className: "user-pin-tip" })
      ] })
    );
    return L.divIcon({
      className: "custom-leaflet-icon bg-transparent border-none",
      html,
      iconSize: [52, 52],
      iconAnchor: [26, 52]
    });
  }
  const canchaIcon = buildCanchaIcon();
  const userIcon = buildUserIcon();
  return /* @__PURE__ */ jsxs(
    MapContainer,
    {
      center: [10.4806, -66.8551],
      zoom: 13,
      style: { height: "100%", width: "100%" },
      zoomControl: false,
      children: [
        /* @__PURE__ */ jsx(
          TileLayer,
          {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          }
        ),
        /* @__PURE__ */ jsx(MapClickHandler, { onLocationSelect }),
        userLocation && /* @__PURE__ */ jsx(FlyToUser, { location: userLocation }),
        userLocation && userIcon && /* @__PURE__ */ jsx(
          Marker,
          {
            position: [userLocation.lat, userLocation.lng],
            icon: userIcon,
            interactive: false
          },
          "user-location"
        ),
        canchas.map((c) => {
          const lat = c.lat;
          const lng = c.lng;
          if (lat == null || lng == null || isNaN(lat) || isNaN(lng)) {
            console.warn(`⚠️ Cancha "${c.name}" sin coordenadas válidas:`, { lat, lng });
            return null;
          }
          return /* @__PURE__ */ jsx(
            Marker,
            {
              position: [lat, lng],
              icon: canchaIcon,
              eventHandlers: {
                click: () => {
                  console.log("📍 Cancha tocada en el mapa:", c.name, { lat, lng });
                  if (onCanchaClick) onCanchaClick(c);
                }
              }
            },
            `cancha-${c.id}`
          );
        })
      ]
    }
  );
}
function MapClickHandler({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      if (onLocationSelect) {
        onLocationSelect(e.latlng.lat, e.latlng.lng);
      }
    }
  });
  return null;
}
export {
  LeafletMap as default
};
