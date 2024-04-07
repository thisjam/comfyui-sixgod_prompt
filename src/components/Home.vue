
<template>
  <div class="home" v-if="promptObj" ref="Refhome">
    <slot></slot>
    <Favorites></Favorites>
    <RandPrompt></RandPrompt>
    <div class="prompt-container">
      <p>{{ props.pagetit }}</p>
      <div>
        <PromptTextArea :syncDom="props.graioDoms.txtdom" :isPositive="true" :list="props.pdata.txt"></PromptTextArea>
        <PromptTextArea :syncDom="props.graioDoms.ntxtdom" :isPositive="false" :list="props.pdata.ntxt">
        </PromptTextArea>
      </div>

      <div class="prompt-tools">
         <button @click="deleteAllPrompt(true)">清空正向提示词</button>
          <button @click="deleteAllPrompt(false)">清空反向提示词</button>
          <button @click="toggleRandomOpen">自定义随机词库</button>
          <button @click="toggleFaviriteOpen">收藏夹</button>
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
 
import { globStore} from '@/stores/index.js'

const store = globStore()
const { globData ,toggleRandomOpen,toggleFaviriteOpen} = store

const props = defineProps({
  pdata: { type: Object, required: true },
  graioDoms: { type: Object, required: true },
  isFaviriteOpen: { type: Boolean, required: true },
  pagetit: { type: String, required: true },
});


let promptObj = ref(props.pdata);
let Refhome = ref(null);
 
 

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
.prompt-tools{
  margin: 10px 0;
}

 
 
 
</style>
