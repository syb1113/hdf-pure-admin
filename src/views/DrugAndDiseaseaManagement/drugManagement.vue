<template>
  <div>
    <SearchBar :options-lit="tableData" @search="searchData" />
    <el-card>
      <el-button class="mb-3" :icon="Plus" type="primary" @click="drugAdd"
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
import SearchBar from "@/views/components/SearchBar/index.vue";
import DrugTableComp from "./components/Table/DrugTableComp.vue";
import { ref, onMounted } from "vue";
import { requestDrugList } from "@/api/drugManage";
import { message } from "@/utils/message";
import DrugAddDialog from "./components/Dialog/DrugAddDialog.vue";
import { Plus } from "@element-plus/icons-vue";

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

const drugAddDialog = ref<boolean>(false);
const drugAdd = () => {
  drugAddDialog.value = true;
};
</script>
<style lang="scss" scoped></style>
