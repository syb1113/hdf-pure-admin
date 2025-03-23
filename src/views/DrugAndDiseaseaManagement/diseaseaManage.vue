<template>
  <div>
    <SearchBar :options-lit="tableData" @search="searchData" />
    <el-card>
      <el-button
        v-if="hasPerms('permission:btn:add')"
        class="mb-3"
        :icon="Plus"
        type="primary"
        @click="diseaseAdd"
        >新增疾病</el-button
      >
      <DiseaseaTableComp
        :table-data="tableData"
        :total="total"
        @getData="getDiseaseList"
        @updatePage="upadatPage"
      />
    </el-card>
    <DiseaseDialog
      v-model="diseaseaAddDialog"
      :disabled="false"
      :diseaseaId="diseaseaId"
    />
  </div>
</template>

<script setup lang="ts">
import { hasPerms } from "@/utils/auth";

import SearchBar from "@/views/components/SearchBar/index.vue";
import DiseaseaTableComp from "./components/Table/DiseaseaTableComp.vue";
import { ref, onMounted } from "vue";
import { requestDiseaseList } from "@/api/diseaseManage";
import { message } from "@/utils/message";
import { Plus } from "@element-plus/icons-vue";
import DiseaseDialog from "./components/Dialog/DiseaseDialog.vue";

const tableData = ref();
const total = ref(0);
const pages = ref({
  per: 8, //每页显示的数量
  page: 1, //页码
  name: ""
});
onMounted(() => {
  getDiseaseList();
});
const upadatPage = (page: number, size: number) => {
  console.log(page, size);
  pages.value.page = page;
  pages.value.per = size;
  getDiseaseList();
};
const getDiseaseList = async () => {
  await requestDiseaseList(pages.value).then((res: any) => {
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
  getDiseaseList();
};
const diseaseaId = ref();
const diseaseaAddDialog = ref<boolean>(false);
const diseaseAdd = () => {
  diseaseaId.value = "";
  diseaseaAddDialog.value = true;
};
</script>
<style lang="scss" scoped></style>
