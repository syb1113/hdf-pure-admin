<template>
  <div style="border: 1px solid #ccc">
    <Toolbar
      style="border-bottom: 1px solid #ccc"
      :editor="editorRef"
      :defaultConfig="toolbarConfig"
      mode="simple"
    />
    <Editor
      ref="editor"
      v-model="valueHtml"
      style="height: 300px; overflow-y: hidden"
      :defaultConfig="editorConfig"
      mode="simple"
      @onCreated="handleCreated"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, shallowRef, onBeforeUnmount, defineExpose, watch } from "vue";
import "@wangeditor/editor/dist/css/style.css";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
const { VITE_BASE_URL } = import.meta.env;
import { getToken } from "@/utils/auth";
type InsertFnType = (url: string) => void;
const { disabled } = defineProps<{
  disabled: boolean;
}>();
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});
const editorRef = shallowRef();
const valueHtml = defineModel<string>();
const toolbarConfig = {};
const editorConfig = { placeholder: "请输入内容...", MENU_CONF: {} };
const handleCreated = editor => {
  editorRef.value = editor; // 记录 editor 实例，重要！
  if (disabled) {
    editorRef.value.disable();
  }
};
const token = getToken();
editorConfig.MENU_CONF["uploadImage"] = {
  server: VITE_BASE_URL + "/common/upload",
  timeout: 5 * 1000, // 5s
  maxFileSize: 10 * 1024 * 1024, // 10M
  base64LimitSize: 5 * 1024,
  //选择文件时的类型限制  不限制
  allowedFileTypes: [],
  fieldName: "file",
  meta: { token: token },
  headers: { Accept: "text/x-json" },

  //返回格式不一致  自定义插入图片
  customInsert(res: any, insertFn: InsertFnType) {
    const url = VITE_BASE_URL + res.data;
    insertFn(url);
  },
  onBeforeUpload(file) {
    console.log("onBeforeUpload", file);
    return file;
  },
  onProgress(progress) {
    console.log("onProgress", progress);
  },
  onSuccess(file, res) {
    console.log("onSuccess", file, res);
  },

  onFailed(file, res) {
    alert(res.message);
    console.log("onFailed", file, res);
  },
  onError(file, err, res) {
    alert(err.message);
    console.error("onError", file, err, res);
  }
};

defineExpose({
  valueHtml
});
</script>

<style lang="scss" scoped></style>
