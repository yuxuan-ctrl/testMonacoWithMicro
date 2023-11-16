<!--
 * @Author: yuxuanli
 * @Date: 2023-08-07 09:11:19
 * @LastEditors: yuxuanli
 * @LastEditTime: 2023-09-25 10:15:41
 * @FilePath: \micro-app-demo\main_apps\vite-vue3\src\views\vue3.vue
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
-->
<template>
  <div>
    <micro-app name='appname-vue3' :url='url' baseroute='/main-vite/app-vue3' :data='microAppData' @created='handleCreate'
      @beforemount='handleBeforeMount' @mounted='handleMount' @unmount='handleUnmount' @error='handleError'
      @datachange='handleDataChange'></micro-app>
    <button @click="gotoPage">测试主应用跳转子应用的某个页面</button>

  </div>
</template>

<script lang="ts">
import config from '../config'
import microApp, { getActiveApps } from '@micro-zoe/micro-app'

export default {
  name: 'vue3',
  data() {
    return {
      url: `${config.vue3}/child/vue3/`,
      microAppData: { msg: '来自基座的数据' }
    }
  },
  methods: {
    handleCreate(): void {
      console.log('child-vue3 创建了')
    },

    handleBeforeMount(): void {
      console.log('child-vue3 即将被渲染')
    },

    handleMount(): void {
      console.log('child-vue3 已经渲染完成')

      setTimeout(() => {
        // @ts-ignore
        this.microAppData = { msg: '来自基座的新数据' }
      }, 2000)
    },

    handleUnmount(): void {
      console.log('child-vue3 卸载了')
    },

    handleError(): void {
      console.log('child-vue3 加载出错了')
    },

    handleDataChange(e: CustomEvent): void {
      console.log('来自子应用 child-vue3 的数据:', e.detail.data)
    },
    gotoPage() {
      microApp.router.push({ name: 'appname-vue3', path: '/page2' })
    }
  }
}
</script>

<style></style>
