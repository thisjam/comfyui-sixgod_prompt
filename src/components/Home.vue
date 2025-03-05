<!--
 * @Author: Six_God_K
 * @Date: 2025-02-22 18:09:17
 * @LastEditors: Six_God_K
 * @LastEditTime: 2025-03-05 16:05:25
 * @FilePath: \comfyui-sixgod_prompt\src\components\Home.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<template>

  <div class="prompt-container" >
    <div class="text-area">
      <div class="area-left">
        <PromptTextArea></PromptTextArea>
      </div>
      <div class="area-right">
        <div>当前版本v2.0.1</div>
        <a target="_blank" href="https://github.com/thisjam/comfyui-sixgod_prompt">👉点击查看插件如何使用</a>
      </div>
    </div>


    <div class="prompt-tools">
      <button class="btn" @click="deleteAllPrompt">清空提示词</button>
      <button class="btn" @click="clearCache">清理提示词缓存</button>
      <CustomRandomPrompt></CustomRandomPrompt>
      <Favorites></Favorites>
      <AutoComplete></AutoComplete>
    </div>
    <div>
      <ImaginePrompt></ImaginePrompt>
    </div>

  </div>
    <div class="prompt-list">
      <PromtList></PromtList>
    </div>






</template>

<script setup>
import { inject, onMounted, provide } from 'vue'
import PromptTextArea from './PromptRender/PromptTextArea.vue';
import PromtList from './PromptRender/PromtList.vue';
import AutoComplete from './PromptRender/AutoComplete.vue';
import CustomRandomPrompt from './PromptRender/CustomRandomPrompt.vue';
import Favorites from './PromptRender/Favorites.vue';
import ImaginePrompt from './PromptRender/ImaginePrompt.vue';
import eventBus from '../utils/eventBus';

 

 


function deleteAllPrompt() {
  eventBus.emit('deleteAllPrompt')
}

function clearCache() {
  localStorage.removeItem('six-promptsData')
}

onMounted(() => {
 
})
</script>

<style lang="scss" scoped>
.area-left {
  overflow: auto;
}

.prompt-container {
  position: sticky;
  top: 0;
  box-sizing: border-box;
  width: 100%;
  background: var(--body-bg-color);
  padding: 1em;
  z-index: 10;
  border-radius: 3px;


}

.text-area {
  display: grid;
  grid-template-columns: 8fr 2fr;
  gap: 1em;

  .area-right {
    color: #9c999d;
    font-size: 0.8em;

    a {
      color: #9c999d;
    }
  }
}


.prompt-tools {
  margin: 10px 0;
  display: flex;
  align-items: center;

  button {
    margin-right: 10px;
  }
}
</style>
