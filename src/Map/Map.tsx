import { MapContainer, TileLayer } from "react-leaflet";
import { cities } from "../data/cities";
import { mountains } from "../data/highest_points";
import MarkerLayer, { RadiusFilterType } from "../layers/MarkerLayer";
import MarkerWithTooltip from "../layers/MarkerLayerWithTooltip";
import { useState } from "react";
import RadiusFilter from "../layers/RadiusFilter";
import { continents } from "../data/continents";
import ContinentsPolygonLayer, {
  GeoFilterType,
} from "../layers/ContinentsPolygonLayer";

export const Map = () => {
  const [geoFilter, setGeoFilter] = useState<GeoFilterType>(null);
  const getGeoFilter = () => geoFilter;

  const [radiusFilter, setRadiusFilter] = useState<
    RadiusFilterType | undefined | null
  >(null);
  const getRadiusFilter = () => radiusFilter;
  return (
    <MapContainer center={[0, 0]} zoom={1} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MarkerLayer
        data={cities}
        setRadiusFilter={setRadiusFilter}
        getRadiusFilter={getRadiusFilter}
        getGeoFilter={getGeoFilter}
      />
      <MarkerWithTooltip data={mountains} />
      <RadiusFilter
        radiusFilter={radiusFilter}
        setRadiusFilter={setRadiusFilter}
      />
      <ContinentsPolygonLayer
        data={continents}
        getGeoFilter={getGeoFilter}
        setGeoFilter={setGeoFilter}
      />
    </MapContainer>
  );
};
