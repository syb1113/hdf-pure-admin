<template>
  <div class="areabox">
    <el-select
      v-model="address.province"
      placeholder="请选择省"
      :disabled="prop.disabled"
      :style="{ width: `${prop.width}px`, marginRight: `${prop.gap}px` }"
      @change="handleProvinceSelect"
    >
      <el-option
        v-for="item in regionData"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <el-select
      v-model="address.city"
      placeholder="请选择市"
      :disabled="!address.province || cityList.length == 0"
      :style="{ width: `${prop.width}px`, marginRight: `${prop.gap}px` }"
      @change="handleCitySelect"
    >
      <el-option
        v-for="item in cityList"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <el-select
      v-model="address.area"
      placeholder="请选择区"
      :style="{ width: `${prop.width}px` }"
      :disabled="!address.province || !address.city || areaList.length == 0"
      @change="handleAreaSelect"
    >
      <el-option
        v-for="item in areaList"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
  </div>
</template>

<script lang="ts" setup>
import { reactive, computed, onMounted, watch } from "vue";
import { regionData, codeToText } from "element-china-area-data";
import { useAddressStore } from "@/store/addressStrStore";

const prop = withDefaults(
  defineProps<{
    gap: string | number; //选择框中间间隙
    width: string | number; //选择框宽度
    disabled?: boolean; //是否禁用
    addressStr?: string; //传递的地址字符串
  }>(),
  {
    gap: "8",
    width: "210",
    disabled: false
  }
);

// 抛出地址
const emit = defineEmits<{
  (
    e: "getAddress",
    data: {
      code: string[]; //区域码
      name: string[]; //汉字
      isComplete: boolean; //是否选择完整，方便校验
    }
  ): void;
}>();

let address = reactive<{
  province: string;
  city: string;
  area: string;
}>({
  province: "",
  city: "",
  area: ""
});
// const addressStore = useAddressStore();

// 根据传递的地址字符串进行解析
const parseAddress = (addressStr?: string) => {
  const regex =
    /(.{2,3}[省|自治区|市])(.{2,3}[市|市辖区])(.{2,3}[区|县|市]?)(.*)/;
  const match = addressStr.match(regex);

  if (match) {
    address.province = match[1];
    address.city = match[2];
    address.area = match[3] || ""; // 如果没有区的情况，默认为空
  }
};

// onMounted(() => {
//   parseAddress(prop.addressStr);
// });

watch(
  () => prop.addressStr,
  (newVal: string) => {
    parseAddress(newVal);
  },
  { deep: true }
);

// 切换省份函数
const handleProvinceSelect = () => {
  address.city = "";
  address.area = "";
  emit("getAddress", {
    code: [address.province],
    name: [codeToText[address.province]],
    isComplete: false
  });
};

// 切换城市函数
const handleCitySelect = () => {
  address.area = "";
  emit("getAddress", {
    code: [address.province, address.city],
    name: [codeToText[address.province], codeToText[address.city]],
    isComplete: areaList.value.length == 0 ? true : false
  });
};

// 切换地区函数
const handleAreaSelect = () => {
  emit("getAddress", {
    code: [address.province, address.city, address.area],
    name: [
      codeToText[address.province],
      codeToText[address.city],
      codeToText[address.area]
    ],
    isComplete: true
  });
};

// 二级城市列表
const cityList = computed(() => {
  if (!address.province) return [];
  const provinceData = regionData.find(item => item.value === address.province);
  return provinceData ? provinceData.children || [] : [];
});

// 三级地区列表
const areaList = computed(() => {
  if (!address.province || !address.city) return [];
  const cityData = cityList.value.find(item => item.value === address.city);
  return cityData ? cityData.children || [] : [];
});
</script>

<style scoped>
.areabox {
  display: flex;
  align-items: center;
}
</style>
