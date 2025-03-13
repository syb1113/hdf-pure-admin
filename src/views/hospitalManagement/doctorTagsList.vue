<template>
  <div class="root">
    <SearchBar :options-lit="tableData" @search="searchData" />
    <el-card shadow="always">
      <departmentsTable
        :tableData="tableData"
        :title="'医生职称'"
        :total="total"
        @getData="getDoctorTags"
        @updatePage="upadatPage"
      />
    </el-card>
  </div>
</template>
<script lang="ts" setup>
import { requsestDoctorTags } from "@/api/hospitalManagement";
import { ref, onMounted } from "vue";
import { message } from "@/utils/message";
import departmentsTable from "./components/table/departmentsTable.vue";
import SearchBar from "@/views/components/SearchBar/index.vue";

interface TableData {
  id: string;
  name: string;
  desc: string;
  image?: string;
}
onMounted(() => {
  getDoctorTags();
});

const tableData = ref<TableData[]>([]);
const params = ref({
  page: 1,
  per: 8,
  name: ""
});
const total = ref(0);
const searchData = (search: string | any) => {
  params.value.name = search;
  getDoctorTags();
};

const upadatPage = (page: number, size: number) => {
  console.log(page, size);
  params.value.page = page;
  params.value.per = size;
  getDoctorTags();
};

const getDoctorTags = async () => {
  await requsestDoctorTags(params.value).then((res: any) => {
    const { data, success } = res;
    if (!success) {
      message("获取失败", { type: "error" });
      return;
    }
    tableData.value = data.list;
    total.value = data.total;
  });
};
</script>
<style lang="scss"></style>
