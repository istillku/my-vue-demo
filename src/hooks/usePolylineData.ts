import { reactive } from "vue";
import { fetchJsonData } from "../utils/common";

interface LinesData {
  roadName: string;
  roadLocations: {
    lng: string;
    lat: string;
  }[];
}

export function usePolylineData() {
  // 存储多段线实例
  const polylines = reactive<any[]>([]);
  const BMapGL = window.BMapGL;

  const loadPolylineData = async (map: any) => {
    try {
      const linesData = await fetchJsonData("/data/lines.json");
      linesData.forEach((lineData: LinesData) => {
        const points = lineData.roadLocations.map(
          (location) => new BMapGL.Point(location.lng, location.lat)
        );
        const polyline = new BMapGL.Polyline(points, {
          strokeColor: "green",
          strokeWeight: 3.5,
          strokeOpacity: 0.5,
        });
        map.addOverlay(polyline);
        // 存储多段线实例
        polylines.push({ name: lineData.roadName, instance: polyline });
      });
    } catch (error) {
      console.error("加载多边线数据失败", error);
    }
  };

  return {
    polylines,
    loadPolylineData,
  };
}
