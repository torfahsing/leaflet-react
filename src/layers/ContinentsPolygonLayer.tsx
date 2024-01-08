import { GeoJSON } from "react-leaflet";
import type { GeoJsonObject, Feature, Geometry } from "geojson";
import { Continents } from "../data/continents";



// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type GeoFilterType = Feature<Geometry, any> | undefined | null;

type GeoFilterProps = {
  data: Continents;
  getGeoFilter: () => GeoFilterType | undefined | null;
  setGeoFilter: React.Dispatch<React.SetStateAction<GeoFilterType>>;
};

const ContinentsPolygonLayer = ({
  data,
  getGeoFilter,
  setGeoFilter,
}: GeoFilterProps) => {
  const geoFilter = getGeoFilter() ?? null;
  
  return (
    <GeoJSON
      key="geo-json-layer"
      data={data as GeoJsonObject}
      eventHandlers={{
        click: (e) =>
          setGeoFilter((prevState) => {
            const feature = e.propagatedFrom.feature;
            const same = prevState === feature;
            return same ? null : prevState = feature;
          }),
      }}
      style={(feature) => {
        return {
            color: geoFilter && geoFilter === feature ? "red" : "blue",
            weight: 0.5,
            fillOpacity: 0.4
        }
      }}
    />
  );
};

export default ContinentsPolygonLayer;
