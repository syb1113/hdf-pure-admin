<template>
  <div>
    <el-card class="p-4">
      <div>
        <div class="flex">
          <div class="w-40 h-40">
            <img :src="baseUrl + hospitalDetails.image" alt="" class="w-auto" />
          </div>
          <div class="ml-7 flex-1">
            <div class="pb-6">
              <span>医院名称：{{ hospitalDetails.name }}</span>
              <span class="ml-36">医院电话：{{ hospitalDetails.phone }}</span>
            </div>
            <div>
              <p>医院介绍：{{ hospitalDetails.desc }}</p>
            </div>
          </div>
        </div>
        <Map class="mt-6" :address-props="address" />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { ref, onMounted } from "vue";
import { requestHostpitalDetails } from "@/api/hospitalManagement";
import Map from "@/components/Map/index.vue";
const { VITE_BASE_URL } = import.meta.env;

interface HostipalData {
  readonly id: string;
  name: string;
  desc: string;
  image: string;
  content: string;
  address: string;
  phone: string;
}
const baseUrl = VITE_BASE_URL;
const route = useRoute();
const hospitalDetails = ref<HostipalData>({
  id: "",
  name: "",
  desc: "",
  image: "",
  content: "",
  address: "",
  phone: ""
});
onMounted(() => {
  getHostpitalDetails();
});
const address = ref();
const getHostpitalDetails = async () => {
  const id = route.params.id;
  console.log(id);
  await requestHostpitalDetails(id as string).then((res: any) => {
    const { data, success } = res;
    if (success) {
      hospitalDetails.value = data;
      address.value = hospitalDetails.value.address;
      // console.log(hospitalDetails.value);
    }
  });
};
</script>

<style lang="scss" scoped></style>
