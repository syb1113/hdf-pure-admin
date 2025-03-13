<template>
  <div>
    <el-dialog v-model="drugDialogVisible" title="药品修改" width="600" center>
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
        <el-form-item label="描述">
          <el-input v-model="ruleForm.desc" type="textarea" maxlength="30" />
        </el-form-item>
        <el-form-item label="价格">
          <el-input v-model="ruleForm.price" />
        </el-form-item>
        <el-form-item label="库存">
          <el-input v-model="ruleForm.amount" placeholder="库存为整数" />
        </el-form-item>
        <el-form-item label="药物类型">
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
        <el-form-item label="关联疾病">
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
              :value="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="图像">
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
import {
  requestOneDrug,
  requestDrugTypeList,
  requestEditDrug
} from "@/api/drugManage";
import { requestDiseaseList } from "@/api/diseaseManage";

interface RuleForm {
  id?: string;
  name: string;
  desc: string;
  price: number;
  amount: number;
  image: string;
  medicineCategoryId: string;
  illnesses:
    | string[]
    | [
        {
          illness: {
            nmae: string;
          };
        }
      ];
}

const { VITE_BASE_URL } = import.meta.env;
const uploadAction = VITE_BASE_URL + "/common/upload";
const dialogImageUrl = ref("");
const dialogVisible = ref(false);
const fileList = ref([]);
const ruleFormRef = ref<FormInstance>();
const { id } = defineProps<{
  id: string;
}>();
const categoryName = ref();
const medicineCategoryId = ref();
const categoryList = ref([]);
const illnessList = ref([]);
const drugDialogVisible = defineModel<boolean>();
const ruleForm = ref<RuleForm>({
  name: "",
  desc: "",
  price: 0,
  amount: 0,
  image: "",
  medicineCategoryId: "",
  illnesses: [""]
});
watch(
  () => id,
  async (newVal: string) => {
    await getDrugDetails(newVal);
    getDrugTypeList();
    getDiseaseTypeList();
  },
  { deep: true }
);
const getDrugTypeList = async () => {
  await requestDrugTypeList().then((res: any) => {
    const { data, success } = res;
    if (success) {
      categoryList.value = data.list;
      console.log("categoryList-->", categoryList.value);
    } else {
      message("获取失败", { type: "error" });
    }
  });
};

const getDiseaseTypeList = async () => {
  await requestDiseaseList().then((res: any) => {
    const { data, success } = res;
    if (success) {
      illnessList.value = data.list;
      console.log("illnessList-->", illnessList.value);
    } else {
      message("获取失败", { type: "error" });
    }
  });
};

const rules = reactive<FormRules<RuleForm>>({
  name: [{ required: true, message: "请输入昵称", trigger: "blur" }]
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
    console.log(data);
    console.log(fileList.value);
    ruleForm.value.image = data;
  } else {
    ElMessage.error("上传失败");
  }
};
const getDrugDetails = async (id: string) => {
  await requestOneDrug(id).then((res: any) => {
    const { data, success } = res;
    if (success) {
      ruleForm.value.name = data.name;
      ruleForm.value.desc = data.desc;
      ruleForm.value.price = data.price;
      ruleForm.value.amount = data.amount;
      ruleForm.value.image = data.image;
      ruleForm.value.medicineCategoryId = data.category.name;
      medicineCategoryId.value = data.medicineCategoryId;
      categoryName.value = data.category.name;
      ruleForm.value.illnesses = data.illnessMedicine.map(
        item => item.illness.name
      );
      console.log("ruleForm-->", ruleForm.value);
      fileList.value.length = 0;
      if (ruleForm.value.image != "") {
        fileList.value.push(ruleForm.value.image);
      }
    } else {
      message("获取失败", { type: "error" });
    }
  });
};
const upDrugDetails = () => {
  requestEditDrug(id, ruleForm.value).then((res: any) => {
    message("修改成功", { type: "success" });
  });
};
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      const illnesses = ruleForm.value.illnesses
        .map(name => {
          const illness = illnessList.value.find(item => item.name === name);
          return illness ? illness.id : "";
        })
        .filter(id => id !== "");
      if (ruleForm.value.medicineCategoryId !== categoryName.value) {
        ruleForm.value.medicineCategoryId = categoryList.value.find(
          item => item.id == ruleForm.value.medicineCategoryId
        ).id;
      } else {
        ruleForm.value.medicineCategoryId = medicineCategoryId.value;
      }
      ruleForm.value.illnesses = illnesses;
      ruleForm.value.price = Number(ruleForm.value.price);
      ruleForm.value.amount = parseInt(ruleForm.value.amount);
      console.log("ruleForm-->", ruleForm.value);
      upDrugDetails();
    } else {
      message("修改失败", { type: "error" });
    }
  });
  drugDialogVisible.value = false;
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  message("你已取消修改", { type: "info" });
  fileList.value.length = 0;
  drugDialogVisible.value = false;
};
</script>
<style lang="scss" scoped></style>
