<template>
  <div class="areabox">
    <el-select
      v-model="address.province"
      placeholder="请选择省"
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
import { reactive, computed, ComputedRef } from "vue";
import { regionData, codeToText } from "element-china-area-data";
const prop = withDefaults(
  defineProps<{
    gap: string | number; //选择框中间间隙
    width: string | number; //选择框宽度
  }>(),
  {
    gap: "8",
    width: "210"
  }
);
//抛出地址
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
interface AreaList {
  value: string;
  label: string;
  children?: AreaList[];
}
//切换省份函数
const handleProvinceSelect = () => {
  address.city = "";
  address.area = "";
  emit("getAddress", {
    code: [address.province], //区域码
    name: [codeToText[address.province]], //汉字
    isComplete: false
  });
};
//切换城市函数
const handleCitySelect = () => {
  address.area = "";
  emit("getAddress", {
    code: [address.province, address.city], //区域码
    name: [codeToText[address.province], codeToText[address.city]], //汉字
    isComplete: areaList.value.length == 0 ? true : false
  });
};
//切换地区函数
const handleAreaSelect = () => {
  emit("getAddress", {
    code: [address.province, address.city, address.area], //区域码
    name: [
      codeToText[address.province],
      codeToText[address.city],
      codeToText[address.area]
    ], //汉字
    isComplete: true
  });
};
//二级城市列表
const cityList: ComputedRef<AreaList[]> = computed((): AreaList[] => {
  if (!address.province) {
    return [];
  }
  let temp = regionData.find((item: any) => {
    return item.value == address.province;
  });
  return temp.children ? temp.children : [];
});
//三级地区列表
const areaList: ComputedRef<AreaList[]> = computed((): AreaList[] => {
  if (!address.province || !address.city) {
    return [];
  }
  if (cityList.value.length == 0) {
    return [];
  } else {
    let temp = cityList.value.find((item: any) => {
      return item.value == address.city;
    });
    if (temp) {
      return temp.children ? temp.children : [];
    } else {
      return [];
    }
  }
});
</script>
<style scoped>
.areabox {
  display: flex;
  align-items: center;
}
</style>
