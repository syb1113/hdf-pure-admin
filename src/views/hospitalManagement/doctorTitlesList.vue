<template>
  <div class="root">
    <SearchBar :options-lit="optionsData" @search="searchData" />
    <el-card shadow="always">
      <departmentsTable
        :tableData="tableData"
        :total="total"
        :title="'医生职称'"
        @getData="getDoctortitles"
        @updatePage="upadatPage"
      />
    </el-card>
  </div>
</template>
<script lang="ts" setup>
import { requsestDoctortitles } from "@/api/hospitalManagement";
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
  getDoctortitles();
  getOptions();
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
  getDoctortitles();
};

const upadatPage = (page: number, size: number) => {
  console.log(page, size);
  params.value.page = page;
  params.value.per = size;
  getDoctortitles();
};

const getDoctortitles = async () => {
  await requsestDoctortitles(params.value).then((res: any) => {
    const { data, success } = res;
    if (!success) {
      message("获取失败", { type: "error" });
      return;
    }
    tableData.value = data.list;
    total.value = data.total;
  });
};
const optionsData = ref<Array<TableData>>([]);
const getOptions = async () => {
  await requsestDoctortitles().then((res: any) => {
    const { data, success, errorMessage } = res;
    // console.log(data);
    if (success) {
      optionsData.value = data.list;
    } else {
      message("获取失败", { type: "error" });
    }
  });
};
</script>
<style lang="scss"></style>
