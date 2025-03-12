<template>
  <div>
    <el-dialog
      v-model="doctoreAddVisible"
      title="新增医院"
      width="800"
      :show-close="false"
    >
      <el-form
        ref="ruleFormRef"
        :model="form"
        style="max-width: 800px"
        :rules="rules"
      >
        <el-form-item
          label="医院名称"
          :label-width="formLabelWidth"
          prop="name"
        >
          <el-input
            v-model="form.name"
            clearable
            placeholder="请输入医院名称"
          />
        </el-form-item>
        <el-form-item
          label="医院简介"
          :label-width="formLabelWidth"
          prop="desc"
        >
          <el-input
            v-model="form.desc"
            clearable
            placeholder="请输入医院简介"
          />
        </el-form-item>
        <!-- <el-form-item
          label="医院地址"
          :label-width="formLabelWidth"
          prop="address"
        >
          <area-selected
            gap="10"
            width="135"
            @get-address="handleGetAdress"
            @get-address-info="handleGetAdressInfo"
          />
        </el-form-item> -->
        <el-form-item
          label="医院地址"
          :label-width="formLabelWidth"
          prop="address"
        >
          <el-input
            v-model="form.address"
            clearable
            placeholder="请输入详细地址"
          />
        </el-form-item>
        <el-form-item
          label="医院电话"
          :label-width="formLabelWidth"
          prop="name"
        >
          <el-input
            v-model="form.phone"
            clearable
            placeholder="请输入医院电话"
          />
        </el-form-item>

        <el-form-item
          label="医院图像上传"
          :label-width="formLabelWidth"
          prop="image"
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
            <img :src="dialogImageUrl" alt="Preview Image" />
          </el-dialog>
        </el-form-item>

        <el-form-item
          label="医院详情介绍"
          :label-width="formLabelWidth"
          prop="content"
        >
          <!-- <el-input
            v-model="form.content"
            clearable
            placeholder="请输入医院详情介绍"
          /> -->
          <Editor ref="editorRef" v-model="form.content" />
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
import {
  ref,
  onMounted,
  reactive,
  defineEmits,
  shallowRef,
  onBeforeUnmount
} from "vue";
const { VITE_BASE_URL } = import.meta.env;
import { ElMessage } from "element-plus";
import { Plus } from "@element-plus/icons-vue";
import type { UploadProps, UploadUserFile } from "element-plus";
import type { ComponentSize, FormInstance, FormRules } from "element-plus";
import { requestAddHospital } from "@/api/hospitalManagement";
import areaSelected from "../areaSelected.vue";
import Editor from "@/components/Editor/index.vue";
interface RuleForm {
  name: string;
  desc: string;
  image: string;
  content: string;
  phone: string;
  address: string;
  addressInfo?: string;
}
const editorRef = ref(null);
const doctoreAddVisible = defineModel<boolean>();
const formLabelWidth = "140px";
const uploadAction = VITE_BASE_URL + "/common/upload";
const ruleFormRef = ref<FormInstance>();
onMounted(() => {});
const fileList = ref<UploadUserFile[]>([]);
const emit = defineEmits<{
  (event: "getData"): void;
}>();
const dialogImageUrl = ref("");
const dialogVisible = ref(false);

//接收省市区地址选择组件函数
const handleGetAdress = (data: any) => {
  form.value.address = data;
};
const handleGetAdressInfo = (data: any) => {
  console.log(data);
  form.value.addressInfo = data.addressInfo;
};

const handlePictureCardPreview: UploadProps["onPreview"] = uploadFile => {
  dialogImageUrl.value = uploadFile.url!;
  dialogVisible.value = true;
};
const handleUploadSuccess: UploadProps["onSuccess"] = (response, file) => {
  const { success, data } = response;
  if (success) {
    ElMessage.success("上传成功");
    console.log(data);
    form.value.image = data;
    console.log(form.value);
  } else {
    ElMessage.error("上传失败");
  }
};

const form = ref<RuleForm>({
  name: "",
  desc: "",
  content: "",
  phone: "",
  address: "",
  image: ""
  // addressInfo: ""
});

const resetFrom = () => {
  form.value = {
    name: "",
    desc: "",
    image: "",
    content: "",
    phone: "",
    address: ""
    // addressInfo: ""
  };
};

const addressValidator = (rule: any, value: any, callback: any) => {
  if (!value) {
    //没有选择的情况
    return callback(new Error("请选择省/市/区"));
  }
  setTimeout(() => {
    if (!value.isComplete) {
      //没有选择完整
      callback(new Error("请完善地址"));
    } else {
      callback();
    }
  }, 100);
};

const rules = reactive<FormRules<RuleForm>>({
  name: [{ required: true, message: "请输入医院名称", trigger: "blur" }],
  desc: [
    {
      required: true,
      message: "医院简介不能为空",
      trigger: "change"
    }
  ],
  content: [
    {
      required: true,
      message: "医院详情不能为空",
      trigger: "change"
    }
  ],
  phone: [
    {
      required: true,
      message: "医院电话不能为空",
      trigger: "change"
    }
  ],
  // address: [{ required: true, validator: addressValidator, trigger: "change" }],
  address: [{ required: true, message: "医院地址不能为空", trigger: "change" }],
  // addressInfo: [
  //   {
  //     required: true,
  //     message: "医院详细地址不能为空",
  //     trigger: "change"
  //   }
  // ],
  image: [
    {
      required: true,
      message: "需要上传医院图像",
      trigger: "change"
    }
  ]
});
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      // form.value.address =
      //   (form.value.address as { name: string[] }).name.join("") +
      //   form.value.addressInfo;
      // const { addressInfo, ...data } = form.value;
      // console.log(data);
      requestAddHospital(form.value).then((res: any) => {
        const { success, errorMessage } = res;
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
      fileList.value.length = 0;
    } else {
      console.log("error submit!", fields);
    }
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  doctoreAddVisible.value = false;
  resetFrom();
  fileList.value.length = 0;
  formEl.resetFields();
};
</script>
<style lang="scss" scoped></style>
