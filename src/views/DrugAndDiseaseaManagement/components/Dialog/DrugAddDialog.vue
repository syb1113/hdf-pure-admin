<template>
  <div>
    <el-dialog v-model="drugAddDialog" title="药品修改" width="600" center>
      <el-form
        ref="ruleFormRef"
        style="max-width: 600px"
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
        <el-form-item label="价格" prop="price">
          <el-input v-model="ruleForm.price" placeholder="请输入价格" />
        </el-form-item>
        <el-form-item label="库存" prop="amount">
          <el-input v-model="ruleForm.amount" placeholder="库存为整数" />
        </el-form-item>
        <el-form-item label="药物类型" prop="medicineCategoryId">
          <el-select
            v-model="ruleForm.medicineCategoryId"
            placeholder="请输入关键词(名称)"
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
        <el-form-item label="关联疾病" prop="illnesses">
          <el-select
            v-model="ruleForm.illnesses"
            multiple
            filterable
            placeholder="请输入关键词(名称)"
          >
            <el-option
              v-for="item in illnessList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
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
import { reactive, ref, watch, onMounted } from "vue";
import type { ComponentSize, FormInstance, FormRules } from "element-plus";
import type { UploadProps, UploadUserFile } from "element-plus";
import { ElMessage } from "element-plus";
import { Plus } from "@element-plus/icons-vue";
import { requestDrugTypeList, requestAddDrug } from "@/api/drugManage";
import { requestDiseaseList } from "@/api/diseaseManage";

interface RuleForm {
  id?: string;
  name: string;
  desc: string;
  price: number | null;
  amount: number | null;
  image: string;
  medicineCategoryId: string;
  illnesses: string[];
}

const { VITE_BASE_URL } = import.meta.env;
const uploadAction = VITE_BASE_URL + "/common/upload";
const dialogImageUrl = ref("");
const dialogVisible = ref(false);
const fileList = ref([]);
const ruleFormRef = ref<FormInstance>();
const categoryList = ref([]);
const illnessList = ref([]);
const drugAddDialog = defineModel<boolean>();
const ruleForm = ref<RuleForm>({
  name: "",
  desc: "",
  price: null,
  amount: null,
  image: "",
  medicineCategoryId: "",
  illnesses: []
});
watch(
  () => drugAddDialog,
  newVal => {
    if (newVal) {
      getDrugTypeList();
      getDiseaseTypeList();
    }
  },
  { deep: true }
);

const emit = defineEmits<{
  (event: "getData"): void;
}>();
const getDrugTypeList = async () => {
  await requestDrugTypeList().then((res: any) => {
    const { data, success } = res;
    if (success) {
      categoryList.value = data.list;
      console.log("categoryList-->", categoryList.value);
    }
  });
};

const getDiseaseTypeList = async () => {
  await requestDiseaseList().then((res: any) => {
    const { data, success } = res;
    if (success) {
      illnessList.value = data.list;
      console.log("illnessList-->", illnessList.value);
    }
  });
};
const validatePrice = (rule, value, callback) => {
  const num = Number(value);
  if (isNaN(num)) {
    callback(new Error("价格必须是数字"));
  } else if (num < 0) {
    callback(new Error("价格不能小于0"));
  } else {
    callback();
  }
};

const validateAmount = (rule, value, callback) => {
  const num = Number(value);
  if (isNaN(num) || !Number.isInteger(num)) {
    callback(new Error("库存必须是整数"));
  } else if (num < 0) {
    callback(new Error("库存不能小于0"));
  } else {
    callback();
  }
};
const rules = reactive<FormRules<RuleForm>>({
  name: [{ required: true, message: "请输入昵称", trigger: "blur" }],
  price: [
    { required: true, message: "请输入价格", trigger: "blur" },
    { validator: validatePrice, trigger: "blur" }
  ],
  amount: [
    { required: true, message: "请输入库存数量", trigger: "blur" },
    { validator: validateAmount, trigger: "blur" }
  ],
  medicineCategoryId: [
    { required: true, message: "请选择药品类型", trigger: "change" }
  ]
});

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
    ruleForm.value.image = data;
  } else {
    ElMessage.error("上传失败");
  }
};

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log("ruleForm-->", ruleForm.value);
      ruleForm.value.price = Number(ruleForm.value.price);
      ruleForm.value.amount = Number(ruleForm.value.amount);
      requestAddDrug(ruleForm.value).then(res => {
        const { success } = res;
        if (success) {
          message("添加成功", { type: "success" });
          emit("getData");
        }
      });
    } else {
      message("添加失败", { type: "error" });
    }
  });
  formEl.resetFields();
  setTimeout(() => {
    drugAddDialog.value = false;
  }, 500);
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  message("你已取消添加", { type: "info" });
  fileList.value.length = 0;
  drugAddDialog.value = false;
};
</script>
<style lang="scss" scoped></style>
