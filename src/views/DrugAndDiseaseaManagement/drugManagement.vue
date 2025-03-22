<template>
  <div>
    <SearchBar
      :options-lit="tableData"
      :category-list="categoryList"
      @search="searchData"
    />
    <el-card>
      <el-button
        v-if="hasPerms('permission:btn:add')"
        class="mb-3"
        :icon="Plus"
        type="primary"
        @click="drugAdd"
        >新增药品</el-button
      >
      <DrugTableComp
        :table-data="tableData"
        :total="total"
        @getData="getDrugList"
        @updatePage="upadatPage"
      />
    </el-card>
    <DrugAddDialog v-model="drugAddDialog" @get-data="getDrugList" />
  </div>
</template>

<script setup lang="ts">
import { hasPerms } from "@/utils/auth";
import SearchBar from "@/views/components/SearchBar/index.vue";
import DrugTableComp from "./components/Table/DrugTableComp.vue";
import { ref, onMounted } from "vue";
import { requestDrugList, requestDrugTypeList } from "@/api/drugManage";
import { message } from "@/utils/message";
import DrugAddDialog from "./components/Dialog/DrugAddDialog.vue";
import { Plus } from "@element-plus/icons-vue";

const tableData = ref();
const total = ref(0);
const pages = ref({
  per: 8, //每页显示的数量
  page: 1, //页码
  name: "",
  category: ""
});
onMounted(() => {
  getDrugList();
  getCategoryList();
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
const searchData = (search: string | any, category: string) => {
  pages.value.name = search;
  pages.value.category = category;
  getDrugList();
};

const drugAddDialog = ref<boolean>(false);
const drugAdd = () => {
  drugAddDialog.value = true;
};
const categoryList = ref([]);
const getCategoryList = async () => {
  await requestDrugTypeList().then((res: any) => {
    const { data, success } = res;
    if (success) {
      categoryList.value = data.list;
    } else {
    }
  });
};
</script>
<style lang="scss" scoped></style>
