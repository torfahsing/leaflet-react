import { Marker, Tooltip, useMap } from "react-leaflet";
import { Mountains } from "../data/highest_points";
import { mountainIcon } from "../icons/mountainicon";

type MarkerProps = {
  data: Mountains;
};

const MarkerLayerWithTooltip = ({ data }: MarkerProps) => {
  const leafletMap = useMap();
  return data.features.map((feature) => {
    const { coordinates } = feature.geometry;
    const { name, elevation, continent } = feature.properties;

    const coordinateString = `${coordinates[1]}-${coordinates[0]}`;
    return (
      <Marker
        key={coordinateString}
        position={[coordinates[1], coordinates[0]]}
        icon={mountainIcon}
        eventHandlers={{
          click: (e) => leafletMap.panTo(e.latlng),
        }}
      >
        <Tooltip>
          <h3>Mt. {name}</h3>
          Continent: <b>{continent}</b> <br />
          Elevation: <b>{elevation} m</b>
        </Tooltip>
      </Marker>
    );
  });
};

export default MarkerLayerWithTooltip;
