<template>
  <div>
    <SearchBar :options-lit="tableData" @search="searchData" />
    <el-card>
      <TypeTableComp
        :tableData="tableData"
        :title="'药品分类'"
        :total="total"
        @get-data="getDrugTypeList"
        @updatePage="upadatPage"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import SearchBar from "@/views/components/SearchBar/index.vue";
import TypeTableComp from "./components/Table/TypeTableComp.vue";
import { ref, onMounted } from "vue";
import { requestDrugTypeList } from "@/api/drugManage";
import { message } from "@/utils/message";
const tableData = ref();
const total = ref(0);
const pages = ref({
  per: 8, //每页显示的数量
  page: 1, //页码
  name: ""
});
onMounted(() => {
  getDrugTypeList();
});
const upadatPage = (page: number, size: number) => {
  console.log(page, size);
  pages.value.page = page;
  pages.value.per = size;
  getDrugTypeList();
};

const getDrugTypeList = async () => {
  await requestDrugTypeList(pages.value).then((res: any) => {
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
  getDrugTypeList();
};
</script>

<style lang="scss" scoped></style>
