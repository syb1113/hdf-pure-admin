<template>
  <div class="root">
    <el-card shadow="always">
      <RoleTableCom
        :tableData="tableData"
        :total="total"
        @get-data="getRoleList"
        @updatePage="upadatPage"
      />
    </el-card>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { message } from "@/utils/message";
import RoleTableCom from "./Table/RoleTableCom.vue";
import { requestRoleList } from "@/api/role";

interface Permission {
  id: string;
  name: string;
  desc: string;
}
interface PermissionOnRoles {
  id: string;
  roleId: string;
  permissionId: string;
  permission: Permission;
}
interface TableData {
  id: string;
  name: string;
  desc: string;
  permissionOnRoles: PermissionOnRoles[];
}

onMounted(() => {
  getRoleList();
});

const tableData = ref<TableData[]>([]);
const params = ref({
  page: 1,
  per: 8,
  name: ""
});
const total = ref(0);

const upadatPage = (page: number, size: number) => {
  params.value.page = page;
  params.value.per = size;
  getRoleList();
};

const getRoleList = async () => {
  await requestRoleList(params.value).then((res: any) => {
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
