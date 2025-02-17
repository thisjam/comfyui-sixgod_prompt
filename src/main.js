/*
 * @Author: Six_God_K
 * @Date: 2024-03-24 15:55:19
 * @LastEditors: Six_God_K
 * @LastEditTime: 2025-02-17 14:12:32
 * @FilePath: \vue\comfyui-sixgod_prompt\src\main.js
 * @Description: 
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
 */
 
// import './assets/default.css'
import './assets/main.scss'
 

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import common from '/src/js/utils/index.js'
import eventBus from '/src/js/utils/eventBus.js'
import draggable from '/src/js/utils/drag.js'
// import { app } from "../../../web/scripts


 
    const div = document.createElement('div')
    div.id  = 'six_god_k'  
    const pinia = createPinia()
    const vueapp=createApp(App)
    const body=document.querySelector('body')
    body.appendChild(div)
    vueapp.use(pinia)
    // app.config.globalProperties.$common = common;
    vueapp.provide('common', common);
    vueapp.provide('eventBus', eventBus);
    vueapp.directive('draggable', draggable);
    vueapp.mount(div)

    
 
 
 

