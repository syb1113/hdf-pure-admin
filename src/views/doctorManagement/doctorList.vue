<script setup lang="ts">
import { ref, onMounted } from "vue";
import { utils, writeFile } from "xlsx";
import { requestDoctoresList } from "@/api/doctorManagement";
import { message } from "@/utils/message";
const { VITE_BASE_URL } = import.meta.env;

defineOptions({
  name: "doctorList"
});

interface SpecificInfor {
  id: string;
  name: string;
  desc: string; //详情
  image: string;
  content: string; //描述
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
onMounted(() => {
  getData();
});
const handleClick = () => {
  console.log("click");
};
const doctorAvatar =
  VITE_BASE_URL + "/uploads/file-1736770944771-752118396.jpg";
const columns = [
  { title: "医生名字", dataKey: "name" },
  { title: "医生简介", dataKey: "desc" },
  { title: "医生特长", dataKey: "tags" },
  { title: "医生简介", dataKey: "desc" },
  { title: "医生部门", dataKey: "state" },
  { title: "医生职位", dataKey: "city" },
  { title: "所属医院", dataKey: "address" },
  { title: "医院电话", dataKey: "zip" },
  { title: "医院地址", dataKey: "tag" }
];

const tableData = ref<Array<TableData>>([]);
const getData = async () => {
  await requestDoctoresList().then((res: any) => {
    const { data, success, errorMessage } = res;
    console.log(data);
    if (success) {
      tableData.value = data.list;
    } else {
      message("获取失败", { type: "error" });
    }
  });
};
const exportExcel = () => {
  const res = tableData.value.map(item => {
    return columns.map(column => item[column.dataKey]);
  });

  const titleList = columns.map(column => column.title);

  res.unshift(titleList);

  const workSheet = utils.aoa_to_sheet(res);
  const workBook = utils.book_new();

  utils.book_append_sheet(workBook, workSheet, "数据报表");

  writeFile(workBook, "医生列表.xlsx");
};
</script>

<template>
  <el-card shadow="never">
    <el-button type="primary" @click="exportExcel">导出Excel</el-button>
    <div class="h-[25rem] mt-3">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column fixed="left" type="index" label="#" width="100" />
        <el-table-column prop="name" label="医生名字" width="120" />
        <el-table-column prop="desc" label="医生简介" width="120" />
        <el-table-column prop="tags" label="医生特长" width="120">
          <template #default="{ row }">
            <el-tag type="success">{{ row.tags }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="医生描述" width="600" />
        <el-table-column prop="avatar" label="证件照" width="120">
          <template #default="{ row }">
            <el-avatar
              shape="square"
              :size="50"
              :src="row.avatar ? row.avatar : doctorAvatar"
            />
          </template>
        </el-table-column>
        <el-table-column prop="avatar" label="所属部门" width="120">
          <template #default="{ row }">
            <el-text class="mx-1">{{ row.departmentInfo.name }}</el-text>
          </template> </el-table-column
        ><el-table-column prop="avatar" label="医生职位" width="120">
          <template #default="{ row }">
            <el-text class="mx-1">{{ row.doctorTitleInfo.name }}</el-text>
          </template> </el-table-column
        ><el-table-column prop="avatar" label="所属医院" width="120">
          <template #default="{ row }">
            <el-text class="mx-1">{{ row.hospitalInfo.name }}</el-text>
          </template>
        </el-table-column>
        <el-table-column prop="avatar" label="医院电话" width="120">
          <template #default="{ row }">
            <el-text class="mx-1">{{ row.hospitalInfo.phone }}</el-text>
          </template>
        </el-table-column>
        <el-table-column prop="avatar" label="医院地址" width="120">
          <template #default="{ row }">
            <el-text class="mx-1">{{ row.hospitalInfo.address }}</el-text>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="200">
          <template #default>
            <el-button type="primary" size="small" @click="handleClick"
              >详情</el-button
            >
            <el-button size="small">修改</el-button>
            <el-button type="danger" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-card>
</template>
