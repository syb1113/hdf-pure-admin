<template>
  <div class="root">
    <SearchBar :options-lit="optionsData" @search="searchData" />

    <el-card shadow="always">
      <el-button
        v-if="hasPerms('permission:btn:add')"
        :icon="Plus"
        type="primary"
        @click="requestHospitalAdd"
        >新增医院</el-button
      >
      <el-button type="primary" @click="exportExcel">导出Excel</el-button>
      <div class="mt-3">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column fixed="left" type="index" label="#" width="100" />
          <el-table-column prop="name" label="医院名称" />
          <el-table-column prop="desc" label="医院简介" min-width="200" />
          <!-- <el-table-column prop="content" label="医院详情" min-width="300">
            <template #default="{ row }">
              <div v-html="row.content" />
            </template>
          </el-table-column> -->
          <el-table-column prop="image" label="医院照片" width="120">
            <template #default="{ row }">
              <el-avatar
                shape="square"
                :size="50"
                :src="row.image ? VITE_BASE_URL + row.image : doctorAvatar"
              />
            </template>
          </el-table-column>
          <el-table-column prop="phone" label="医院电话" width="120" />
          <el-table-column prop="address" label="医院地址" min-width="200" />
          <el-table-column fixed="right" label="操作" width="200">
            <template #default="{ row }">
              <el-button type="primary" size="small" @click="handleClick(row)"
                >详情</el-button
              >
              <el-button
                v-if="hasPerms('permission:btn:edit')"
                size="small"
                @click="updataHospital(row)"
                >修改</el-button
              >
              <el-button
                v-if="
                  hasPerms([
                    'permission:btn:add',
                    'permission:btn:edit',
                    'permission:btn:delete'
                  ])
                "
                type="danger"
                size="small"
                @click="delHospital(row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="flex justify-end mt-3">
        <el-pagination
          v-model:current-page="currentPage"
          :page-size="pages.per"
          layout="total, prev, pager, next"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
      <hospitalAddDialog v-model="hospitalAddVisible" @getData="getData" />
    </el-card>
    <hospitalDetailsDialog
      ref="detailRef"
      v-model="hospitalDetailVisible"
      :hospitalData="hospitalData"
      :disabled="disabled"
      @getData="getData"
    />
  </div>
</template>

<script setup lang="ts">
import { hasPerms } from "@/utils/auth";
import { ref, onMounted, provide, inject } from "vue";
import { useRouter } from "vue-router";
import { utils, writeFile } from "xlsx";
import {
  requestHospitalList,
  requestHostpitalDetails
} from "@/api/hospitalManagement";
import { message } from "@/utils/message";
import { Plus } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import hospitalAddDialog from "./components/dialog/hospitalAddDialog.vue";
import hospitalDetailsDialog from "./components/dialog/hospitalDetailsDialog.vue";
import { requsestDelHospital } from "@/api/hospitalManagement";
import SearchBar from "@/views/components/SearchBar/index.vue";

const { VITE_BASE_URL } = import.meta.env;
interface TableData {
  id: string;
  name: string;
  desc: string;
  content: string;
  image: string;
  address: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
}

interface HostipalData {
  readonly id: string;
  name: string;
  desc: string;
  image: string;
  content: string;
  address: string;
  phone: string;
}

onMounted(() => {
  getData();
  getOptions();
});
const router = useRouter();
const hospitalAddVisible = ref<boolean>(false);
const hospitalDetailVisible = ref<boolean>(false);
const disabled = ref<boolean>(true);
const hospitalData = ref<HostipalData>();
// 详情
const detailRef = ref(null);
// const addressStore = useAddressStore();
const handleClick = (row: TableData) => {
  const id = row.id;
  router.push(`/hospitalManagement/hospitalDetails/${id}`);
};

// 修改
const updataHospital = (row: TableData) => {
  getHostpitalDetails(row);
  hospitalDetailVisible.value = true;
  disabled.value = false;
};

const delHospital = async (row: TableData) => {
  await requsestDelHospital(row.id).then((res: any) => {
    const { success, errorMessage } = res;
    if (success) {
      ElMessage.success("删除成功");
      getData();
    } else {
      ElMessage.error(errorMessage);
    }
  });
};

const getHostpitalDetails = async (row: TableData) => {
  await requestHostpitalDetails(row.id).then((res: any) => {
    const { data, success } = res;
    if (success) {
      hospitalData.value = data;
    }
  });
};
const doctorAvatar = VITE_BASE_URL + "/uploads/file-1742645674476-49344101.png";
const columns = [
  { title: "医院名称", dataKey: "name" },
  { title: "医院简介", dataKey: "desc" },
  { title: "医院地址", dataKey: "address" },
  { title: "医院电话", dataKey: "phone" }
];

const tableData = ref<Array<TableData>>([]);
const pages = ref({
  per: 5, //每页显示的数量
  page: 1, //页码
  name: ""
});
const currentPage = ref<number>(1);
const total = ref<number>(0);

const getData = async () => {
  await requestHospitalList(pages.value).then((res: any) => {
    const { data, success, errorMessage } = res;
    // console.log(data);
    if (success) {
      tableData.value = data.list;
      total.value = data.total;
    } else {
      message("获取失败", { type: "error" });
    }
  });
};
const optionsData = ref<Array<TableData>>([]);
const getOptions = async () => {
  await requestHospitalList().then((res: any) => {
    const { data, success, errorMessage } = res;
    // console.log(data);
    if (success) {
      optionsData.value = data.list;
    } else {
      message("获取失败", { type: "error" });
    }
  });
};

const searchData = (search: string | any) => {
  pages.value.name = search;
  getData();
};

const handleSizeChange = (val: number) => {
  pages.value.per = val;
  getData();
};
const handleCurrentChange = (val: number) => {
  pages.value.page = val;
  getData();
};
const exportExcel = () => {
  const res = optionsData.value.map(item => {
    return columns.map(column => {
      return item[column.dataKey];
    });
  });

  const titleList = columns.map(column => column.title);
  res.unshift(titleList);
  const workSheet = utils.aoa_to_sheet(res);
  // 计算列宽
  const colWidths = columns.map((_, colIndex) => {
    // 获取该列所有单元格内容的最大长度
    const maxWidth = res.reduce((acc, row) => {
      const cellValue = row[colIndex] || "";
      const length = cellValue.toString().length;
      return Math.max(acc, length);
    }, columns[colIndex].title.length); // 初始值为标题长度

    // 根据字符长度设置列宽（系数可以调整）
    return { wch: maxWidth * 2 }; // 1.5倍字符长度作为列宽
  });

  workSheet["!cols"] = colWidths; // 设置列宽
  const workBook = utils.book_new();

  utils.book_append_sheet(workBook, workSheet, "数据报表");
  writeFile(workBook, "医院列表.xlsx");
};

const requestHospitalAdd = () => {
  hospitalAddVisible.value = true;
};
</script>
<style lang="scss" scoped></style>
