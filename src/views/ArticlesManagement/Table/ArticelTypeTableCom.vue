<template>
  <div>
    <el-button
      v-if="hasPerms('permission:btn:add')"
      class="mb-3"
      :icon="Plus"
      type="primary"
      @click="typeAdd"
      >新增分类</el-button
    >
    <el-table :data="tableData">
      <el-table-column fixed="left" :index="index" type="index" label="#" />
      <el-table-column prop="name" label="分类名称" />
      <el-table-column prop="image" label="照片">
        <template #default="{ row }">
          <el-avatar
            shape="square"
            :size="50"
            :src="row.image ? VITE_BASE_URL + row.image : doctorAvatar"
          />
        </template>
      </el-table-column>
      <el-table-column prop="desc" label="描述" show-overflow-tooltip />
      <el-table-column fixed="right" label="操作">
        <template #default="{ row }">
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
            @click="handleRemove(row.id)"
          >
            删除
          </el-button>
          <el-button
            v-if="hasPerms('permission:btn:edit')"
            type="warning"
            :icon="Edit"
            plain
            size="small"
            @click="handleEdit(row.id)"
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
    <TypeDialog
      v-model="TypeDialogVisible"
      :add="add"
      :type-details="typeDetails"
    />
  </div>
</template>
<script setup lang="ts">
import { Edit, Delete } from "@element-plus/icons-vue";
import { message } from "@/utils/message";
import { ref, onMounted, computed, watch } from "vue";
import { Plus } from "@element-plus/icons-vue";
import { hasPerms } from "@/utils/auth";
import TypeDialog from "../Dialog/TypeDialog.vue";
import {
  requestAddArticleType,
  requestUpArticleType,
  requestDelArticleType,
  requestArticlesTypeDetails
} from "@/api/articleManage";

interface TableData {
  id?: string;
  name: string;
  desc: string;
  image?: string;
}
const TypeDialogVisible = ref(false);

watch(
  () => TypeDialogVisible.value,
  newVal => {
    // 对话框关闭时获取数据
    emit("getData");
  }
);

const { VITE_BASE_URL } = import.meta.env;
const doctorAvatar = VITE_BASE_URL + "/uploads/file-1742645674476-49344101.png";

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
  await requestDelArticleType(id).then((res: any) => {
    const { success } = res;
    if (success) {
      message("删除成功", { type: "success" });
      emit("getData");
    } else {
      message("删除失败", { type: "error" });
    }
  });
};
const add = ref(false);
const typeDetails = ref<TableData>();
const typeAdd = () => {
  add.value = true;
  typeDetails.value = {
    name: "",
    desc: "",
    image: ""
  };
  TypeDialogVisible.value = true;
};
const handleEdit = async (id: string) => {
  add.value = false;
  await requestArticlesTypeDetails(id).then((res: any) => {
    const { data, success } = res;
    if (success) {
      typeDetails.value = data;
      TypeDialogVisible.value = true;
    }
  });
};
</script>
<style lang="scss" scoped></style>
