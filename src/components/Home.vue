<template>
  <div class="home" v-if="promptObj" ref="Refhome">
    <slot></slot>
    <Favorites></Favorites>
    <RandPrompt></RandPrompt>
    <div class="prompt-container">
      <p>{{ props.pagetit }}</p>
      <div class="text-area">
        <div class="area-left">
          <PromptTextArea :syncDom="props.graioDoms.txtdom" :isPositive="true" :list="props.pdata.txt"></PromptTextArea>
          <PromptTextArea :syncDom="props.graioDoms.ntxtdom" :isPositive="false" :list="props.pdata.ntxt">
          </PromptTextArea>
        </div>
        <div class="area-right">
          <div>当前版本v1.74</div>
          <a target="_blank" href="https://github.com/thisjam/comfyui-sixgod_prompt">👉点击查看插件如何使用</a>
          <!-- <a target="_blank" href="https://github.com/thisjam/sd-webui-oldsix-prompt">插件教程</a> -->
 
        </div>
      </div>

      <div class="prompt-tools">
        <button @click="deleteAllPrompt(true)">清空正向提示词</button>
        <button @click="deleteAllPrompt(false)">清空反向提示词</button>
        <button @click="toggleRandomOpen">自定义随机词库</button>
        <button @click="toggleFaviriteOpen">收藏夹</button>
        <AutoComplete></AutoComplete>
      </div>
      <div style="display: flex;align-items: center;">
      
        <button class="btn-suiji" :disabled="globData.is_suiji_loading" @click="suji_prompt">随机灵感</button>
        <div class="spinner loading-suiji" v-if="globData.is_suiji_loading">
          <div class="bounce1"></div>
          <div class="bounce2"></div>
          <div class="bounce3"></div>
        </div>
        <input type="text" placeholder="请输入联想的关键词,需要先配置大模型" v-model="imagine">
        <input type="text" placeholder="开始占位提示词" v-model="placeholderPrompts.start">
        <input type="text" placeholder="结尾占位提示词" v-model="placeholderPrompts.end">
      
      </div>



      <NavMenu v-if="globData.jsonFileNames.length > 0" :menus="globData.jsonFileNames"></NavMenu>
    </div>


    <template v-for="(item, index) in globData.jsonFileNames" :key="index">
      <PromtList v-if="globData.jsonData" :parenttit="item" v-show="item == globData.activeNavName"
        :obj="globData.jsonData[item]" :pdata="props.pdata"></PromtList>
    </template>
  </div>

</template>

<script setup>

import { onMounted, inject, ref, watch } from 'vue'
import NavMenu from './promptRender/NavMenu.vue';


import PromptTextArea from './promptRender/PromptTextArea.vue';
import Favorites from './promptRender/Favorites.vue';
import RandPrompt from './promptRender/RandPrompt.vue';
import PromtList from './promptRender/PromtList.vue';
import AutoComplete from './promptRender/AutoComplete.vue';

import { globStore } from '@/stores/index.js'
const eventBus = inject('eventBus')
const store = globStore()
const { globData, toggleRandomOpen, toggleFaviriteOpen } = store

const props = defineProps({
  pdata: { type: Object, required: true },
  graioDoms: { type: Object, required: true },
  isFaviriteOpen: { type: Boolean, required: true },
  pagetit: { type: String, required: true },
});


let promptObj = ref(props.pdata);
let Refhome = ref(null);
let imagine = ref(null);
let placeholderPrompts  = ref({
  start:'',
  end:''
});

function suji_prompt() {
  eventBus.emit('suji_prompt', imagine.value,placeholderPrompts.value)
}


function deleteAllPrompt(isPositive) {
  let _arr = isPositive ? promptObj.value.txt : promptObj.value.ntxt;
  _arr.splice(0, _arr.length)
  clearActiveBtnHighLight(isPositive)
}

function toggleTitleCss(dom) {
  let home_ele = dom.closest('.home');
  const selector = `.nav-menu [data-tit="${dom.dataset.parenttit}"]`;
  let navelement = home_ele.querySelector(selector);

  if (globData.cssList[dom.dataset.parenttit] == 0) {
    navelement.classList.remove('nav-selected')
  }
  else {
    navelement.classList.add('nav-selected')
  }
}

function clearActiveBtnHighLight(isPositive) {
  let removecss = isPositive ? 'txt_active' : 'ntxt_active'
  let addcss = isPositive ? 'ntxt_active' : 'txt_active'
  let activeBtns = Refhome.value.querySelectorAll('.j-string');

  Object.entries(globData.cssList).forEach(([key, value]) => {
    globData.cssList[key] = 0;
  });

  activeBtns.forEach(dom => {
    if (dom.classList.contains('all_active')) {
      dom.classList.remove('all_active')
      dom.classList.add(addcss)
      globData.cssList[dom.dataset.parenttit]++;
    }
    dom.classList.remove(removecss)
    toggleTitleCss(dom)
  })


}



</script>

<style lang="scss" scoped>
div {
  box-sizing: border-box;
}

.home {
  font-size: 1.5em
}

.prompt-container {
  position: sticky;
  width: 100%;
  top: 0;
  background: var(--body-bg-color);
  padding: 1em;
  z-index: 10;
  border-radius: 3px;


}

.prompt-tools {
  margin: 10px 0;
  display: flex;

  align-items: center;

  button {
    margin-right: 10px;
  }
}

.nav-menu {
  margin-bottom: 10px;
}

.nav-menu .nav-selected {
  background: var(--body-bg-color);
  color: var(--body-color);
  border-radius: 3px;
}

input {
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin: 5px;
  box-sizing: border-box;
  padding: 5px;
  width: 28em;
}

.nav-menu .nav-selected:hover {}

.text-area {
  display: grid;
  grid-template-columns: 8fr 2fr;
  gap: 1em;
}
.area-right{
  color: #9c999d;
  font-size: 0.8em;
  a{
    color: #9c999d;
  }
}

.spinner {
  width: 70px;
  text-align: center;
}

.spinner > div {
  width: 18px;
  height: 18px;
  background-color: #fff;

  border-radius: 100%;
  display: inline-block;
  -webkit-animation: sk-bouncedelay 1.4s infinite ease-in-out both;
  animation: sk-bouncedelay 1.4s infinite ease-in-out both;
}

.spinner .bounce1 {
  -webkit-animation-delay: -0.32s;
  animation-delay: -0.32s;
}

.spinner .bounce2 {
  -webkit-animation-delay: -0.16s;
  animation-delay: -0.16s;
}

@-webkit-keyframes sk-bouncedelay {
  0%, 80%, 100% { -webkit-transform: scale(0) }
  40% { -webkit-transform: scale(1.0) }
}

@keyframes sk-bouncedelay {
  0%, 80%, 100% { 
    -webkit-transform: scale(0);
    transform: scale(0);
  } 40% { 
    -webkit-transform: scale(1.0);
    transform: scale(1.0);
  }
}
</style>
