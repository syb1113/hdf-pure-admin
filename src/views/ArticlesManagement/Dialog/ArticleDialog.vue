<template>
  <div>
    <el-dialog
      v-model="articleDialog"
      :title="!articleId ? '文章添加' : '文章修改'"
      width="800"
      center
    >
      <el-form
        ref="ruleFormRef"
        style="max-width: 800px"
        :model="ruleForm"
        :rules="rules"
        label-width="auto"
        class="demo-ruleForm"
        status-icon
      >
        <el-form-item label="文章昵称" prop="name">
          <el-input
            v-model="ruleForm.name"
            :disabled="disabled"
            placeholder="请输入昵称"
          />
        </el-form-item>
        <el-form-item label="文章描述" prop="desc">
          <el-input
            v-model="ruleForm.desc"
            type="textarea"
            maxlength="30"
            :disabled="disabled"
            placeholder="请描述该疾病"
          />
        </el-form-item>
        <el-form-item label="文章浏览量" prop="views">
          <el-input
            v-model="ruleForm.views"
            :disabled="disabled"
            placeholder="请输入文章浏览量"
          />
        </el-form-item>
        <el-form-item label="文章类型" prop="articleCategoryId">
          <el-select
            v-model="ruleForm.articleCategoryId"
            placeholder="请选择文章类型"
            filterable
            :disabled="disabled"
          >
            <el-option
              v-for="item in categoryList"
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
            :disabled="disabled"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>

          <el-dialog v-model="dialogVisible">
            <img :src="dialogImageUrl" alt="Preview Image" />
          </el-dialog>
        </el-form-item>
        <el-form-item label="文章详情" prop="content">
          <Editor
            ref="editorRef"
            v-model="ruleForm.content"
            :disabled="disabled"
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
import { reactive, ref, watch, onMounted } from "vue";
import type { ComponentSize, FormInstance, FormRules } from "element-plus";
import type { UploadProps, UploadUserFile } from "element-plus";
import { ElMessage } from "element-plus";
import { Plus } from "@element-plus/icons-vue";
import {
  requestArticlesTypeList,
  requestAddArticle,
  requestArticlesDetails,
  requestUpArticle
} from "@/api/articleManage";
import Editor from "@/components/Editor/index.vue";
interface RuleForm {
  id?: string;
  name: string;
  desc: string;
  views: string;
  image: string;
  articleCategoryId: string;
  content: string;
}

const { VITE_BASE_URL } = import.meta.env;
const uploadAction = VITE_BASE_URL + "/common/upload";
const dialogImageUrl = ref("");
const dialogVisible = ref(false);
const fileList = ref([]);
const ruleFormRef = ref<FormInstance>();
const categoryList = ref([]);
const articleDialog = defineModel<boolean>();
const ruleForm = ref<RuleForm>({
  name: "",
  desc: "",
  views: "",
  image: "",
  articleCategoryId: "",
  content: ""
});
watch(
  () => articleDialog,
  newVal => {
    if (newVal) {
      getArticlesTypeList();
      getOneArticles(articleId);
    }
  },
  { deep: true }
);
watch(
  () => ruleForm.value,
  newVal => {
    if (newVal.image) {
      fileList.value = [{ name: "image", url: VITE_BASE_URL + newVal.image }];
    } else {
      fileList.value = [];
    }
  }
);
interface definePropsData {
  disabled?: boolean;
  articleId?: string;
}
const { disabled = false, articleId } = defineProps<definePropsData>();

const emit = defineEmits<{
  (event: "getData"): void;
}>();
const getArticlesTypeList = async () => {
  await requestArticlesTypeList().then((res: any) => {
    const { data, success } = res;
    if (success) {
      categoryList.value = data.list;
    }
  });
};

const getOneArticles = async (id: string) => {
  await requestArticlesDetails(id).then((res: any) => {
    const { data, success } = res;
    if (success) {
      ruleForm.value = data;
    }
  });
};

const rules = reactive<FormRules<RuleForm>>({
  name: [{ required: true, message: "请输入昵称", trigger: "blur" }],
  articleCategoryId: [
    { required: true, message: "请选择文章类型", trigger: "change" }
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
      const data = {
        name: ruleForm.value.name,
        desc: ruleForm.value.desc,
        image: ruleForm.value.image,
        views: ruleForm.value.views,
        content: ruleForm.value.content,
        articleCategoryId: ruleForm.value.articleCategoryId
      };
      if (!articleId) {
        requestAddArticle(data).then(res => {
          const { success } = res;
          if (success) {
            message("添加成功", { type: "success" });
          }
        });
      } else {
        requestUpArticle(data, articleId).then(res => {
          const { success } = res;
          if (success) {
            message("修改成功", { type: "success" });
          }
        });
      }
    } else {
      message(!articleId ? "添加失败" : "修改失败", { type: "error" });
    }
  });
  formEl.resetFields();
  await emit("getData");
  setTimeout(() => {
    articleDialog.value = false;
  }, 500);
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  message(!articleId ? "你已取消添加" : "你已取消修改", { type: "info" });
  fileList.value.length = 0;
  articleDialog.value = false;
};
</script>
<style lang="scss" scoped></style>
