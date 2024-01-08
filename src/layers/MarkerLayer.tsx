import L from "leaflet";
import { Marker, Popup } from "react-leaflet";
import { Cities } from "../data/cities";
import { Button, Card, InputNumber, Space } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import { useState } from "react";
import { GeoFilterType } from "./ContinentsPolygonLayer";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";

//React.Dispatch<React.SetStateAction<RadiusFilterType | undefined>>

type MarkerProps = {
  data: Cities;
  // setRadiusFilter: (radiusFilter: RadiusFilterType) => void;
  setRadiusFilter: React.Dispatch<
    React.SetStateAction<RadiusFilterType | undefined>
  >;
  getRadiusFilter: () => RadiusFilterType | null | undefined;
  getGeoFilter: () => GeoFilterType | undefined | null;
};

type FeatureType = Cities["features"][0];

export type RadiusFilterType = {
  feature: FeatureType;
  radius: number;
} | null;

type FeaturePropType = {
  feature: FeatureType;
  setRadiusFilter: React.Dispatch<
    React.SetStateAction<RadiusFilterType | undefined>
  >;
  // setRadiusFilter: (radiusFilter: RadiusFilterType) => void;
};

const DEFAULT_RADIUS = 3000;
const PopupStatistics = ({ feature, setRadiusFilter }: FeaturePropType) => {
  const [radius, setRadius] = useState(DEFAULT_RADIUS);
  const { NAME, ADM0NAME, POP_MAX } = feature.properties;
  return (
    <>
      <Card key="name" type="inner" title="Name" style={{ marginTop: 16 }}>
        <b>{`${NAME}, ${ADM0NAME}`}</b>
      </Card>
      <Card
        key="ADM0NAME"
        type="inner"
        title="Population"
        style={{ marginTop: 16 }}
      >
        <b>{POP_MAX}</b>
      </Card>
      <Card
        key="POP_MAX"
        type="inner"
        title="Radius Filter"
        style={{ marginTop: 16 }}
      >
        <Space>
          <InputNumber
            defaultValue={DEFAULT_RADIUS}
            min={0}
            onChange={(e) => setRadius(e ?? 0)}
          ></InputNumber>
          <Button
            type="primary"
            shape="round"
            onClick={() =>
              setRadiusFilter((prevState) => {
                let newFilter: RadiusFilterType = null;

                if (prevState) {
                  if (radius === 0) {
                    newFilter = prevState;
                  } else {
                    const sameFeature = prevState.feature === feature;
                    const sameRadius = prevState.radius === radius;

                    if (!sameFeature || !sameRadius) {
                      newFilter = { feature, radius };
                    }
                  }
                } else if (radius !== 0) {
                  newFilter = { feature, radius };
                }

                return newFilter;
              })
            }
            icon={<FilterOutlined />}
          >
            Filter by km
          </Button>
        </Space>
      </Card>
    </>
  );
};
const MarkerLayer = ({
  data,
  setRadiusFilter,
  getRadiusFilter,
  getGeoFilter,
}: MarkerProps) => {
  const geoFilter = getGeoFilter();
  const radiusFilter = getRadiusFilter();

  const coordinates = radiusFilter
    ? radiusFilter.feature.geometry.coordinates
    : null;

  const centerPoint = coordinates
    ? L.latLng(coordinates[1], coordinates[0])
    : null;

  return data.features
    .filter((currentFeature) => {
      let filterByGeo = false;
      let filterByRadius = false;
      if (centerPoint && radiusFilter) {
        const { coordinates } = currentFeature.geometry;
        const currentPoint = L.latLng(coordinates[1], coordinates[0]);
        return (filterByRadius =
          centerPoint.distanceTo(currentPoint) / 1000 < radiusFilter.radius);
      }

      if (geoFilter) {
        filterByGeo = booleanPointInPolygon(currentFeature, geoFilter);
      }

      let doFilter = true;

      if (geoFilter && radiusFilter) {
        doFilter = filterByGeo && filterByRadius;
      } else if (geoFilter && !radiusFilter) {
        doFilter = filterByGeo;
      } else if (radiusFilter && !geoFilter) {
        doFilter = filterByRadius;
      }

      return doFilter;
    })
    .map((feature) => {
      const { coordinates } = feature.geometry;

      const coordinateString = `${coordinates[1]}-${coordinates[0]}`;
      return (
        <Marker
          key={coordinateString}
          position={[coordinates[1], coordinates[0]]}
        >
          <Popup>
            <PopupStatistics
              feature={feature}
              setRadiusFilter={setRadiusFilter}
            />
          </Popup>
        </Marker>
      );
    });
};

export default MarkerLayer;
