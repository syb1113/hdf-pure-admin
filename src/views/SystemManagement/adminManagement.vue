<template>
  <div class="root">
    <el-card shadow="always">
      <AdminTableCom
        :tableData="tableData"
        :total="total"
        @get-data="getAdminList"
        @updatePage="upadatPage"
      />
    </el-card>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { message } from "@/utils/message";
import AdminTableCom from "./Table/AdminTableCom.vue";
import { requestAdminList } from "@/api/admin";

interface TableData {
  id?: string;
  userName: string;
  password: string;
  roleId: string;
  nickName: string;
  role: Role;
}

interface Role {
  id: string;
  name: string;
  desc: string;
}

onMounted(() => {
  getAdminList();
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
  getAdminList();
};

const getAdminList = async () => {
  await requestAdminList(params.value).then((res: any) => {
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
