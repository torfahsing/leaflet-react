import { Circle } from "react-leaflet";
import { RadiusFilterType } from "./MarkerLayer";

type RadiusFilterProps = {
  radiusFilter: RadiusFilterType | undefined | null;
  setRadiusFilter: React.Dispatch<
    React.SetStateAction<RadiusFilterType | undefined>
  >;
};

const RadiusFilter = ({ radiusFilter, setRadiusFilter }: RadiusFilterProps) => {
  if (radiusFilter) {
    const { coordinates } = radiusFilter.feature.geometry;

    return (
      <Circle
        center={[coordinates[1], coordinates[0]]}
        radius={radiusFilter.radius * 1000}
        eventHandlers={{
          dblclick: (e) => {
            // console.log(e.originalEvent.view.L);
            const { view } = e.originalEvent;

            if (view) {
              view.window.L.DomEvent.stopPropagation(e);
            }
            setRadiusFilter(null);
          },
        }}
        color={"gray"}
        weight={1}
        fillOpacity={0.4}
      />
    );
  }

  return null;
};

export default RadiusFilter;
