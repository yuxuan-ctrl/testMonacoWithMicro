<!--
 * @Author: yuxuanli
 * @Date: 2023-08-07 09:11:19
 * @LastEditors: yuxuan-ctrl
 * @LastEditTime: 2023-11-17 18:14:03
 * @FilePath: \micro-app-demo\main_apps\vite-vue3\src\views\vite.vue
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
-->
<template>
  <div>
    <micro-app name='appname-vite' :url='url' iframe :data='microAppData' @created='handleCreate'
      @beforemount='handleBeforeMount' @mounted='handleMount' @unmount='handleUnmount' @error='handleError'
      @datachange='handleDataChange'></micro-app>
      <!-- <iframe src="http://localhost:4007/child/vite/" frameborder="0" width="100%"
      height="800px"></iframe> -->
  </div>
</template>

<script lang="ts">
import { EventCenterForMicroApp } from '@micro-zoe/micro-app'
import config from '../config'
import microApp, { getActiveApps } from '@micro-zoe/micro-app'
import { useRouter } from 'vue-router'
const router = useRouter()
const sidebarData = {
  // 子应用sidebar通过pushState控制主应用跳转
  pushState: (appName: string, path: string, hash: string) => {
    /**
     * 当子应用还未渲染，通过基座控制路由跳转，子应用在初始化时会自己根据url渲染对应的页面
     * 当子应用已经渲染，则直接控制子应用进行内部跳转
     *
     * getActiveApps: 用于获取正在运行的子应用
     */
    if (!getActiveApps().includes(appName)) {
      // child-vite 和 child-react17子应用为hash路由，这里拼接一下hash值
      hash && (path += `/#${hash}`)
      // 主应用跳转
      router.push(path)
    } else {
      let childPath = null
      // child-vite 和 child-react17子应用是hash路由，hash值就是它的页面地址，这里单独处理
      if (hash) {
        childPath = hash
      } else {
        // path的值形式如：/app-vue2/page2，这里/app-vue2是子应用的基础路由，/page2才是页面地址，所以我们需要将/app-vue2部分删除
        childPath = path.replace(/^\/app-[^/]+/, '')
        !childPath && (childPath = '/') // 防止地址为空
      }

      // 主应用通过下发data数据控制子应用跳转
      microApp.setData(appName, { path: childPath })
    }
  },
}
// @ts-ignore 因为vite子应用关闭了沙箱，我们需要为子应用appname-vite创建EventCenterForMicroApp对象来实现数据通信
window.eventCenterForAppNameVite = new EventCenterForMicroApp('appname-vite')

export default {
  name: 'vite',
  data() {
    return {
      url: `${config.vite}/child/vite/`,
      microAppData: { msg: '来自基座的数据', ...sidebarData }
    }
  },
  methods: {
    handleCreate(): void {
      console.log('child-vite 创建了')
    },

    handleBeforeMount(): void {
      console.log('child-vite 即将被渲染')
    },

    handleMount(): void {
      console.log('child-vite 已经渲染完成')

      setTimeout(() => {
        // @ts-ignore
        this.microAppData = { msg: '来自基座的新数据' }
      }, 2000)
    },

    handleUnmount(): void {
      console.log('child-vite 卸载了')
    },

    handleError(): void {
      console.log('child-vite 加载出错了')
    },

    handleDataChange(e: CustomEvent): void {
      console.log('来自子应用 child-vite 的数据:', e.detail.data)
    }
  }
}
</script>


<style></style>
