<!--
 * @Author: yuxuanli
 * @Date: 2023-08-07 09:11:19
 * @LastEditors: yuxuan-ctrl
 * @LastEditTime: 2023-11-16 15:21:34
 * @FilePath: \micro-app-demo\child_apps\vite-vue3\src\App.vue
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
-->
<template>
  <div class="container">
    <button @click="gotoOtherChild">测试跳转</button>
    <div class="header">header</div>
    <div class="monaco-container">
      <!-- <Monaco ref="monacoEdit" v-model="text" :readonly="false" type='sql' class="monaco" /> -->
      <Monaco v-model="text" :notCopy="false" :readonly="false" type="sql" class="monaco" :height="200"></Monaco>
      <div class="h-100"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, ref } from 'vue'
import Monaco from "./components/monaco/_base.vue"
const text = ref<string>('');

const gotoOtherChild = () => {
  console.log(window.microApp);
  if (window.__MICRO_APP_ENVIRONMENT__) {
    window.microApp.router.push({ name: 'appname-vue3', path: '/page2' })
  }
}
</script>

<style>
.header{
  height: 300px;
}
.container {
  width: 1200px;
  min-height: calc(100vh - 60px);
}

.monaco-container {
  height: 300px;

}

.h-100 {
  height: 1000px;
}
</style>
