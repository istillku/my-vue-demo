import { reactive } from "vue";
import { debounce, fetchJsonData } from "../utils/common";

interface DotsData {
  lng: string;
  lat: string;
  zhuanghao: string;
  roadName: string;
}

type DotDataArray = DotsData[];

export function usePointData() {
  // 存储多段线实例
  const points = reactive<any[]>([]);
  const BMapGL = window.BMapGL;

  const loadPointData = async (map: any) => {
    try {
      // 自定义图标
      const icon = new BMapGL.Icon("/point.png", new BMapGL.Size(24, 28), {
        anchor: new BMapGL.Size(0, 20),
      });
      const dotsData: DotDataArray = await fetchJsonData("/data/dots.json");
      dotsData.forEach((dot) => {
        if (!dot) return;
        const points = new BMapGL.Point(dot.lng, dot.lat);
        const marker = new BMapGL.Marker(points, { icon });
        const infoWindow = new BMapGL.InfoWindow(
          `<div>道路名: ${dot.roadName}<br>桩号: ${dot.zhuanghao}</div>`,
          {
            offset: new BMapGL.Size(10, -20),
          }
        );
        // 鼠标移入事件，高亮显示
        marker.addEventListener("mouseover", () => {
          map.openInfoWindow(infoWindow, points);
        });

        // 鼠标移出事件，恢复正常颜色
        marker.addEventListener("mouseout", () => {
          map.closeInfoWindow();
        });
        marker.hide(); // 初始隐藏覆盖层
        map.addOverlay(marker);

        // 监听地图缩放结束事件
        map.addEventListener(
          "zoomend",
          debounce(() => {
            const currentZoom = map.getZoom();

            if (currentZoom >= 16) {
              // 若当前级别大于等于最小显示级别，显示覆盖层
              marker.show();
            } else {
              // 若当前级别小于最小显示级别，隐藏覆盖层
              marker.hide();
            }
          }, 300)
        );
        // 存储点实例
        // points.push({ name: dot.roadName, instance: marker });
      });
    } catch (error) {
      console.error("加载点数据失败", error);
    }
  };

  return {
    points,
    loadPointData,
  };
}
