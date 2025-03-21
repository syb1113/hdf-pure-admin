<template>
  <div>
    <el-button
      v-if="hasPerms('permission:btn:add')"
      class="mb-3"
      :icon="Plus"
      type="primary"
      @click="otherAdd"
      >新增管理员</el-button
    >
    <el-table :data="tableData">
      <el-table-column fixed="left" :index="index" type="index" label="#" />
      <el-table-column prop="userName" label="用户名" align="center" />
      <el-table-column
        prop="role"
        label="角色"
        show-overflow-tooltip
        align="center"
      >
        <template #default="{ row }">
          <span>
            {{ row.role ? row.role.name : "-" }}
          </span>
        </template>
      </el-table-column>

      <el-table-column fixed="right" label="操作" align="center">
        <template #default="{ row }">
          <el-popconfirm
            width="220"
            :icon="InfoFilled"
            icon-color="#F56C6C"
            title="确定要删除"
            @confirm="handleRemove(row.id)"
          >
            <template #reference>
              <el-button
                v-if="
                  hasPerms([
                    'permission:btn:add',
                    'permission:btn:edit',
                    'permission:btn:delete'
                  ])
                "
                type="danger"
                :icon="Delete"
                size="small"
              >
                删除
              </el-button>
            </template>
            <template #actions="{ confirm, cancel }">
              <el-button size="small" @click="cancel">否</el-button>
              <el-button type="danger" size="small" @click="confirm">
                是
              </el-button>
            </template>
          </el-popconfirm>
          <el-button
            v-if="hasPerms('permission:btn:edit')"
            type="warning"
            :icon="Edit"
            plain
            size="small"
            @click="handleUpdata(row.id)"
            >修改</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="flex justify-end mt-3">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 40, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <AdminDialog
      v-model="AdminDialogVisible"
      :add="add"
      :admin-details="adminDetails"
    />
  </div>
</template>
<script setup lang="ts">
import { hasPerms } from "@/utils/auth";
import { Edit, Delete, InfoFilled } from "@element-plus/icons-vue";
import { message } from "@/utils/message";
import { ref, onMounted, computed, watch } from "vue";
import { Plus } from "@element-plus/icons-vue";
import AdminDialog from "../dialog/AdminDialog.vue";
import { requestAdminDelete, requestAdminDetails } from "@/api/admin";

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

const AdminDialogVisible = ref(false);
watch(
  () => AdminDialogVisible.value,
  newVal => {
    emit("getData");
  }
);

const { tableData, total } = defineProps<{
  tableData: TableData[];
  total: number;
}>();
const index = computed(() => {
  return 1 + pageSize.value * (currentPage.value - 1);
});

const emit = defineEmits<{
  (event: "getData"): void;
  (event: "updatePage", page: number, size: number): void;
}>();
const add = ref(false);
const currentPage = ref(1);
const pageSize = ref(8);
const handleSizeChange = (val: number) => {
  pageSize.value = val;
  emit("updatePage", currentPage.value, pageSize.value);
};
const handleCurrentChange = (val: number) => {
  currentPage.value = val;
  emit("updatePage", currentPage.value, pageSize.value);
};

const handleRemove = async (id: string) => {
  await requestAdminDelete(id).then((res: any) => {
    const { success } = res;
    if (success) {
      message("删除成功", { type: "error" });
      emit("getData");
    } else {
      message("获取数据异常", { type: "error" });
    }
  });
};
const handleUpdata = async (id: string) => {
  add.value = false;
  await requestAdminDetails(id).then((res: any) => {
    const { data, success } = res;
    if (success) {
      adminDetails.value = data;
    } else {
      message("获取数据异常", { type: "error" });
    }
  });
  AdminDialogVisible.value = true;
};

const adminDetails = ref<TableData>();
const otherAdd = () => {
  add.value = true;
  adminDetails.value = null;
  AdminDialogVisible.value = true;
};
</script>
<style lang="scss" scoped></style>
