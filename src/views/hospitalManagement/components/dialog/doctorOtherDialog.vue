<template>
  <div>
    <el-dialog
      v-model="doctorOtherDialogVisible"
      :title="add ? '新增' + title : title"
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
  requestOneDocTitleUp,
  requestOneDocDepartmentsUp,
  requestOneDocTagsUp,
  requestAddDoctortitles,
  requestAddDocTags,
  requestAddDocDepartments
} from "@/api/hospitalManagement";

interface RuleForm {
  id: string;
  name: string;
  desc: string;
  image?: string;
}

watch(
  () => docDetails,
  (newVal: RuleForm) => {
    ruleForm.value = { ...newVal };
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

const handleUploadSuccess: UploadProps["onSuccess"] = (response, file) => {
  const { success, data } = response;
  if (success) {
    ElMessage.success("上传成功");
    console.log(data);
    console.log(fileList.value);
    ruleForm.value.image = data;
  } else {
    ElMessage.error("上传失败");
  }
};

const ruleFormRef = ref<FormInstance>();

const { docDetails, title, add } = defineProps<{
  docDetails: RuleForm;
  title: string;
  add: boolean;
}>();
const ruleForm = ref<RuleForm>({
  ...docDetails
});
const rules = reactive<FormRules<RuleForm>>({
  name: [{ required: true, message: "请输入昵称", trigger: "blur" }]
});

const handleUpDocDetails = async (id: string) => {
  switch (title) {
    case "医生标签":
      await upDocTags(id);
      break;
    case "医院科室":
      await upDocDepartments(id);
      break;
    case "医生职称":
      await upDocTitle(id);
      break;
  }
};

const handleAdd = async () => {
  switch (title) {
    case "医生标签":
      await addDocTags();
      break;
    case "医院科室":
      await addDocDepartments();
      break;
    case "医生职称":
      await addDocTitle();
      break;
  }
};

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      if (!add) {
        handleUpDocDetails(docDetails.id);
      } else {
        handleAdd();
      }
      message(`${add ? "添加" : "修改"}成功`, { type: "success" });
    } else {
      message(`${add ? "添加" : "修改"}失败`, { type: "error" });
    }
    formEl.resetFields();
    setTimeout(() => {
      doctorOtherDialogVisible.value = false;
    }, 500);
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  message(`你已取消${add ? "添加" : "修改"}`, { type: "info" });
  fileList.value.length = 0;
  doctorOtherDialogVisible.value = false;
};

const addDocTitle = async () => {
  await requestAddDoctortitles({ ...ruleForm.value }).then((res: any) => {
    console.log(res);
    const { success } = res;
    if (success) {
      // message("修改成功", { type: "success" });
    } else {
      message("添加失败", { type: "error" });
    }
  });
};

const addDocDepartments = async () => {
  await requestAddDocDepartments({ ...ruleForm.value }).then((res: any) => {
    const { success } = res;
    if (success) {
      // message("修改成功", { type: "success" });
    } else {
      message("添加失败", { type: "error" });
    }
  });
};

const addDocTags = async () => {
  await requestAddDocTags({ ...ruleForm.value }).then((res: any) => {
    const { success } = res;
    if (success) {
      // message("修改成功", { type: "success" });
    } else {
      message("添加失败", { type: "error" });
    }
  });
};

const upDocTitle = async (id: string) => {
  await requestOneDocTitleUp({ ...ruleForm.value }, id).then((res: any) => {
    const { success } = res;
    if (success) {
      // message("修改成功", { type: "success" });
    } else {
      message("修改失败", { type: "error" });
    }
  });
};

const upDocDepartments = async (id: string) => {
  await requestOneDocDepartmentsUp({ ...ruleForm.value }, id).then(
    (res: any) => {
      const { success } = res;
      if (success) {
        // message("修改成功", { type: "success" });
      } else {
        message("修改失败", { type: "error" });
      }
    }
  );
};

const upDocTags = async (id: string) => {
  await requestOneDocTagsUp({ ...ruleForm.value }, id).then((res: any) => {
    const { success } = res;
    if (success) {
      // message("修改成功", { type: "success" });
    } else {
      message("修改失败", { type: "error" });
    }
  });
};

const doctorOtherDialogVisible = defineModel<boolean>();
</script>
<style lang="scss" scoped></style>
