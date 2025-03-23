<template>
  <div>
    <el-table :data="tableData">
      <el-table-column
        fixed="left"
        :index="index"
        type="index"
        label="#"
        center
      />
      <el-table-column prop="name" label="疾病名称" align="center" />
      <el-table-column prop="image" label="照片" align="center" width="100">
        <template #default="{ row }">
          <el-avatar
            shape="square"
            :size="50"
            :src="row.image ? VITE_BASE_URL + row.image : ''"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="desc"
        label="描述"
        align="center"
        show-overflow-tooltip
        min-width="160"
      />
      <el-table-column prop="illnessCategory" align="center" label="疾病类型">
        <template #default="{ row }">
          <div>{{ row.illnessCategory ? row.illnessCategory.name : "-" }}</div>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作">
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
            @click="delDiseasea(row.id)"
          >
            删除
          </el-button>
          <el-button
            v-if="hasPerms('permission:btn:edit')"
            type="warning"
            :icon="Edit"
            plain
            size="small"
            @click="upDiseaseaDetails(row.id)"
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
    <DiseaseDialog
      v-model="diseaseaAddDialog"
      :disabled="false"
      :diseasea-id="diseaseaId"
    />
  </div>
</template>
<script setup lang="ts">
import { hasPerms } from "@/utils/auth";
import { Edit, Delete } from "@element-plus/icons-vue";
import { requestOneDisease, requsestDelDisease } from "@/api/diseaseManage";
import { message } from "@/utils/message";
import { ref, onMounted, computed, watch } from "vue";
import DiseaseDialog from "../Dialog/DiseaseDialog.vue";
const { VITE_BASE_URL } = import.meta.env;

interface TableData {
  id: string;
  name: string;
  desc: string;
  image?: string;
  content: string;
  illnessCategory: {
    name: string;
  };
}
const diseaseaAddDialog = ref(false);
watch(
  () => diseaseaAddDialog.value,
  newVal => {
    // 对话框关闭时获取数据
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

const diseaseaId = ref();

const upDiseaseaDetails = async (id: string) => {
  diseaseaId.value = id;
  diseaseaAddDialog.value = true;
};

const delDiseasea = async (id: string) => {
  const res = await requsestDelDisease(id);
  if (res.success) {
    message("删除成功", { type: "success" });
    emit("getData");
  } else {
    message("删除失败", { type: "error" });
  }
};
</script>
<style lang="scss" scoped></style>
