<template>
  <div>
    <el-dialog v-model="detailVisible" title="医生详情" width="500">
      <el-form ref="ruleFormRef" style="max-width: 600px">
        <el-form-item
          label="医生名称"
          :label-width="formLabelWidth"
          prop="name"
        >
          <el-input
            v-model="form.name"
            clearable
            placeholder="请输入医生名称"
            :disabled="disabled"
          />
        </el-form-item>
        <el-form-item
          label="医生职称"
          :label-width="formLabelWidth"
          prop="doctorTitleId"
        >
          <el-select
            v-model="form.doctorTitleId"
            placeholder="请选择医生职称"
            filterable
            clearable
            :disabled="disabled"
          >
            <el-option
              v-for="i in DoctorTitleIdList"
              :key="i.id"
              :label="i.name"
              :value="i.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="所属科室"
          :label-width="formLabelWidth"
          prop="departmentId"
        >
          <el-select
            v-model="form.departmentId"
            placeholder="请选择科室"
            filterable
            clearable
            :disabled="disabled"
          >
            <el-option
              v-for="i in DepartmentIdList"
              :key="i.id"
              :label="i.name"
              :value="i.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="所属医院"
          :label-width="formLabelWidth"
          prop="hospitalId"
        >
          <el-select
            v-model="form.hospitalId"
            placeholder="请选择医院"
            filterable
            clearable
            :disabled="disabled"
          >
            <el-option
              v-for="i in HospitalIdList"
              :key="i.id"
              :label="i.name"
              :value="i.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="医生简介"
          :label-width="formLabelWidth"
          prop="desc"
        >
          <el-input
            v-model="form.desc"
            clearable
            placeholder="请输入医生简介"
            :disabled="disabled"
          />
        </el-form-item>
        <el-form-item
          label="医生特长"
          :label-width="formLabelWidth"
          prop="tags"
        >
          <el-input
            v-model="form.tags"
            clearable
            placeholder="请输入医生特长(用逗号隔开)"
            :disabled="disabled"
          />
        </el-form-item>
        <el-form-item
          label="医生详情介绍"
          :label-width="formLabelWidth"
          prop="content"
        >
          <el-input
            v-model="form.content"
            clearable
            placeholder="请输入医生详情介绍"
            :disabled="disabled"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div v-if="!disabled" class="dialog-footer">
          <el-button @click="detailVisible = false">取消</el-button>
          <el-button type="primary" @click="updataDoctor"> 确认 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from "vue";
// import { delObjectProperty } from "@pureadmin/utils";
import {
  requestDoctorTitleIdList,
  requestDepartmentIdList,
  requestHospitalIdList,
  requestDoctorModify
} from "@/api/doctorManagement";

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

const formLabelWidth = "140px";
const detailVisible = defineModel<boolean>();
const props = defineProps<{
  doctorDetails: RuleForm;
  disabled: boolean;
}>();
const form = ref<RuleForm>({
  ...props.doctorDetails
});
const emit = defineEmits<{
  (event: "getData"): void;
}>();
const DoctorTitleIdList = ref([]);
const DepartmentIdList = ref([]);
const HospitalIdList = ref([]);

watch(
  () => props.doctorDetails,
  newVal => {
    form.value = { ...newVal };
  },
  { deep: true, immediate: true }
);

onMounted(() => {
  getDoctorTitleIdList();
  getDepartmentIdList();
  getHospitalIdList();
});

const updataDoctor = async () => {
  console.log("form", form.value);
  const data = {};
  for (const key in form.value) {
    if (key === "id" || key === "createdAt" || key === "updatedAt") {
      continue;
    }
    data[key] = form.value[key];
  }
  // const data = delObjectProperty(form.value, ["id", "createdAt", "updatedAt"]);
  await requestDoctorModify(form.value.id, data).then((res: any) => {
    const { success } = res;
    if (success) {
      detailVisible.value = false;
    }
  });
  emit("getData");
};

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
