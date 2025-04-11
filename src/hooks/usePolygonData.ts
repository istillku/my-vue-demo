import { reactive } from "vue";
import { fetchJsonData } from "../utils/common";

interface AreasData {
  town: string;
  coordinates: number[][][];
}

export function usePolygonData() {
  const polygons = reactive<any[]>([]);
  const BMapGL = window.BMapGL;
  const loadPolygonData = async (map: any) => {
    try {
      const areasData = await fetchJsonData("/data/areas.json");
      areasData.forEach((areaData: AreasData) => {
        const points = areaData.coordinates[0].map(
          (coordinate) => new BMapGL.Point(...coordinate)
        );
        const polygon = new BMapGL.Polygon(points, {
          fillColor: "#def1ef", // 默认填充颜色
          fillOpacity: 0.7,
          strokeColor: "#7fdbca", // 边框颜色
          strokeWeight: 1,
          strokeOpacity: 1,
        });
        // 鼠标移入事件，高亮显示
        polygon.addEventListener("mouseover", () => {
          polygon.setFillColor("#7fdbca");
        });

        // 鼠标移出事件，恢复正常颜色
        polygon.addEventListener("mouseout", () => {
          polygon.setFillColor("#def1ef");
        });
        map.addOverlay(polygon);
        // 存储多边形实例
        polygons.push({ name: areaData.town, instance: polygon });
      });
    } catch (error) {
      console.error("加载多边形数据失败:", error);
    }
  };
  return {
    polygons,
    loadPolygonData,
  };
}
