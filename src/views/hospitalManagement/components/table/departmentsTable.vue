import { requestDocTitleDel, requestDocDepartmentsDel, requestDocTagsDel } from
'../../../../api/hospitalManagement';
<template>
  <div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column fixed type="selection" width="55" />
      <el-table-column prop="name" :label="title" width="120" />
      <el-table-column
        prop="desc"
        label="描述"
        width="120"
        show-overflow-tooltip
      />
      <el-table-column fixed="right" label="操作" min-width="120">
        <template #default="{ row }">
          <el-button
            link
            type="primary"
            size="small"
            @click="handleRemove(props.title, row.id)"
          >
            删除
          </el-button>
          <el-button
            link
            type="primary"
            size="small"
            @click="handleUpdata(props.title, row.id)"
            >修改</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script setup lang="ts">
import {
  requestDocTitleDel,
  requestDocDepartmentsDel,
  requestDocTagsDel
} from "@/api/hospitalManagement";
import { message } from "@/utils/message";

interface TableData {
  id: string;
  name: string;
  desc: string;
  image?: string;
}
const props = defineProps<{
  title: string;
  tableData: TableData[];
}>();
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
  });
};
</script>
<style lang="scss" scoped></style>
