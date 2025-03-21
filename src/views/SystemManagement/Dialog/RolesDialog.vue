<template>
  <div>
    <el-dialog
      v-model="RolesDialogVisible"
      :title="add ? '新增角色' : '角色修改'"
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
        <el-form-item label="权限" prop="permissions">
          <el-checkbox-group v-model="checkList"
            ><el-checkbox
              v-for="item in permissionsList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
          /></el-checkbox-group>
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
import { Plus } from "@element-plus/icons-vue";
import { requestPermissionsList } from "@/api/permissions";
import { requestRoleModify, requestRoleAdd } from "@/api/role";

interface RuleForm {
  id?: string;
  name: string;
  desc: string;
  permissions?: string;
  permissionOnRoles?: PermissinoOnRples[];
}

interface PermissinoOnRples {
  id: string;
  roleId: string;
  permissionId: string;
}
interface RequestData {
  name: string;
  desc: string;
  permissions: string;
}
const ruleFormRef = ref<FormInstance>();
const checkList = ref([]);
const { rolesDetails, add } = defineProps<{
  rolesDetails: RuleForm;
  add: boolean;
}>();
const ruleForm = ref<RuleForm>({
  ...rolesDetails
});
const rules = reactive<FormRules<RuleForm>>({
  name: [{ required: true, message: "请输入昵称", trigger: "blur" }],
  permissions: [{ required: true, message: "请选择权限", trigger: "blur" }]
});

const permissionsList = ref<RuleForm[]>([]);

const getPermissionsList = async () => {
  await requestPermissionsList().then((res: any) => {
    const { data, success } = res;
    if (success) {
      permissionsList.value = data.list;
    }
  });
};

const handleUpRolesDetails = async (id: string, data: RequestData) => {
  await requestRoleModify(data, id).then((res: any) => {
    const { success } = res;
    if (success) {
      message("修改成功", { type: "success" });
    } else {
      message("修改失败", { type: "error" });
    }
  });
};

const handleAdd = async (data: RequestData) => {
  await requestRoleAdd(data).then(res => {
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
  ruleForm.value.permissions = checkList.value.join(",");
  const data = {
    name: ruleForm.value.name,
    desc: ruleForm.value.desc,
    permissions: ruleForm.value.permissions
  };
  await formEl.validate((valid, fields) => {
    if (valid) {
      if (!add) {
        handleUpRolesDetails(ruleForm.value.id, data);
      } else {
        handleAdd(data);
      }
    } else {
      message(`${add ? "添加" : "修改"}失败`, { type: "error" });
    }
    formEl.resetFields();
    checkList.value = [];
    setTimeout(() => {
      RolesDialogVisible.value = false;
    }, 500);
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  message(`你已取消${add ? "添加" : "修改"}`, { type: "info" });
  checkList.value = [];
  RolesDialogVisible.value = false;
};

const RolesDialogVisible = defineModel<boolean>();
watch(
  () => RolesDialogVisible.value,
  newVal => {
    if (newVal) {
      getPermissionsList();
    }
  }
);

watch(
  () => rolesDetails,
  (newVal: RuleForm) => {
    ruleForm.value = { ...newVal };
    if (!add) {
      checkList.value = newVal.permissionOnRoles.map(item => item.permissionId);
    }
  },
  { deep: true }
);
</script>
<style lang="scss" scoped></style>
