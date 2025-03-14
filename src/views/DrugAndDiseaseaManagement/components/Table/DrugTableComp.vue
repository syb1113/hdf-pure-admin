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
      <el-table-column prop="name" label="药物名称" align="center" />
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
      <el-table-column prop="price" label="价格" align="center" width="100">
        <template #default="{ row }">
          <div>{{ row.price }}￥</div>
        </template>
      </el-table-column>
      <el-table-column prop="amount" label="库存" align="center" width="100">
        <template #default="{ row }">
          <el-text :type="row.amount <= 50 ? 'danger' : ''"
            >{{ row.amount }}件</el-text
          >
        </template>
      </el-table-column>
      <el-table-column prop="category" align="center" label="药物类型">
        <template #default="{ row }">
          <div>{{ row.category.name }}</div>
        </template>
      </el-table-column>
      <el-table-column label="关联疾病" align="center" min-width="100">
        <template #default="{ row }">
          <div>
            <el-tag
              v-for="item in row.illnessMedicine"
              :key="item.id"
              class="mr-1"
              type="success"
              >{{ item.illness.name }}</el-tag
            >
          </div>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作">
        <template #default="{ row }">
          <el-button
            type="danger"
            :icon="Delete"
            size="small"
            @click="delDrug(row.id)"
          >
            删除
          </el-button>
          <el-button
            type="warning"
            :icon="Edit"
            plain
            size="small"
            @click="upDrugDetails(row.id)"
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

    <DrugDetailsUp :id="drugId" v-model="drugDialogVisible" />
  </div>
</template>
<script setup lang="ts">
import { Edit, Delete } from "@element-plus/icons-vue";
import { requestOneDrug, requsestDelDrug } from "@/api/drugManage";
import { message } from "@/utils/message";
import { ref, onMounted, computed, watch } from "vue";
import DrugDetailsUp from "../Dialog/DrugDetailsUp.vue";
const { VITE_BASE_URL } = import.meta.env;

interface TableData {
  id: string;
  name: string;
  desc: string;
  price: number;
  amount: number;
  image?: string;
  category: {
    name: string;
  };
  illnessMedicine: [
    {
      illness: {
        name: string;
      };
    }
  ];
}
const drugDialogVisible = ref(false);
watch(
  () => drugDialogVisible.value,
  newVal => {
    // 对话框关闭时获取数据
    if (!newVal) {
      emit("getData");
    }
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

const drugId = ref();

const upDrugDetails = async (id: string) => {
  drugId.value = id;
  drugDialogVisible.value = true;
};

const delDrug = async (id: string) => {
  const res = await requsestDelDrug(id);
  if (res.success) {
    message("删除成功", { type: "success" });
    emit("getData");
  } else {
    message("删除失败", { type: "error" });
  }
};
</script>
<style lang="scss" scoped></style>
