<template>
  <div>
    <el-dialog
      v-model="hospitalDetailVisible"
      title="医院详情"
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
            :disabled="disabled"
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
            :placeholder="form.desc ? form.desc : ''"
            :disabled="disabled"
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
            :disabled="disabled"
            :addressStr="form.address"
            @get-address="handleGetAdress"
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
            placeholder="请输入详细医院地址"
            :disabled="disabled"
          />
        </el-form-item>
        <!-- <el-form-item
          label="医院地址"
          :label-width="formLabelWidth"
          prop="address"
        >
          <el-input
            v-model="form.address"
            clearable
            placeholder="请输入医院详细地址"
            :disabled="disabled"
          />
        </el-form-item> -->
        <el-form-item
          label="医院电话"
          :label-width="formLabelWidth"
          prop="name"
        >
          <el-input
            v-model="form.phone"
            clearable
            placeholder="请输入医院电话"
            :disabled="disabled"
          />
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
          <Editor ref="editorRef" v-model="form.content" :disabled="disabled" />
        </el-form-item>
        <!-- <el-form-item
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
        </el-form-item> -->
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
import { ref, onMounted, reactive, defineEmits, watch } from "vue";
const { VITE_BASE_URL } = import.meta.env;
import { ElMessage } from "element-plus";
import { Plus } from "@element-plus/icons-vue";
import type { UploadProps, UploadUserFile } from "element-plus";
import type { ComponentSize, FormInstance, FormRules } from "element-plus";
import { requestEditHospital } from "@/api/hospitalManagement";
import areaSelected from "../areaSelected.vue";
import { log } from "console";
import Editor from "@/components/Editor/index.vue";

interface RuleForm {
  readonly id?: string;
  name: string;
  desc: string;
  image: string;
  content: string;
  phone: string;
  address: string;
  addressInfo?: string;
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

const hospitalDetailVisible = defineModel<boolean>();
const formLabelWidth = "140px";
const uploadAction = VITE_BASE_URL + "/common/upload";
const ruleFormRef = ref<FormInstance>();
onMounted(() => {});
const fileList = ref<UploadUserFile[]>([]);
const emit = defineEmits<{
  (event: "getData"): void;
}>();

const props = defineProps<{
  hospitalData: HostipalData;
  disabled: boolean;
}>();
const dialogImageUrl = ref("");
const dialogVisible = ref(false);
const form = ref<RuleForm>({
  ...props.hospitalData
});

//接收省市区地址选择组件函数
const handleGetAdress = (data: any) => {
  form.value.address = data;
};
// 接受详细地址
// const handleGetAdressInfo = (data: any) => {
//   console.log(data);
//   form.value.addressInfo = data.addressInfo;
// };

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

// // 根据传递的地址字符串进行解析
// const parseAddress = (addressStr: string) => {
//   console.log(addressStr);
//   const regex =
//     /(.{2,3}[省|自治区|市])(.{2,3}[市|市辖区])(.{2,3}[区|县|市]?)(.*)/;
//   const match = addressStr.match(regex);

//   if (match) {
//     form.value.addressInfo = match[4] || "";
//   }
// };
watch(
  () => props.hospitalData,
  (newVal: HostipalData) => {
    form.value = { ...newVal };
    // parseAddress(form.value.address);
  },
  { deep: true }
);
const resetFrom = () => {
  form.value = {
    name: "",
    desc: "",
    image: "",
    content: "",
    phone: "",
    address: null,
    addressInfo: ""
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
  address: [{ required: true, message: "医院地址不为空", trigger: "change" }],
  addressInfo: [
    {
      required: true,
      message: "医院详细地址不能为空",
      trigger: "change"
    }
  ],
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
      // if (typeof form.value.address !== "string") {
      //   form.value.address =
      //     (form.value.address as any).name.join("") + form.value.addressInfo;
      // } else {
      // }

      // const { addressInfo, ...data } = form.value;
      console.log(form.value);
      const data = {
        name: form.value.name,
        desc: form.value.desc,
        content: form.value.content,
        phone: form.value.phone,
        address: form.value.address
        // image: form.value.image
      };
      if (!props.disabled) {
        console.log(data);
        requestEditHospital(form.value.id, data).then((res: any) => {
          const { success, errorMessage } = res;
          console.log(res);
          if (success) {
            ElMessage.success("修改成功");
            emit("getData");
            resetForm(formEl);
          } else {
            ElMessage.error(errorMessage);
          }
        });
      }
      setTimeout(() => {
        hospitalDetailVisible.value = false;
      }, 500);
      resetFrom();
      fileList.value.length = 0;
    } else {
      console.log("error submit!", fields);
    }
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  hospitalDetailVisible.value = false;
  resetFrom();
  fileList.value.length = 0;
  formEl.resetFields();
};
</script>
<style lang="scss" scoped></style>
