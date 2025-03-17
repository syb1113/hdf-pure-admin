<template>
  <div>
    <div class="root">
      <el-card shadow="always">
        <el-button :icon="Plus" type="primary" @click="requestDoctoreAdd"
          >添加医生</el-button
        >
        <el-button type="primary" @click="exportExcel">导出Excel</el-button>
        <div class="mt-3">
          <el-table :data="tableData" style="width: 100%">
            <el-table-column fixed="left" type="index" label="#" width="100" />
            <el-table-column prop="name" label="医生名字" min-width="120" />
            <el-table-column prop="desc" label="医生简介" min-width="200" />
            <el-table-column prop="tags" label="医生特长" min-width="120">
              <template #default="{ row }">
                <el-tag
                  v-for="i in splitTags(row.tags)"
                  :key="i"
                  type="success"
                  >{{ i }}</el-tag
                >
              </template>
            </el-table-column>
            <!-- <el-table-column prop="content" label="医生描述" min-width="160" /> -->
            <el-table-column prop="avatar" label="证件照" width="120">
              <template #default="{ row }">
                <el-avatar
                  shape="square"
                  :size="50"
                  :src="row.avatar ? VITE_BASE_URL + row.avatar : doctorAvatar"
                />
              </template>
            </el-table-column>
            <el-table-column
              prop="departmentInfoName"
              label="所属部门"
              width="120"
            >
              <template #default="{ row }">
                <el-text class="mx-1">{{
                  row.departmentInfo.name ? row.departmentInfo.name : "-"
                }}</el-text>
              </template> </el-table-column
            ><el-table-column
              prop="doctorTitleInfoName"
              label="医生职位"
              width="120"
            >
              <template #default="{ row }">
                <el-text class="mx-1">{{
                  row.doctorTitleInfo.name ? row.doctorTitleInfo.name : "-"
                }}</el-text>
              </template> </el-table-column
            ><el-table-column
              prop="hospitalInfoName"
              label="所属医院"
              min-width="200"
            >
              <template #default="{ row }">
                <el-text class="mx-1">{{
                  row.hospitalInfo.name ? row.hospitalInfo.name : "-"
                }}</el-text>
              </template>
            </el-table-column>
            <el-table-column prop="phone" label="医院电话" width="120">
              <template #default="{ row }">
                <el-text class="mx-1">{{
                  row.hospitalInfo.phone ? row.hospitalInfo.phone : "-"
                }}</el-text>
              </template>
            </el-table-column>
            <el-table-column prop="address" label="医院地址" min-width="200">
              <template #default="{ row }">
                <el-text class="mx-1">{{
                  row.hospitalInfo.address ? row.hospitalInfo.address : "-"
                }}</el-text>
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" min-width="200">
              <template #default="{ row }">
                <el-button type="primary" size="small" @click="handleClick(row)"
                  >详情</el-button
                >
                <el-button size="small" @click="updataDoctor(row)"
                  >修改</el-button
                >
                <el-button type="danger" size="small" @click="delDoctor(row)"
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
        <doctoreAddDialog v-model="doctoreAddVisible" @getData="getData" />
        <doctoreDetailDialog
          v-model="doctoreDetailVisible"
          :doctorDetails="doctorDetails"
          :disabled="disabled"
          @getData="getData"
        />
      </el-card>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { utils, writeFile } from "xlsx";
import { requestDoctoresList } from "@/api/doctorManagement";
import { message } from "@/utils/message";
import doctoreAddDialog from "./components/doctoreAddDialog.vue";
import doctoreDetailDialog from "./components/doctoreDetailDialog.vue";
import { Plus } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";

import {
  requestDoctorDetails,
  requestDoctorDelete
} from "@/api/doctorManagement";
const { VITE_BASE_URL } = import.meta.env;
defineOptions({
  name: "doctorList"
});

interface SpecificInfor {
  id?: string;
  name: string;
  desc?: string; //详情
  image?: string;
  content?: string; //描述
  [propName: string]: string;
}

interface TableData {
  id: string;
  name: string;
  desc: string;
  tags: string;
  content: string;
  avatar: string;
  createdAt: string;
  updatedAt: string;
  departmentId: string; //部门id
  doctorTitleId: string; //职称id
  hospitalId: string; //医院id
  doctorTitleInfo: SpecificInfor; //职位
  departmentInfo: SpecificInfor; //部门
  hospitalInfo: SpecificInfor; //医院信息
  [propName: string]: string | number | SpecificInfor;
}

interface RuleForm {
  id: string;
  name: string;
  desc: string;
  tags: string;
  content: string;
  doctorTitleId: string; //职称id
  departmentId: string; //科室id
  hospitalId: string; //医院id
  avatar: string;
}
onMounted(() => {
  getData();
});

const doctoreAddVisible = ref<boolean>(false);
const doctoreDetailVisible = ref<boolean>(false);
const disabled = ref<boolean>(true);
const doctorDetails = ref<RuleForm>();
// 详情
const handleClick = (row: TableData) => {
  getDoctorDetails(row);
  doctoreDetailVisible.value = true;
  disabled.value = true;
};

// 修改
const updataDoctor = (row: TableData) => {
  getDoctorDetails(row);
  doctoreDetailVisible.value = true;
  disabled.value = false;
};

const delDoctor = async (row: TableData) => {
  await requestDoctorDelete(row.id).then((res: any) => {
    const { success, errorMessage } = res;
    if (success) {
      ElMessage.success("删除成功");
      getData();
    } else {
      ElMessage.error(errorMessage);
    }
  });
};

const getDoctorDetails = async (row: TableData) => {
  await requestDoctorDetails(row.id).then((res: any) => {
    const { data, success } = res;
    console.log("res", res);
    if (success) {
      doctorDetails.value = data;
    }
  });
};
const doctorAvatar =
  VITE_BASE_URL + "/uploads/file-1736770944771-752118396.jpg";
const columns = [
  { title: "医生名字", dataKey: "name" },
  { title: "医生简介", dataKey: "desc" },
  { title: "医生特长", dataKey: "tags" },
  { title: "医生描述", dataKey: "content" },
  { title: "医生部门", dataKey: item => item.departmentInfo?.name },
  { title: "医生职位", dataKey: item => item.doctorTitleInfo?.name },
  { title: "所属医院", dataKey: item => item.hospitalInfo?.name },
  { title: "医院电话", dataKey: item => item.hospitalInfo?.phone },
  { title: "医院地址", dataKey: item => item.hospitalInfo?.address }
];

const tableData = ref<Array<TableData>>([]);
const pages = ref({
  per: 9, //每页显示的数量
  page: 1 //页码
});
const currentPage = ref<number>(1);
const total = ref<number>(0);

const getData = async () => {
  await requestDoctoresList(pages.value).then((res: any) => {
    const { data, success, errorMessage } = res;
    if (success) {
      tableData.value = data.list;
      console.log(tableData.value);
      total.value = data.total;
    } else {
      message("获取失败", { type: "error" });
    }
  });
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
  const res = tableData.value.map(item => {
    return columns.map(column => {
      if (typeof column.dataKey === "function") {
        return column.dataKey(item);
      }
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
  writeFile(workBook, "医生列表.xlsx");
};

//将特长分开
const splitTags = (tags: string) => {
  return tags.split(/,|，/);
};
const requestDoctoreAdd = () => {
  doctoreAddVisible.value = true;
};
</script>

<style lang="scss" scoped>
.root {
  margin: 10px;
}
</style>
