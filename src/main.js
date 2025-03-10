/*
 * @Author: Six_God_K
 * @Date: 2025-03-03 21:41:18
 * @LastEditors: Six_God_K
 * @LastEditTime: 2025-03-10 13:05:18
 * @FilePath: \comfyui-sixgod_prompt\src\main.js
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */
import './assets/main.scss'
import { createApp } from 'vue'
 
import App from './App.vue'
import common from './utils/common'
import autoDrag from './utils/autoDrag'
import resizable from './utils/resizable'


const app=createApp(App)
app.directive('autoDrag', autoDrag)
app.directive('resizable', resizable)
app.provide('common', common);

// app.mount('#app')
app.mount(InitPulgin())


function InitPulgin() {
    const div = document.createElement('div')
    div.id  = 'six_god_k'  
    const body=document.querySelector('body')
    body.appendChild(div)
    return div
}
