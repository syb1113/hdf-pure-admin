<template>
  <div class="root w-full bg-white mb-3 rounded-md p-5">
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      status-icon
      label-width="auto"
      :inline="true"
    >
      <el-form-item label="关键词" prop="search">
        <el-select
          v-model="ruleForm.search"
          placeholder="请输入关键词(名称)"
          style="width: 300px"
          filterable
        >
          <el-option
            v-for="item in optionsLit"
            :key="item.id"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
        <!-- <el-input
          v-model="ruleForm.search"
          autocomplete="off"
          style="width: 300px"
          placeholder="请输入关键词(名称)"
        /> -->
      </el-form-item>
      <el-form-item v-if="categoryList !== null" label="类型" prop="category">
        <el-select
          v-model="ruleForm.category"
          placeholder="请选择分类"
          style="width: 300px"
          filterable
        >
          <el-option
            v-for="item in categoryList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          :icon="Search"
          type="primary"
          @click="submitForm(ruleFormRef)"
        >
          搜索
        </el-button>
        <el-button :icon="RefreshLeft" @click="resetForm(ruleFormRef)"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>
<script setup lang="ts">
import { Search, RefreshLeft } from "@element-plus/icons-vue";
import { reactive, ref, watch } from "vue";
import type { FormInstance, FormRules } from "element-plus";

interface OptionsData {
  id: string;
  name: string;
}
interface definePropsData {
  optionsLit: OptionsData[];
  categoryList?: OptionsData[];
}

const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive({
  search: "",
  category: ""
});
const emit = defineEmits<{
  (event: "search", value: string | any, category?: string): void;
}>();
const { optionsLit, categoryList = null } = defineProps<definePropsData>();
// const validatePass = (rule: any, value: any, callback: any) => {
//   if (value === "") {
//     callback(new Error("请输入关键词(名称)"));
//   } else {
//     if (ruleForm.search !== "") {
//       if (!ruleFormRef.value) return;
//       ruleFormRef.value.validateField("checkPass");
//     }
//     callback();
//   }
// };

// const rules = reactive<FormRules<typeof ruleForm>>({
//   search: [{ validator: validatePass, trigger: "blur" }]
// });

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(valid => {
    if (valid) {
      console.log("submit!");
      console.log(ruleForm.search);
      if (categoryList) {
        emit("search", ruleForm.search, ruleForm.category);
      } else {
        emit("search", ruleForm.search);
      }
    } else {
      console.log("error submit!");
    }
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  emit("search", ruleForm.search);
};
</script>
<style lang="scss" scoped>
.el-form-item {
  margin-bottom: 0;
}
</style>
