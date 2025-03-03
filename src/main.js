import './assets/main.scss'
import { createApp } from 'vue'
 
import App from './App.vue'
import common from './utils/common'


const app=createApp(App)

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
