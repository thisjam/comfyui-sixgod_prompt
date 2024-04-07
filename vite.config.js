/*
 * @Author: Six_God_K
 * @Date: 2024-04-05 11:57:43
 * @LastEditors: Six_God_K
 * @LastEditTime: 2024-04-07 15:37:33
 * @FilePath: \comfyui-sixgod_prompt\vite.config.js
 * @Description: 
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
 */

import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'


export default defineConfig({
  define: {
    'process.env.NODE_ENV': '"production"',
  },
  plugins: [
    vue(),
    vueJsx(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    minify: true,
    sourcemap: true,
    lib: {
      entry: resolve(__dirname, 'src/main.js'),
      name: 'comfy-ui-sixgod-prompt',
      formats: ['umd'],
    },
    rollupOptions:{
    output: {
   
       dir:'./',
       entryFileNames: 'javascript/[name]-entry.js',
       chunkFileNames: 'javascript/[name]-chunk.js',
       // CSS文件命名规则
      //  assetFileNames: 'sixgod.[ext]', // 注意Vite默认会内联CSS，如需提取CSS文件，请参考CSS预处理器插件配置
       assetFileNames: 'sixgod.[ext]',
       // 指定输出格式，如umd、es、iife等
       format: 'umd'
    },
  }
  }

})
