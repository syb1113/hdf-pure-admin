<template>
  <div>
    <div ref="mapRef" style="height: 500px; margin-top: 20px" />
  </div>
</template>

<script setup lang="ts">
import { load } from "@amap/amap-jsapi-loader";
import { ref, onMounted, onUnmounted, watch } from "vue";
interface propsData {
  addressProps: string;
}

const { addressProps } = defineProps<propsData>();
const mapRef = ref<HTMLElement>();
const address = ref("北京市东城区天安门"); // 地址输入
const mapApiKey = {
  securityJsCode: "7cb1f21d884ee0e6ccbaae84e8cfb7c9",
  key: "c4b980aaf9c506505423de97fb4498b3"
};

let AMap: any; // AMap 实例
let mapInstance: any; // 地图实例
// 监听 addressProps 的变化

// 初始化地图
const initMap = async () => {
  try {
    // 设置安全密钥
    window._AMapSecurityConfig = {
      securityJsCode: mapApiKey.securityJsCode
    };

    // 加载 AMap API
    AMap = await load({
      key: mapApiKey.key,
      version: "2.0",
      plugins: ["AMap.Geocoder", "AMap.Scale"]
    });
    // 初始化地图实例
    mapInstance = new AMap.Map(mapRef.value!, {
      viewMode: "3D",
      zoom: 13,
      center: [116.397428, 39.90923],
      resizeEnable: true
    });
    await geocodeAddress(address.value);

    // 添加缩放控件
    new AMap.Scale().addTo(mapInstance);
  } catch (error) {
    console.error("地图初始化失败:", error);
  }
};

// 地址转坐标
const geocodeAddress = async (address: string) => {
  try {
    // 创建地理编码实例
    const geocoder = new AMap.Geocoder({
      city: ""
    });

    // 执行地理编码
    geocoder.getLocation(address, (status: string, result: any) => {
      if (status === "complete" && result.geocodes.length) {
        const location = result.geocodes[0].location;
        console.log("解析结果：", location);

        // 清除旧标记
        mapInstance.clearMap();
        mapInstance = new AMap.Map(mapRef.value!, {
          viewMode: "3D",
          zoom: 13,
          center: [116.397428, 39.90923],
          resizeEnable: true
        });
        // 添加新标记
        const marker = new AMap.Marker({
          // position: [location.lng, location.lat],
          map: mapInstance,
          icon: new AMap.Icon({
            image: "/public/images/poi-marker-default.png" // 使用默认图标
            // size: new AMap.Size(27, 34)
          })
        });
        marker.setPosition(location);

        // 调整地图中心点
        mapInstance.setCenter([location.lng, location.lat]);
      } else {
        console.error("地址解析失败");
      }
    });
  } catch (error) {
    console.error("地址解析错误:", error);
  }
};

// 页面加载完成后初始化地图
onMounted(() => {
  if (mapRef.value) initMap();
});
watch(
  () => addressProps,
  newAddress => {
    address.value = newAddress;
    geocodeAddress(newAddress);
  }
);
onUnmounted(() => {
  if (mapInstance) {
    mapInstance.destroy();
  }
});
</script>
<style>
.amap-icon img,
.amap-marker-content img {
  width: 27px;
  height: 34px;
}
</style>
