<template>
  <div>
    <el-dialog v-model="detailVisible" title="医生详情" width="800">
      <el-form ref="ruleFormRef" style="max-width: 800px">
        <el-form-item
          label="医生名称"
          :label-width="formLabelWidth"
          prop="name"
        >
          <el-input
            v-model="form.name"
            clearable
            placeholder="请输入医生名称"
            :disabled="disabled"
          />
        </el-form-item>
        <el-form-item
          label="医生职称"
          :label-width="formLabelWidth"
          prop="doctorTitleId"
        >
          <el-select
            v-model="form.doctorTitleId"
            placeholder="请选择医生职称"
            filterable
            clearable
            :disabled="disabled"
          >
            <el-option
              v-for="i in DoctorTitleIdList"
              :key="i.id"
              :label="i.name"
              :value="i.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="所属科室"
          :label-width="formLabelWidth"
          prop="departmentId"
        >
          <el-select
            v-model="form.departmentId"
            placeholder="请选择科室"
            filterable
            clearable
            :disabled="disabled"
          >
            <el-option
              v-for="i in DepartmentIdList"
              :key="i.id"
              :label="i.name"
              :value="i.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="所属医院"
          :label-width="formLabelWidth"
          prop="hospitalId"
        >
          <el-select
            v-model="form.hospitalId"
            placeholder="请选择医院"
            filterable
            clearable
            :disabled="disabled"
          >
            <el-option
              v-for="i in HospitalIdList"
              :key="i.id"
              :label="i.name"
              :value="i.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="医生简介"
          :label-width="formLabelWidth"
          prop="desc"
        >
          <el-input
            v-model="form.desc"
            clearable
            placeholder="请输入医生简介"
            :disabled="disabled"
          />
        </el-form-item>
        <el-form-item
          label="医生特长"
          :label-width="formLabelWidth"
          prop="tags"
        >
          <el-select
            v-model="form.tags"
            placeholder="医生标签"
            multiple
            filterable
            clearable
            collapse-tags
            collapse-tags-tooltip
            :max-collapse-tags="3"
            :disabled="disabled"
          >
            <el-option
              v-for="i in docTagsList"
              :key="i.id"
              :label="i.name"
              :value="i.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="医生详情介绍"
          :label-width="formLabelWidth"
          prop="content"
        >
          <Editor ref="editorRef" v-model="form.content" :disabled="disabled" />
          <!-- <el-input
            v-model="form.content"
            clearable
            placeholder="请输入医生详情介绍"
            :disabled="disabled"
          /> -->
        </el-form-item>
      </el-form>
      <template #footer>
        <div v-if="!disabled" class="dialog-footer">
          <el-button @click="detailVisible = false">取消</el-button>
          <el-button type="primary" @click="updataDoctor"> 确认 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, onBeforeUnmount } from "vue";
// import { delObjectProperty } from "@pureadmin/utils";
import {
  requestDoctorTitleIdList,
  requestDepartmentIdList,
  requestHospitalIdList,
  requestDoctorModify
} from "@/api/doctorManagement";
import { requsestDoctorTags } from "@/api/hospitalManagement";
import Editor from "@/components/Editor/index.vue";

interface RuleForm {
  id: string;
  name: string;
  desc: string;
  tags: string | string[];
  content: string;
  doctorTitleId: string; //职称id
  departmentId: string; //科室id
  hospitalId: string; //医院id
  avatar: string;
}

const formLabelWidth = "140px";
const detailVisible = defineModel<boolean>();
const { doctorDetails, disabled } = defineProps<{
  doctorDetails: RuleForm;
  disabled: boolean;
}>();
const form = ref<RuleForm>({
  ...doctorDetails
});
const emit = defineEmits<{
  (event: "getData"): void;
}>();
const DoctorTitleIdList = ref([]);
const DepartmentIdList = ref([]);
const HospitalIdList = ref([]);
const docTagsList = ref([]);
const editorRef = ref(null);

watch(
  () => doctorDetails,
  newVal => {
    const tags = (doctorDetails.tags as string).split(",");
    form.value = { ...newVal, tags: tags };
  },
  { deep: true }
);

onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});
onMounted(() => {
  getDoctorTitleIdList();
  getDepartmentIdList();
  getHospitalIdList();
  getDocTagsList();
});
const updataDoctor = async () => {
  console.log("form", form.value);
  form.value.tags = (form.value.tags as string[]).join();
  const data = {};
  for (const key in form.value) {
    if (key === "id" || key === "createdAt" || key === "updatedAt") {
      continue;
    }
    data[key] = form.value[key];
  }
  await requestDoctorModify(form.value.id, data).then((res: any) => {
    const { success } = res;
    if (success) {
      detailVisible.value = false;
    }
  });
  emit("getData");
};

const getDocTagsList = () => {
  requsestDoctorTags().then((res: any) => {
    const { data, success } = res;
    if (success) {
      docTagsList.value = data.list;
      console.log(docTagsList.value);
    }
  });
};

const getDoctorTitleIdList = () => {
  requestDoctorTitleIdList().then((res: any) => {
    const { data, success } = res;
    if (success) {
      DoctorTitleIdList.value = data.list;
    }
  });
};
//科室列表
const getDepartmentIdList = () => {
  requestDepartmentIdList().then((res: any) => {
    const { data, success } = res;
    if (success) {
      DepartmentIdList.value = data;
    }
  });
};

const getHospitalIdList = () => {
  requestHospitalIdList().then((res: any) => {
    const { data, success } = res;
    if (success) {
      HospitalIdList.value = data.list;
    }
  });
};
</script>

<style lang="scss" scoped></style>
