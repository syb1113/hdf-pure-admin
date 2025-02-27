<template>
  <div class="root">
    <div class="flex">
      <el-card shadow="always" class="flex-1">
        <template #header>
          <div class="card-header">
            <span>医生职称</span>
          </div>
        </template>
        <departmentsTable title="医生职称" :table-data="Doctortitles" />
      </el-card>
      <el-card shadow="always" class="flex-1 ml-3">
        <template #header>
          <div class="card-header">
            <span>医院科室</span>
          </div>
        </template>
        <departmentsTable title="医院科室" :table-data="Departments" />
      </el-card>
      <el-card shadow="always" class="flex-1 ml-3">
        <template #header>
          <div class="card-header">
            <span>医生标签</span>
          </div>
        </template>
        <departmentsTable title="医生标签" :table-data="DoctorTags" />
      </el-card>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from "vue";
import {
  requsestDoctortitles,
  requsestDepartments,
  requsestDoctorTags
} from "@/api/hospitalManagement";
import departmentsTable from "./components/table/departmentsTable.vue";
import { message } from "@/utils/message";

interface TableData {
  id: string;
  name: string;
  desc: string;
  image?: string;
}

const Doctortitles = ref<TableData[]>([]);
const Departments = ref<TableData[]>([]);
const DoctorTags = ref<TableData[]>([]);

onMounted(() => {
  getDoctortitles();
  getDepartments();
  getDoctorTags();
});

const getDoctortitles = async () => {
  await requsestDoctortitles().then((res: any) => {
    const { data, success } = res;
    if (!success) {
      message("获取失败", { type: "error" });
      return;
    }
    Doctortitles.value = data.list;
  });
};

const getDepartments = async () => {
  await requsestDepartments().then((res: any) => {
    const { data, success } = res;
    if (!success) {
      message("获取失败", { type: "error" });
      return;
    }
    Departments.value = data.list;
  });
};

const getDoctorTags = async () => {
  await requsestDoctorTags().then((res: any) => {
    const { data, success } = res;
    if (!success) {
      message("获取失败", { type: "error" });
      return;
    }
    DoctorTags.value = data.list;
  });
};
</script>
<style lang="scss"></style>
