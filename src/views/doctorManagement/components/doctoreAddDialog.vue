<template>
  <div>
    <el-dialog
      v-model="doctoreAddVisible"
      title="添加医生"
      width="600"
      :show-close="false"
    >
      <el-form
        ref="ruleFormRef"
        :model="form"
        style="max-width: 600px"
        :rules="rules"
      >
        <el-form-item
          label="医生名称"
          :label-width="formLabelWidth"
          prop="name"
        >
          <el-input
            v-model="form.name"
            clearable
            placeholder="请输入医生名称"
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
          />
        </el-form-item>
        <el-form-item
          label="医生头像上传"
          :label-width="formLabelWidth"
          prop="avatar"
        >
          <el-upload
            v-model:file-list="fileList"
            :action="uploadAction"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-success="handleUploadSuccess"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>

          <el-dialog v-model="dialogVisible">
            <img w-full :src="dialogImageUrl" alt="Preview Image" />
          </el-dialog>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="resetForm(ruleFormRef)">取消</el-button>
          <el-button type="primary" @click="submitForm(ruleFormRef)">
            确认
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, reactive, defineEmits } from "vue";
const { VITE_BASE_URL } = import.meta.env;
import { ElMessage } from "element-plus";
import { Plus } from "@element-plus/icons-vue";
import type { UploadProps, UploadUserFile } from "element-plus";
import type { ComponentSize, FormInstance, FormRules } from "element-plus";
import {
  requestDoctorTitleIdList,
  requestDepartmentIdList,
  requestHospitalIdList,
  requestDoctoresAdd
} from "@/api/doctorManagement";

interface RuleForm {
  name: string;
  desc: string;
  tags: string;
  content: string;
  doctorTitleId: string; //职称id
  departmentId: string; //科室id
  hospitalId: string; //医院id
  avatar: string;
}
const doctoreAddVisible = defineModel<boolean>();
const formLabelWidth = "140px";
const DoctorTitleIdList = ref([]);
const DepartmentIdList = ref([]);
const HospitalIdList = ref([]);
const uploadAction = VITE_BASE_URL + "/common/upload";
const ruleFormRef = ref<FormInstance>();
onMounted(() => {
  getDoctorTitleIdList();
  getDepartmentIdList();
  getHospitalIdList();
});
const fileList = ref<UploadUserFile[]>([]);
const emit = defineEmits<{
  (event: "getData"): void;
}>();
const dialogImageUrl = ref("");
const dialogVisible = ref(false);

const handlePictureCardPreview: UploadProps["onPreview"] = uploadFile => {
  dialogImageUrl.value = uploadFile.url!;
  dialogVisible.value = true;
};
const handleUploadSuccess: UploadProps["onSuccess"] = (response, file) => {
  const { success, data } = response;
  if (success) {
    ElMessage.success("上传成功");
    console.log(data);
    form.value.avatar = data;
    console.log(form.value);
  } else {
    ElMessage.error("上传失败");
  }
};

const form = ref<RuleForm>({
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
const resetFrom = () => {
  form.value = {
    name: "",
    desc: "",
    tags: "",
    content: "",
    doctorTitleId: "", //职称id
    departmentId: "", //科室id
    hospitalId: "", //医院id
    avatar: ""
  };
};

const rules = reactive<FormRules<RuleForm>>({
  name: [{ required: true, message: "请输入医生名称", trigger: "blur" }],
  doctorTitleId: [
    {
      required: true,
      message: "医生职称不能为空",
      trigger: "change"
    }
  ],
  departmentId: [
    {
      required: true,
      message: "医生科室不能为空",
      trigger: "change"
    }
  ],
  hospitalId: [
    {
      required: true,
      message: "医生所属医院不能为空",
      trigger: "change"
    }
  ],
  tags: [
    {
      required: true,
      message: "医生特长不能为空",
      trigger: "change"
    }
  ],
  desc: [
    {
      required: true,
      message: "医生简介不能为空",
      trigger: "change"
    }
  ],
  content: [
    {
      required: true,
      message: "医生详情不能为空",
      trigger: "change"
    }
  ],
  avatar: [
    {
      required: true,
      message: "需要上传医生头像",
      trigger: "change"
    }
  ]
});

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log("submit!");
      requestDoctoresAdd(form.value).then((res: any) => {
        const { success, errorMessage } = res;
        console.log(res);
        if (success) {
          ElMessage.success("添加成功");
          emit("getData");
          resetForm(formEl);
        } else {
          ElMessage.error(errorMessage);
        }
      });
      doctoreAddVisible.value = false;
      resetFrom();
    } else {
      console.log("error submit!", fields);
    }
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  doctoreAddVisible.value = false;
  resetFrom();
  formEl.resetFields();
};
</script>
<style lang="scss" scoped></style>
