<!--
 * @Author: Six_God_K
 * @Date: 2024-04-15 17:41:24
 * @LastEditors: Six_God_K
 * @LastEditTime: 2024-04-16 11:28:43
 * @FilePath: \comfyui-sixgod_prompt\src\components\promptRender\AutoComplete.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
-->
<template>
  <div class="auto-complete">
      <input type="text"  
      @keyup.enter.prevent="sendPromt" 
      placeholder="快速查找提示词，按回车输入" v-model="inputText" 
      @keydown.tab.prevent="handleTab" 
      @keydown.down.prevent="navigateSuggestions('down')"
      @keydown.up.prevent="navigateSuggestions('up')"
      ref="inputRef" />
      <div class="tips" v-if="c_isshowTips" ref="suggestionsList">
          <ul >
              <li  :class="{ 'selected': index === currentSelectedIndex }" 
              v-for="item ,index in filteredSuggestions" :key="item.en" 
              :ref="el => setLiRef(el, index)"
              @click="selectWord(item)">
                  {{ item.cn }} 【{{ item.en }}】
              </li>
          </ul>
      </div>
  </div>
</template>

<script setup>
import { ref, inject, watch, nextTick,computed  } from 'vue';
import { globStore } from '@/stores/index.js'
const store = globStore()
const { globData } = store
const inputText = ref('');
const debounceTimeout = ref(null);
const inputRef = ref(null);
const currentSelectedIndex = ref(0);
const liRefs = ref([]);
const filteredSuggestions = ref([]);
const tempPrompt = ref(null);
const eventBus = inject('eventBus')
const suggestionsList = ref(null);

 

const c_isshowTips = computed(() => {
    return  filteredSuggestions.value.length > 0;
});

function setLiRef(el, index) {
  if (el) {
    liRefs.value[index] = el;
  }
}

watch(inputText, (newValue) => {
  clearTimeout(debounceTimeout.value);
  debounceTimeout.value = setTimeout(() => {
      const query = newValue.trim().split(',').pop().trim();
      filteredSuggestions.value = query ? globData.prompt_tips.filter(item => item.cn.includes(query) || item.en.includes(query)) : [];

    }, 300); // 300 ms 防抖时间
});


function navigateSuggestions(direction) {
  if (!filteredSuggestions.value.length) return;
  const maxIndex = filteredSuggestions.value.length - 1;
 
  currentSelectedIndex.value += (direction === 'down') ? 1 : -1;
  
    // Wrap around the index
    if (currentSelectedIndex.value > maxIndex) {
      currentSelectedIndex.value = 0;
    } else if (currentSelectedIndex.value < 0) {
      currentSelectedIndex.value = maxIndex;
    }
    nextTick(() => {
    const liElement = liRefs.value[currentSelectedIndex.value];
    if (liElement) {
      const topPos = liElement.offsetTop;
      const bottomPos = liElement.offsetTop + liElement.offsetHeight;
      if (topPos < suggestionsList.value.scrollTop) {
        suggestionsList.value.scrollTop = topPos;
      } else if (bottomPos > suggestionsList.value.scrollTop + suggestionsList.value.offsetHeight) {
        suggestionsList.value.scrollTop = bottomPos - suggestionsList.value.offsetHeight;
      }
    }
  });
 
 

}


function selectWord(item) {
  replaceText(item);
}

function handleTab() {
 
  if (filteredSuggestions.value.length > 0) {
      replaceText(filteredSuggestions.value[currentSelectedIndex.value]);
  }
}

function replaceText(queryItem) {
  tempPrompt.value=queryItem
  let parts = inputText.value.trim().split(',');
  parts.pop();  // Remove the last part that the user was typing
  parts.push(queryItem.en); // Add the selected word
  inputText.value = parts.join(',') + ', ';;
  nextTick(() => {
      inputRef.value.focus();
  });
}


function sendPromt() {
  if (inputText.value.trim() !== '') {
    let sendPromtObj=filteredSuggestions.value[currentSelectedIndex.value]||tempPrompt.value
    if(!sendPromtObj) return
    eventBus.emit('autoTips', sendPromtObj)
    inputText.value=''
    currentSelectedIndex.value = 0;  // Reset selection on new input
    tempPrompt.value=null
  }
}

nextTick(() => {
  inputRef.value.focus();
});
</script>

<style scoped lang="scss">
.auto-complete{   
  width: 500px;
  display: flex;
  align-items: center;
  position: relative;
  
}
input {
  width: 100%;
  padding: 5px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}
.tips{
 
 position: absolute;
 top: 40px;
 left: 0;
 width: 100%;
 background-color: #fff;
 border: 1px solid #ccc;
 border-radius: 4px;
 box-sizing: border-box;
 color: black;
 z-index: 1000;
 max-height: 34em;
 overflow: auto;
}

li:hover {
  background-color: #757171;
}
ul {
 list-style-type: none;
 padding: 0;
 margin: 0;
 
 
}

li {
  padding: 5px;
  cursor: pointer;
  overflow: hidden; /* 隐藏超出div的内容 */
  white-space: nowrap; /* 禁止文字换行 */
  text-overflow: ellipsis; /* 当内容溢出时，用省略号代替 */
}
.selected {
  background-color: #757171; /* Highlight the selected item */
}
</style>