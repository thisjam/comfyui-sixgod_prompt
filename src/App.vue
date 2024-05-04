<template>
  <!-- <div class="float" @click="openWindow = true">六</div> -->
  <div class="float"  v-draggable="{ onClick: ()=>openWindow = true }">六</div>
  <div class="mainApp" :data-them="currentThem" v-show="openWindow">
    <div class="container">
      <div class="main-head">
        <div>
          <button @click="syncTextAreaDoms" class="btn">同步数据</button>
        <!--<button @click="syncTextAreaDoms(false)" class="btn">交换正反同步</button>-->
          <button class="btn" @click="openSetting.isopen = !openSetting.isopen">设置</button>
        </div>
        <div><span @click="changThem(item)" class="color" v-for="item, index in themCssArr" :key="index"
            :style="{ background: item.bgcolor }"></span></div>
        <div class="onoff" @click="openWindow = false">X</div>
      </div>
      <div class="settings">
        <Settings :openSetting="openSetting"></Settings>
      </div>
      <Home v-if="globData.jsonData" :graioDoms="graioDoms" :pdata="globData.txt_prompt"></Home>
    </div>
  </div>





 </template> 


<script setup>
import { onMounted, ref, watchEffect, inject } from 'vue'
import Home from "../src/components/Home.vue"
import Settings from "@/components/promptRender/Settings.vue"
import AutoComplete from "@/components/promptRender/AutoComplete.vue"
import { globStore } from '@/stores/index.js'
const eventBus = inject('eventBus')
const $common = inject('common')
// const instance = getCurrentInstance()

const store = globStore()
const { globData } = store
let openWindow = ref(false);
let openSetting = ref({ isopen: false });

const transObj = ref(null)
const shortCutOjb = ref(null)
 





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
  ntxtdom: null,

});
function loadSetting() {
  shortCutOjb.value = JSON.parse(localStorage.getItem('shortCutOjb'))
  transObj.value = JSON.parse(localStorage.getItem('transObj'))

}


function changThem(item) {
  currentThem.value = item.cssThem;
  document.documentElement.setAttribute('data-them', item.cssThem)
  window.localStorage.setItem('currentThem', item.cssThem)
}


function initShortcut() {

  document.addEventListener('keydown', function (event) {
    let keys = {
      '': null,
      'alt': event.altKey,
      'ctrl': event.ctrlKey,
      'shift': event.shiftKey,
      'commond': event.metaKey
    }

    let _firstKey = keys[shortCutOjb.value.firstKey]
    if (_firstKey) {
      if (event.key.toLowerCase() == shortCutOjb.value.secondKey) {
        openWindow.value = !openWindow.value;
      }
    }
    else if (event.key.toLowerCase() == shortCutOjb.value.secondKey) {

      if (!shortCutOjb.value.firstKey) {
        openWindow.value = !openWindow.value;

      }

    }


    if (event.key.toLowerCase() == 'escape') {
      openWindow.value = false;
    }
  });

}
// comfy-multiline-input

function bindTextAreaDoms(textareas) {
 
    let top1=textareas[0].getBoundingClientRect().top
    let top2=textareas[1].getBoundingClientRect().top
    if(top1<top2){
      graioDoms.value.txtdom = textareas[0];
      graioDoms.value.ntxtdom = textareas[1];
    }
    else{
      graioDoms.value.txtdom = textareas[1];
      graioDoms.value.ntxtdom = textareas[0];
     
    }
  
    eventBus.emit('loadTextArea', [graioDoms.value.txtdom.value, graioDoms.value.ntxtdom.value])
   

}




function getTextAreaDoms() {
  setTimeout(() => {
    let textareas = document.querySelectorAll('.comfy-multiline-input[placeholder="alt+q 呼出/隐藏 词库面板"]');
    if (textareas.length) {
      try {
        bindTextAreaDoms(textareas);
      } catch (error) {
        console.log(error);
      }
    }
  }, 500);

}
function syncTextAreaDoms() {
  let textareas = document.querySelectorAll('.comfy-multiline-input[placeholder="alt+q 呼出/隐藏 词库面板"]');
  if (textareas.length) {
    bindTextAreaDoms(textareas);
    alert("发现【" + textareas.length + "】个文本输入框")
  }
  else {
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
    globData.prompt_tips = $common.JsonObjtoArr(globData.jsonData)
 
  })
}
function setTransServer() {

  fetch('api/sixgod/setTransServer', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(transObj.value),
  })

}

 

onMounted(() => {
  loadSetting()
  getTextAreaDoms()
  initShortcut()
  currentThem.value = window.localStorage.getItem('currentThem') || 'default'
  getJSonData();
  setTransServer()
 
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

.float {
  position: fixed;
  bottom: 50px;
  left: 50px;
  width: 40px;
  height: 40px;
  background: linear-gradient(90deg, #00c9ff, #92fe9d);
  border-radius: 50%;
  color: #4c1178;
  font-size: 22px;
  line-height: 40px;
  font-weight: bold;
  text-align: center;
  cursor: pointer;
  font-family: fangsong;
}

.onoff {
  font-size: 20px;
  cursor: pointer;
  width: 20px;
  height: 20px;
  line-height: 20px;
  padding: 5px;

  &:hover {
    color: rgb(196, 4, 4);
    font-weight: bold;
  }
}
</style>
