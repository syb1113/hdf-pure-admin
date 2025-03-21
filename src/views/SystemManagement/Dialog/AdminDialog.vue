<template>
  <div>
    <el-dialog
      v-model="AdminDialogVisible"
      :title="add ? '新增角色' : '角色修改'"
      width="600"
      center
    >
      <el-text class="mx-1" type="danger"
        >*普通用户用户名必须以 user 开头，普通管理员用户名必须以 common
        开头，超级管理员用户名必须以 admin 开头</el-text
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
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="ruleForm.userName" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="ruleForm.password"
            type="password"
            placeholder="请输入密码（至少6位）"
          />
        </el-form-item>
        <el-form-item label="角色" prop="roleId">
          <el-select
            v-model="ruleForm.roleId"
            clearable
            placeholder="选择角色"
            @change="handleRoleChange"
          >
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="昵称" prop="nickName">
          <el-input v-model="ruleForm.nickName" placeholder="请输入昵称" />
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
import { requestRoleList } from "@/api/role";
import { requestAdminModify, requestAdminAdd } from "@/api/admin";
interface RuleForm {
  id?: string;
  userName: string;
  password: string;
  roleId: string;
  nickName: string;
  role: Role;
}

interface Role {
  id: string;
  name: string;
  desc: string;
}
interface RequestData {
  userName: string;
  password: string;
  nickName: string;
  roleId: string;
}
const ruleFormRef = ref<FormInstance>();
const { adminDetails, add } = defineProps<{
  adminDetails: RuleForm;
  add: boolean;
}>();
const ruleForm = ref<RuleForm>({
  ...adminDetails
});
const roleList = ref([]);
const rules = reactive<FormRules<RuleForm>>({
  userName: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    {
      validator: (_, value, callback) => {
        const roleId = ruleForm.value.roleId;

        if (!roleId || !value) return callback();

        const selectedRole = roleList.value.find(role => role.id === roleId);
        if (!selectedRole) {
          return callback(new Error("未找到对应角色"));
        }

        const prefix = roleNamePrefixMap[selectedRole.name];
        if (prefix && !value.startsWith(prefix)) {
          callback(new Error(`当前角色用户名必须以 ${prefix} 开头`));
        } else {
          callback();
        }
      },
      trigger: ["blur", "change"]
    }
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, message: "密码长度不能少于6位", trigger: "blur" }
  ],
  roleId: [{ required: true, message: "请选择权限", trigger: "blur" }]
});
const roleNamePrefixMap = {
  普通用户: "user",
  普通管理员: "common",
  超级管理员: "admin"
};

const handleRoleChange = () => {
  ruleFormRef.value?.validateField("userName");
};

const getroleList = async () => {
  await requestRoleList().then((res: any) => {
    const { data, success } = res;
    if (success) {
      roleList.value = data.list;
    }
  });
};

const handleUpAdminDetails = async (data: RequestData, id: string) => {
  await requestAdminModify(id, data).then((res: any) => {
    const { success } = res;
    if (success) {
      message("修改成功", { type: "success" });
    } else {
      message("修改失败", { type: "error" });
    }
  });
};

const handleAdd = async (data: RequestData) => {
  await requestAdminAdd(data).then(res => {
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
    userName: ruleForm.value.userName,
    password: ruleForm.value.password,
    nickName: ruleForm.value.nickName,
    roleId: ruleForm.value.roleId
  };
  await formEl.validate((valid, fields) => {
    if (valid) {
      if (!add) {
        handleUpAdminDetails(data, ruleForm.value.id);
      } else {
        handleAdd(data);
      }
    } else {
      message(`${add ? "添加" : "修改"}失败`, { type: "error" });
    }
    formEl.resetFields();
    roleList.value = [];
    setTimeout(() => {
      AdminDialogVisible.value = false;
    }, 500);
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  message(`你已取消${add ? "添加" : "修改"}`, { type: "info" });
  AdminDialogVisible.value = false;
  roleList.value = [];
};

const AdminDialogVisible = defineModel<boolean>();
watch(
  () => AdminDialogVisible.value,
  newVal => {
    if (newVal) {
      getroleList();
    }
  }
);

watch(
  () => adminDetails,
  (newVal: RuleForm) => {
    ruleForm.value = { ...newVal };
  },
  { deep: true }
);
</script>
<style lang="scss" scoped></style>
