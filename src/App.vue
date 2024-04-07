<template>
  <div class="mainApp" :data-them="currentThem" v-show="openWindow">
   <div class="container">
    <div class="main-head"> <span @click="changThem(item)" class="color" v-for="item, index in themCssArr" :key="index"
                      :style="{ background: item.bgcolor }"></span></div>
      <Home v-if="globData.jsonData" :graioDoms="graioDoms" :pdata="globData.txt_prompt"></Home>
   </div>
  </div>
 
     
 


</template>


<script setup>
import { onMounted, ref, watchEffect, watch } from 'vue'
import Home from "../src/components/Home.vue"
import { globStore } from '@/stores/index.js'



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

function getTextAreaDoms() {
  setTimeout(() => {
    let textareas=document.querySelectorAll('.comfy-multiline-input');
    graioDoms.value.txtdom=textareas[0];
    graioDoms.value.ntxtdom=textareas[1];
    console.log(graioDoms.value);
  }, 500);
 

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




<style scoped>


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
}
</style>
