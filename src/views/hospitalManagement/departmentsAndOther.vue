<template>
  <div class="root">
    <div class="flex">
      <el-card shadow="always" class="flex-1">
        <p v-for="o in 4" :key="o" class="text item">{{ "List item " + o }}</p>
      </el-card>
      <el-card shadow="always" class="flex-1 ml-3">
        <p v-for="o in 4" :key="o" class="text item">{{ "List item " + o }}</p>
      </el-card>
      <el-card shadow="always" class="flex-1 ml-3">
        <p v-for="o in 4" :key="o" class="text item">{{ "List item " + o }}</p>
      </el-card>
    </div>
  </div>
</template>
<script lang="ts" setup></script>
<style lang="scss"></style>
