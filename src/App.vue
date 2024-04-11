<template>
  <div  class="float" @click="openWindow=true">六</div>
  <div class="mainApp" :data-them="currentThem" v-show="openWindow">
   <div class="container">
 
    <div class="main-head"> 
      <div><button @click="syncTextAreaDoms" class="btn">绑定同步数据</button></div>
      <div><span @click="changThem(item)" class="color" v-for="item, index in themCssArr" :key="index" :style="{ background: item.bgcolor }"></span></div>
      <div  class="onoff"  @click="openWindow=false">X</div>
     
    
       
    </div>
      <Home v-if="globData.jsonData" :graioDoms="graioDoms" :pdata="globData.txt_prompt"></Home>
   </div>
  </div>
 
     
 


</template>


<script setup>
import { onMounted, ref, watchEffect, watch, inject } from 'vue'
import Home from "../src/components/Home.vue"
import { globStore } from '@/stores/index.js'
const eventBus=inject('eventBus')



const store = globStore()
const { globData } = store
let openWindow = ref(false);

 

let currentThem = ref('');
let themCssArr = [
  { cssThem: 'default', bgcolor: '#f97316' },
  { cssThem: 'pink', bgcolor: '#E06C75' },
  { cssThem: 'blue', bgcolor: '#5DADE2' },
  { cssThem: 'green', bgcolor: '#238636' },
  { cssThem: 'yellow', bgcolor: '#FF9800' },
]



const graioDoms = ref({
  txtdom: null,
  ntxtdom:null,
  
});


function changThem(item) {
  currentThem.value = item.cssThem;
  document.documentElement.setAttribute('data-them', item.cssThem)
  window.localStorage.setItem('currentThem', item.cssThem)
}


function initWindow() {
  document.addEventListener('keydown', function (event) {
    if (event.altKey && event.key.toLowerCase() === 'q') {
      openWindow.value = !openWindow.value;
    
    }

  });
}
// comfy-multiline-input
function getTextAreaDoms() {
  setTimeout(() => {
    let textareas=document.querySelectorAll('.comfy-multiline-input[placeholder="alt+q 呼出/隐藏 词库面板"]');
    if(textareas.length){
      try {
       graioDoms.value.txtdom=textareas[0];
       graioDoms.value.ntxtdom=textareas[1];
       eventBus.emit('loadTextArea',[textareas[0].value,textareas[1].value])
      } catch (error) {
        console.log(error);
      }   
    }
  }, 3000);
 

}
function syncTextAreaDoms() {
    let textareas=document.querySelectorAll('.comfy-multiline-input[placeholder="alt+q 呼出/隐藏 词库面板"]');
    if(textareas.length){
       graioDoms.value.txtdom=textareas[0];
       graioDoms.value.ntxtdom=textareas[1];
       eventBus.emit('loadTextArea',[textareas[0].value,textareas[1].value])
       alert("发现【"+textareas.length+"】个文本输入框")
    }
    else{
      alert("同步失败")
    }
 
 

}





 

function getJSonData() {
  fetch('api/sixgod/getJsonFiles').then(res => res.json()).then(data => {
    globData.jsonData = JSON.parse(data);
    globData.jsonFileNames = Object.keys(globData.jsonData);
    globData.jsonFileNames.forEach(fileName => {
      globData.cssList[fileName] = 0
    })
  
    
  })
}
 

onMounted(() => {
 
 
  getTextAreaDoms()
  initWindow()
  currentThem.value=window.localStorage.getItem('currentThem')||'default'
  getJSonData();

 
 

})














</script>




<style scoped lang="scss">


.color {
  width: 30px;
  height: 30px;
  display: inline-block;
  border-radius: 50%;
  cursor: pointer;
  margin: 0 3px;
}

.main-head {
  text-align: center;
    padding: 15px;
    display: flex;
    justify-content: space-between;
}

.float{
  position: fixed;
    bottom: 50px;
    left: 50px;
    width: 40px;
    height: 40px;
    background: linear-gradient(
90deg,#00c9ff,#92fe9d);
    border-radius: 50%;
    color: #4c1178;
    font-size: 22px;
    line-height: 40px;
    font-weight: bold;
    text-align: center;
    cursor: pointer;
    font-family: fangsong;
}

.onoff{
  font-size: 20px;
  cursor: pointer;
  width: 20px;
  height: 20px;
  line-height: 20px;
  padding: 5px;
  &:hover{
    color: rgb(196, 4, 4);
    font-weight: bold;
  }
}
</style>
