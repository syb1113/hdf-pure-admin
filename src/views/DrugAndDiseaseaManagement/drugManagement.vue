<template>
  <div>
    <SearchBar :options-lit="tableData" @search="searchData" />
    <el-card>
      <DrugTableComp
        :table-data="tableData"
        :total="total"
        @getData="getDrugList"
        @updatePage="upadatPage"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import SearchBar from "@/views/components/SearchBar/index.vue";
import DrugTableComp from "./components/Table/DrugTableComp.vue";
import { ref, onMounted } from "vue";
import { requestDrugList } from "@/api/drugManage";
import { message } from "@/utils/message";
const tableData = ref();
const total = ref(0);
const pages = ref({
  per: 9, //每页显示的数量
  page: 1, //页码
  name: ""
});
onMounted(() => {
  getDrugList();
});
const upadatPage = (page: number, size: number) => {
  console.log(page, size);
  pages.value.page = page;
  pages.value.per = size;
  getDrugList();
};
const getDrugList = async () => {
  await requestDrugList(pages.value).then((res: any) => {
    const { data, success } = res;
    if (success) {
      tableData.value = data.list;
      total.value = data.total;
    } else {
      message("获取失败", { type: "error" });
    }
  });
};
const searchData = (search: string | any) => {
  pages.value.name = search;
  getDrugList();
};
</script>
<style lang="scss" scoped></style>
