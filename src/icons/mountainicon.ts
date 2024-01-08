import L from "leaflet";

import mountainPng from "../images/mountain2.png";

const LeafIcon = L.Icon.extend({
  options: {
    iconSize: [35, 23],
    iconAnchor: [17,16],
    tooltipAnchor: [15, -5],
    iconUrl: mountainPng,
  },
});

export const mountainIcon = new LeafIcon();
