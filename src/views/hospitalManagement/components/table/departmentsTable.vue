<template>
  <div>
    <el-table :data="tableData">
      <el-table-column fixed type="selection" />
      <el-table-column fixed="left" :index="index" type="index" label="#" />
      <el-table-column prop="name" :label="title" />
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
            type="danger"
            :icon="Delete"
            size="small"
            @click="handleRemove(title, row.id)"
          >
            删除
          </el-button>
          <el-button
            type="warning"
            :icon="Edit"
            plain
            size="small"
            @click="handleUpdata(title, row.id)"
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
  </div>
</template>
<script setup lang="ts">
import { Edit, Delete } from "@element-plus/icons-vue";
import {
  requestDocTitleDel,
  requestDocDepartmentsDel,
  requestDocTagsDel
} from "@/api/hospitalManagement";
import { message } from "@/utils/message";
import { ref, onMounted, computed } from "vue";

interface TableData {
  id: string;
  name: string;
  desc: string;
  image?: string;
}

const { VITE_BASE_URL } = import.meta.env;
const doctorAvatar =
  VITE_BASE_URL + "/uploads/file-1736770944771-752118396.jpg";

const { title, tableData, total } = defineProps<{
  title: string;
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

const handleRemove = (titel: string, id: string) => {
  switch (titel) {
    case "医生标签":
      delDocTags(id);
      break;
    case "医院科室":
      delDocDepartments(id);
      break;
    case "医生职称":
      delDocTitle(id);
      break;
  }
};

const handleUpdata = (titel: string, id: string) => {
  console.log("handleUpdata");
};

const delDocTitle = async (id: string) => {
  await requestDocTitleDel(id).then((res: any) => {
    const { success } = res;
    if (!success) {
      message("删除失败", { type: "error" });
      return;
    }
    message("删除成功", { type: "success" });
    emit("getData");
  });
};

const delDocDepartments = async (id: string) => {
  await requestDocDepartmentsDel(id).then((res: any) => {
    const { success } = res;
    if (!success) {
      message("删除失败", { type: "error" });
      return;
    }
    message("删除成功", { type: "success" });
    emit("getData");
  });
};

const delDocTags = async (id: string) => {
  await requestDocTagsDel(id).then((res: any) => {
    const { success } = res;
    if (!success) {
      message("删除失败", { type: "error" });
      return;
    }
    message("删除成功", { type: "success" });
    emit("getData");
  });
};
</script>
<style lang="scss" scoped></style>
