<template>
  <div>
    <el-button class="mb-3" :icon="Plus" type="primary" @click="addArticles"
      >新增文章</el-button
    >
    <el-table :data="tableData">
      <el-table-column
        fixed="left"
        :index="index"
        type="index"
        label="#"
        center
      />
      <el-table-column prop="name" label="文章名称" align="center" />
      <el-table-column
        prop="desc"
        label="详情"
        align="center"
        show-overflow-tooltip
        min-width="120"
      />
      <el-table-column prop="views" align="center" label="浏览量">
        <template #default="{ row }">
          <div>{{ formatNumber(row.views) }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="image" label="主图" align="center" width="100">
        <template #default="{ row }">
          <el-avatar
            shape="square"
            :size="50"
            :src="row.image ? VITE_BASE_URL + row.image : ''"
          />
        </template>
      </el-table-column>
      <el-table-column prop="category" align="center" label="文章类型">
        <template #default="{ row }">
          <div>{{ row.category ? row.category.name : "-" }}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="createdAt"
        align="center"
        label="文章创建时间"
        min-width="120"
      >
        <template #default="{ row }">
          <div>{{ formatDate(row.createdAt) }}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="updatedAt"
        align="center"
        label="文章修改时间"
        min-width="120"
      >
        <template #default="{ row }">
          <div>{{ formatDate(row.updatedAt) }}</div>
        </template>
      </el-table-column>

      <el-table-column fixed="right" align="center" label="操作">
        <template #default="{ row }">
          <el-button
            type="danger"
            :icon="Delete"
            size="small"
            @click="delArticle(row.id)"
          >
            删除
          </el-button>
          <el-button
            type="warning"
            :icon="Edit"
            plain
            size="small"
            @click="upArticleDetails(row.id)"
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
    <ArticleDialog v-model="articleDialog" :articleId="articleId" />
  </div>
</template>
<script setup lang="ts">
import { Edit, Delete } from "@element-plus/icons-vue";
import { requestDelArticle } from "@/api/articleManage";
import { message } from "@/utils/message";
import { ref, onMounted, computed, watch } from "vue";
import DiseaseDialog from "../Dialog/DiseaseDialog.vue";
import { Plus } from "@element-plus/icons-vue";
import ArticleDialog from "../Dialog/ArticleDialog.vue";
import { formatNumber } from "@/utils/utils";
import dayjs from "dayjs";
const { VITE_BASE_URL } = import.meta.env;

interface TableData {
  id: string;
  name: string;
  desc: string;
  image?: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  category: {
    name: string;
  };
}
const articleDialog = ref(false);
watch(
  () => articleDialog.value,
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

const articleId = ref();
const upArticleDetails = async (id: string) => {
  articleId.value = id;
  articleDialog.value = true;
};

const addArticles = () => {
  articleId.value = "";
  articleDialog.value = true;
};

const delArticle = async (id: string) => {
  const res = await requestDelArticle(id);
  if (res.success) {
    message("删除成功", { type: "success" });
    emit("getData");
  } else {
    message("删除失败", { type: "error" });
  }
};

const formatDate = (date: string) => {
  return dayjs(date).format("YYYY-MM-DD HH:mm:ss");
};
</script>
<style lang="scss" scoped></style>
