<template>
  <div class="root">
    <div class="flex gap-3">
      <el-card
        v-for="item in components"
        :key="item.title"
        shadow="always"
        class="flex-1"
      >
        <template #header>
          <div class="card-header">
            <span>{{ item.title }}</span>
          </div>
        </template>
        <departmentsTable
          :title="item.title"
          :table-data="item.componentData"
        />
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

interface ComponentList {
  title: string;
  componentData: TableData[] | any;
}

const Doctortitles = ref<TableData[]>([]);
const Departments = ref<TableData[]>([]);
const DoctorTags = ref<TableData[]>([]);
const components = ref<ComponentList[]>([
  { title: "医生职称", componentData: Doctortitles },
  { title: "医院科室", componentData: Departments },
  { title: "医生标签", componentData: DoctorTags }
]);

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
