<template>
  <div>
    <el-dialog
      v-model="TypeDialogVisible"
      :title="add ? '新增分类' : '分类修改'"
      width="600"
      center
    >
      <el-form
        ref="ruleFormRef"
        style="max-width: 400px"
        :model="ruleForm"
        :rules="rules"
        label-width="auto"
        class="demo-ruleForm"
        status-icon
      >
        <el-form-item label="昵称" prop="name">
          <el-input v-model="ruleForm.name" />
        </el-form-item>
        <el-form-item label="描述" prop="desc">
          <el-input v-model="ruleForm.desc" type="textarea" maxlength="30" />
        </el-form-item>
        <el-form-item label="图像" prop="image">
          <el-upload
            v-model:file-list="fileList"
            :action="uploadAction"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-success="handleUploadSuccess"
            :on-exceed="onExceed"
            :limit="1"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>

          <el-dialog v-model="dialogVisible">
            <img :src="dialogImageUrl" alt="Preview Image" />
          </el-dialog>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="resetForm(ruleFormRef)">取消</el-button>
        <el-button type="primary" @click="submitForm(ruleFormRef)">
          确认
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { message } from "@/utils/message";
import { reactive, ref, watch, inject } from "vue";
import type { ComponentSize, FormInstance, FormRules } from "element-plus";
import type { UploadProps, UploadUserFile } from "element-plus";
import { ElMessage } from "element-plus";
import { Plus } from "@element-plus/icons-vue";
import {
  requestUpArticleType,
  requestAddArticleType
} from "@/api/articleManage";

interface RuleForm {
  id?: string;
  name: string;
  desc: string;
  image?: string;
}

watch(
  () => typeDetails,
  (newVal: RuleForm) => {
    ruleForm.value = { ...newVal };
    if (newVal.image !== "") {
      fileList.value = [{ name: "image", url: VITE_BASE_URL + newVal.image }];
    } else {
      fileList.value = [];
    }
  },
  { deep: true }
);
const { VITE_BASE_URL } = import.meta.env;
const uploadAction = VITE_BASE_URL + "/common/upload";
const dialogImageUrl = ref("");
const dialogVisible = ref(false);
const fileList = ref<UploadUserFile[]>([]);
const handlePictureCardPreview: UploadProps["onPreview"] = uploadFile => {
  dialogImageUrl.value = uploadFile.url!;
  dialogVisible.value = true;
};
const onExceed = () => {
  ElMessage.error("最多上传一张图片");
  return;
};
const emit = defineEmits<{
  (event: "getData"): void;
}>();
const handleUploadSuccess: UploadProps["onSuccess"] = (response, file) => {
  const { success, data } = response;
  if (success) {
    ElMessage.success("上传成功");
    ruleForm.value.image = data;
  } else {
    ElMessage.error("上传失败");
  }
};

const ruleFormRef = ref<FormInstance>();

const { typeDetails, add } = defineProps<{
  typeDetails: RuleForm;
  add: boolean;
}>();
const ruleForm = ref<RuleForm>({
  ...typeDetails
});
const rules = reactive<FormRules<RuleForm>>({
  name: [{ required: true, message: "请输入昵称", trigger: "blur" }]
});

const handleUpDocDetails = async (id: string) => {
  await requestUpArticleType(ruleForm.value, id).then((res: any) => {
    const { success } = res;
    if (success) {
      message("修改成功", { type: "success" });
    } else {
      message("修改失败", { type: "error" });
    }
  });
};

const handleAdd = async () => {
  await requestAddArticleType(ruleForm.value).then(res => {
    const { success } = res;
    if (success) {
      message("添加成功", { type: "success" });
    } else {
      message("添加失败", { type: "error" });
    }
  });
};

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      if (!add) {
        handleUpDocDetails(typeDetails.id);
      } else {
        handleAdd();
      }
    } else {
      message(`${add ? "添加" : "修改"}失败`, { type: "error" });
    }
    formEl.resetFields();
    emit("getData");
    setTimeout(() => {
      TypeDialogVisible.value = false;
    }, 500);
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  message(`你已取消${add ? "添加" : "修改"}`, { type: "info" });
  fileList.value.length = 0;
  TypeDialogVisible.value = false;
};

const TypeDialogVisible = defineModel<boolean>();
</script>
<style lang="scss" scoped></style>
