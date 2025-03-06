<template>
  <div>
    <el-dialog
      v-model="doctorOtherDialogVisible"
      :title="title"
      width="500"
      :before-close="handleClose"
      center
    >
      <span>This is a message</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="doctorOtherDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="doctorOtherDialogVisible = false">
            确认
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { ElMessageBox } from "element-plus";

const doctorOtherDialogVisible = defineModel<boolean>();
const { title } = defineProps<{
  title: string;
}>();

const handleClose = (done: () => void) => {
  ElMessageBox.confirm("Are you sure to close this dialog?")
    .then(() => {
      done();
    })
    .catch(() => {
      // catch error
    });
};
</script>
<style lang="scss" scoped></style>
