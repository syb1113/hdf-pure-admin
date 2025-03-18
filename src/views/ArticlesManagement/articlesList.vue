<template>
  <div>
    <SearchBar
      :options-lit="tableData"
      :category-list="categoryList"
      @search="searchData"
    />
    <el-card>
      <ArticlesListTableCom
        :table-data="tableData"
        :total="total"
        @getData="getArticlesList"
        @updatePage="upadatPage"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import SearchBar from "@/views/components/SearchBar/index.vue";
import ArticlesListTableCom from "./Table/ArticlesListTableCom.vue";
import { ref, onMounted } from "vue";
import {
  requestArticlesList,
  requestArticlesTypeList
} from "@/api/articleManage";
import { message } from "@/utils/message";
const tableData = ref();
const total = ref(0);
const pages = ref({
  per: 8, //每页显示的数量
  page: 1, //页码
  name: "",
  category: ""
});
const categoryList = ref([]);
onMounted(() => {
  getArticlesList();
  getArticlesTypeList();
});

const upadatPage = (page: number, size: number) => {
  console.log(page, size);
  pages.value.page = page;
  pages.value.per = size;
  getArticlesList();
};
const getArticlesList = async () => {
  await requestArticlesList(pages.value).then((res: any) => {
    const { data, success } = res;
    if (success) {
      tableData.value = data.list;
      total.value = data.total;
    } else {
      message("获取失败", { type: "error" });
    }
  });
};

const getArticlesTypeList = async () => {
  await requestArticlesTypeList().then((res: any) => {
    const { data, success } = res;
    if (success) {
      categoryList.value = data.list;
    } else {
      message("获取失败", { type: "error" });
    }
  });
};
const searchData = (search: string | any, category: string) => {
  pages.value.name = search;
  pages.value.category = category;
  getArticlesList();
};
</script>

<style lang="scss" scoped></style>
