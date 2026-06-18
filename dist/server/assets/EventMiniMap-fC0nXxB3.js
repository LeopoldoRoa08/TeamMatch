import { jsxs, jsx } from "react/jsx-runtime";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
/* empty css                 */
import L from "leaflet";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png"
});
function EventMiniMap({ lat, lng }) {
  return /* @__PURE__ */ jsxs(
    MapContainer,
    {
      center: [lat, lng],
      zoom: 15,
      scrollWheelZoom: false,
      className: "h-full w-full",
      children: [
        /* @__PURE__ */ jsx(TileLayer, { url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" }),
        /* @__PURE__ */ jsx(Marker, { position: [lat, lng] })
      ]
    }
  );
}
export {
  EventMiniMap as default
};
