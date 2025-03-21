<template>
  <div class="root">
    <el-card shadow="always">
      <PermissionTacleCom
        :tableData="tableData"
        :total="total"
        @get-data="getPermissionsList"
        @updatePage="upadatPage"
      />
    </el-card>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { message } from "@/utils/message";
import PermissionTacleCom from "./Table/PermissionTableCom.vue";
import { requestPermissionsList } from "@/api/permissions";

interface TableData {
  id: string;
  name: string;
  desc: string;
}

onMounted(() => {
  getPermissionsList();
});

const tableData = ref<TableData[]>([]);
const params = ref({
  page: 1,
  per: 8
});
const total = ref(0);

const upadatPage = (page: number, size: number) => {
  params.value.page = page;
  params.value.per = size;
  getPermissionsList();
};

const getPermissionsList = async () => {
  await requestPermissionsList(params.value).then((res: any) => {
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
