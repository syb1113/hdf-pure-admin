<template>
  <div>
    <el-dialog
      v-model="PermissionDialogVisible"
      :title="add ? '新增权限' : '角色权限'"
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
        <el-form-item label="权限信息" prop="name">
          <el-input v-model="ruleForm.name" placeholder="请输入权限信息" />
        </el-form-item>
        <el-form-item label="描述" prop="desc">
          <el-input
            v-model="ruleForm.desc"
            type="textarea"
            maxlength="30"
            placeholder="描述"
          />
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
import { reactive, ref, watch } from "vue";
import type { ComponentSize, FormInstance, FormRules } from "element-plus";
import { ElMessage } from "element-plus";
import {
  requestPermissionsAdd,
  requestPermissionsModify
} from "@/api/permissions";

interface RuleForm {
  id?: string;
  name: string;
  desc: string;
}

interface RequestData {
  name: string;
  desc: string;
}
const ruleFormRef = ref<FormInstance>();
const { rolesDetails, add } = defineProps<{
  rolesDetails: RuleForm;
  add: boolean;
}>();
const ruleForm = ref<RuleForm>({
  ...rolesDetails
});
const rules = reactive<FormRules<RuleForm>>({
  name: [{ required: true, message: "请输入昵称", trigger: "blur" }]
});

const handleUpPermissionsDetails = async (id: string, data: RequestData) => {
  await requestPermissionsModify(id, data).then((res: any) => {
    const { success } = res;
    if (success) {
      message("修改成功", { type: "success" });
    } else {
      message("修改失败", { type: "error" });
    }
  });
};

const handleAdd = async (data: RequestData) => {
  await requestPermissionsAdd(data).then(res => {
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
  const data = {
    name: ruleForm.value.name,
    desc: ruleForm.value.desc
  };
  await formEl.validate((valid, fields) => {
    if (valid) {
      if (!add) {
        handleUpPermissionsDetails(ruleForm.value.id, data);
      } else {
        handleAdd(data);
      }
    } else {
      message(`${add ? "添加" : "修改"}失败`, { type: "error" });
    }
    formEl.resetFields();
    setTimeout(() => {
      PermissionDialogVisible.value = false;
    }, 500);
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  message(`你已取消${add ? "添加" : "修改"}`, { type: "info" });
  PermissionDialogVisible.value = false;
};

const PermissionDialogVisible = defineModel<boolean>();

watch(
  () => rolesDetails,
  (newVal: RuleForm) => {
    ruleForm.value = { ...newVal };
  },
  { deep: true }
);
</script>
<style lang="scss" scoped></style>
