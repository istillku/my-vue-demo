<template>
  <div class="map-box">
    <!-- 侧边栏 -->
    <aside class="sidebar">
      <h1>道路</h1>
      <ul class="road-list">
        <li
          v-for="polyline in polylines"
          :key="polyline.name"
          @click="highlightView(polyline.instance)"
        >
          {{ polyline.name }}
        </li>
      </ul>
      <h1>区域</h1>
      <ul class="road-list">
        <li
          v-for="polygon in polygons"
          :key="polygon.name"
          @click="highlightView(polygon.instance)"
        >
          {{ polygon.name }}
        </li>
      </ul>
    </aside>

    <div ref="mapContainer" id="map-container"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { loadScript } from "../utils/common";
import { usePolylineData } from "../hooks/usePolylineData";
import { usePolygonData } from "../hooks/usePolygonData";
import { usePointData } from "../hooks/usePointData";

const BMapGL = window.BMapGL;

// 定义地图容器的引用
const mapContainer = ref<HTMLElement | null>(null);
// 存储地图实例
const map = ref<any>(null);
// 存储多段线实例
const { polylines, loadPolylineData } = usePolylineData();
// 存储多边形实例
const { polygons, loadPolygonData } = usePolygonData();
// 存储点标记实例
const { loadPointData } = usePointData();

// 高亮路段
const highlightView = (polyline: any) => {
  polylines.forEach((p) => {
    p.instance.setStrokeColor("green");
  });
  polyline.setStrokeColor("red");

  // 获取 polyline 的边界
  const bounds = polyline.getBounds();

  if (map.value && bounds) {
    // 让地图自动调整视野以显示该 polyline
    map.value.setViewport([bounds.sw, bounds.ne]);
  }
};

onMounted(async () => {
  try {
    const ak = "6s1ztRpGicdQPIAuxipqIlipWJqXmcqj";
    await loadScript(`https://api.map.baidu.com/api?v=2.0&type=webgl&ak=${ak}`);
    if (mapContainer.value && BMapGL) {
      map.value = new BMapGL.Map(mapContainer.value);
      // const point = new BMapGL.Point(116.404, 39.915);
      const point = "上海市";
      map.value.centerAndZoom(point, 10); // 初始化地图,设置中心点坐标和地图级别
      map.value.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放
      map.value.addControl();

      // 多段线数据
      await loadPolylineData(map.value);
      // 多边形数据
      await loadPolygonData(map.value);
      // 点标记数据
      await loadPointData(map.value);
    }
  } catch (error) {
    console.error("Failed to load Baidu Map API:", error);
  }
});
</script>

<style scoped lang="scss">
.map-box {
  width: 100%;
  height: 100%;
  display: flex;
  .sidebar {
    display: flex;
    flex-direction: column;
    width: 150px;
    height: 100%;

    h1 {
      margin: 10px;
    }

    .road-list {
      width: 100%;
      list-style: none;
      margin: 0;
      padding: 0;

      li {
        padding: 10px;
        cursor: pointer;
        width: 100%;
      }
      li:hover {
        color: red;
        background-color: lightgray;
      }
    }
  }
}
#map-container {
  width: 100%;
  height: 100%;
}
</style>
