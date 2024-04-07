<!--
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2024-03-25 15:17:07
 * @LastEditors: Six_God_K
 * @LastEditTime: 2024-04-04 13:46:35
 * @FilePath: \webui-prompt\src\components\promptRender\NavMenu.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
 <div class="nav-menu" >
    <div :data-tit="item" v-for="item,index in menus" :key="index" class="tags" @click="changeActiveNavName(item)"  :style="globData.activeNavName==item?c_activeStyle:null">
      {{item}}
    </div>
 </div>
</template>

<script setup>

import { onMounted, inject, computed} from 'vue'
import { globStore } from '@/stores/index.js'
 
 
const store = globStore()
const { globData } = store
const props = defineProps({
    menus: { type:Array,required: true,default:[]}
})

const c_activeStyle=computed(()=>{

  return {
      background:"var(--navtag-active-bg-color)",
      color:"var(--navtag-active-text-color)"
  }
})

function addInlineCss(){
  setTimeout(() => {
     let jstring= document.querySelectorAll(".j-string");
          jstring.forEach(element => {
           if(element.parentNode.parentNode.style.display == "inline-block"){
               return
           };     
           element.parentNode.parentNode.style.display ="inline-block"
       });
     
    }, 1);
 
  
}
function changeActiveNavName(name){
  globData.activeNavName = name;
  addInlineCss()
}
 
onMounted(() => {
  props.menus.length?globData.activeNavName = props.menus[0]:globData.activeNavName = '' 
  addInlineCss()
   
})
</script>

<style lang="scss" scoped>

   .nav-menu .tags{ 
     padding: 1em;
     cursor: pointer;  
   }

   .nav-menu .active{  
      background:var(--navtag-active-bg-color);
      color:var(--navtag-active-text-color)
   }
   
   .nav-menu{
     display: flex;
     margin-top: 2em;
     box-shadow: var(--navtag-shadow);
     background-color: var(--navtag-bg-color);
     color:var( --navtag-text-color)
     
   }
   .nav-selected{
    position: relative;
     &::after{
      position: absolute;
      content: '';
      display: block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background:var(--menu-prompt-selected-color);
      right: 3px;
      top: 50%;
      transform: translateY(-50%);
    }
   }
</style>
