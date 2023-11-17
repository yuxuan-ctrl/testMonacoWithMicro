/*
 * @Author: yuxuan-ctrl
 * @Date: 2023-08-07 09:11:19
 * @LastEditors: yuxuan-ctrl
 * @LastEditTime: 2023-11-17 17:28:20
 * @FilePath: \micro-app-demo\child_apps\vite-vue3\vite.config.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { join } from 'path'
import { writeFileSync } from 'fs'
// import viteMicroAppMonacoPlugin from "vite-plugin-microapp-monaco"
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // viteMicroAppMonacoPlugin({
    //   monacoPath:'./node_modules/monaco-editor/esm/vs/base/browser/mouseEvent.js'
    // }),
    vue(),
    (function () {
      let basePath = ''
      return {
        name: "vite:micro-app",
        apply: 'build',
        configResolved(config) {
          basePath = `${config.base}${config.build.assetsDir}/`
        },
        // renderChunk(code, chunk) {
        //   if (chunk.fileName.endsWith('.js')) {
        //     code = code.replace(/(from|import\()(\s*['"])(\.\.?\/)/g, (all, $1, $2, $3) => {
        //       return all.replace($3, new URL($3, basePath))
        //     })
        //   }
        //   return code
        // },
        // writeBundle 钩子可以拿到完整处理后的文件，但已经无法修改
        writeBundle (options, bundle) {
          for (const chunkName in bundle) {
            if (Object.prototype.hasOwnProperty.call(bundle, chunkName)) {
              const chunk = bundle[chunkName]
              if (chunk.fileName && chunk.fileName.endsWith('.js')) {
                chunk.code = chunk.code.replace(/(from|import\()(\s*['"])(\.\.?\/)/g, (all, $1, $2, $3) => {
                  return all.replace($3, new URL($3, basePath))
                })
                const fullPath = join(options.dir, chunk.fileName)
                writeFileSync(fullPath, chunk.code)
              }
            }
          }
        },
        // generateBundle 执行时import() 还是 q(()=>import("./page2.cdecf1fd.js"),"__VITE_PRELOAD__")
        // generateBundle (options, bundle) {
        //   for (const chunkName in bundle) {
        //     if (Object.prototype.hasOwnProperty.call(bundle, chunkName)) {
        //       const chunk = bundle[chunkName]
        //       if (chunk.fileName && chunk.fileName.endsWith('.js')) {
        //         chunk.code = chunk.code.replace(/(from|import)(\s*['"])(\.\.?\/)/g, (all, $1, $2, $3) => {
        //           return all.replace($3, new URL($3, basePath))
        //         })

        //         if (chunk.fileName.includes('index')) {
        //           console.log(22222222, chunk.code)
        //         }
        //       }
        //     }
        //   }
        // },
      }
    })() as any,
  ],
  server: {
    port: 4007,
  },
  base: `${process.env.NODE_ENV === 'production' ? 'http://www.micro-zoe.com' : ''}/child/vite/`,
  build: {
    outDir: 'vite',
  },
})
