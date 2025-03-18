<template>
  <div>
    <SearchBar :options-lit="tableData" @search="searchData" />
    <el-card>
      <ArticelTypeTableCom
        :table-data="tableData"
        :total="total"
        @getData="getArticleTypeList"
        @updatePage="upadatPage"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import SearchBar from "@/views/components/SearchBar/index.vue";
import ArticelTypeTableCom from "./Table/ArticelTypeTableCom.vue";
import { ref, onMounted } from "vue";
import { requestArticlesTypeList } from "@/api/articleManage";
import { message } from "@/utils/message";
const tableData = ref();
const total = ref(0);
const pages = ref({
  per: 8, //每页显示的数量
  page: 1, //页码
  name: ""
});
const categoryList = ref([]);
onMounted(() => {
  getArticleTypeList();
});

const upadatPage = (page: number, size: number) => {
  pages.value.page = page;
  pages.value.per = size;
  getArticleTypeList();
};
const getArticleTypeList = async () => {
  await requestArticlesTypeList(pages.value).then((res: any) => {
    const { data, success } = res;
    if (success) {
      tableData.value = data.list;
      total.value = data.total;
    } else {
      message("获取失败", { type: "error" });
    }
  });
};

const searchData = (search: string | any, category: string) => {
  pages.value.name = search;
  getArticleTypeList();
};
</script>

<style lang="scss" scoped></style>
