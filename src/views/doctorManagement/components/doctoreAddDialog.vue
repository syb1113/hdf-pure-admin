<template>
  <div>
    <el-dialog v-model="doctoreAddVisible" title="添加医生" width="500">
      <el-form :model="form">
        <el-form-item label="医生名称" :label-width="formLabelWidth">
          <el-input
            v-model="form.name"
            clearable
            placeholder="请输入医生名称"
          />
        </el-form-item>
        <el-form-item label="医生职称" :label-width="formLabelWidth">
          <el-select
            v-model="form.doctorTitleId"
            placeholder="请选择医生职称"
            filterable
            clearable
          >
            <el-option
              v-for="i in DoctorTitleIdList"
              :key="i.id"
              :label="i.name"
              :value="i.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="所属科室" :label-width="formLabelWidth">
          <el-select
            v-model="form.departmentId"
            placeholder="请选择科室"
            filterable
            clearable
          >
            <el-option
              v-for="i in DepartmentIdList"
              :key="i.id"
              :label="i.name"
              :value="i.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="所属医院" :label-width="formLabelWidth">
          <el-select
            v-model="form.hospitalId"
            placeholder="请选择医院"
            filterable
            clearable
          >
            <el-option
              v-for="i in HospitalIdList"
              :key="i.id"
              :label="i.name"
              :value="i.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="doctoreAddVisible = false">取消</el-button>
          <el-button type="primary" @click="doctoreAddVisible = false">
            确认
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import {
  requestDoctorTitleIdList,
  requestDepartmentIdList,
  requestHospitalIdList
} from "@/api/doctorManagement";
const doctoreAddVisible = defineModel<boolean>();
const formLabelWidth = "140px";
const DoctorTitleIdList = ref([]);
const DepartmentIdList = ref([]);
const HospitalIdList = ref([]);

onMounted(() => {
  getDoctorTitleIdList();
  getDepartmentIdList();
  getHospitalIdList();
});
const form = ref({
  name: "",
  desc: "",
  tags: "",
  content: "",
  doctorTitleId: "", //职称id
  departmentId: "", //科室id
  hospitalId: "", //医院id
  avatar: ""
});

const getDoctorTitleIdList = () => {
  requestDoctorTitleIdList().then((res: any) => {
    const { data, success } = res;
    if (success) {
      DoctorTitleIdList.value = data.list;
    }
  });
};
//科室列表
const getDepartmentIdList = () => {
  requestDepartmentIdList().then((res: any) => {
    const { data, success } = res;
    if (success) {
      DepartmentIdList.value = data;
    }
  });
};

const getHospitalIdList = () => {
  requestHospitalIdList().then((res: any) => {
    const { data, success } = res;
    if (success) {
      HospitalIdList.value = data.list;
    }
  });
};
</script>
<style lang="scss" scoped></style>
