<script setup lang="ts">
import { ref } from "vue";
import Vcode from "vue3-puzzle-vcode";

const isShow = ref(true);
const verifyShow = defineModel<Boolean>();

function onSuccess() {
  console.log("验证成功");
}

function onFail() {
  console.log("验证失败");
}
</script>

<template>
  <div class="bg-[rgba(123,159,245,0.2)] p-6 w-[360px]">
    <Vcode
      :show="verifyShow"
      type="inside"
      @fail="onFail"
      @success="onSuccess"
    />
  </div>
</template>
