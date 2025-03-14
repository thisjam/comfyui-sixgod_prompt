<!--
 * @Author: Six_God_K
 * @Date: 2025-02-22 18:09:17
 * @LastEditors: Six_God_K
 * @LastEditTime: 2025-03-14 22:44:34
 * @FilePath: \comfyui-sixgod_prompt\src\components\Home.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<template>
  <div class="prompt-container fr82">
    <div class="float-left">
      <PromptTextArea></PromptTextArea>
      <div class="prompt-tools">
        <button class="" @click="deleteAllPrompt">清空提示词</button>
        <CustomRandomPrompt></CustomRandomPrompt>
        <Favorites></Favorites>
        <button @click="isShowImg2txt = !isShowImg2txt">图片反推</button>
        <AutoComplete></AutoComplete>
      </div>
      <ImaginePrompt></ImaginePrompt>

    </div>

    <div class="float-right">
      <div class="version-info">
        <div>当前版本v2.1.2</div>
        <div>
          <a target="_blank" href="https://github.com/thisjam/comfyui-sixgod_prompt">👉点击查看插件如何使用</a>
        </div>
        <div style="position: relative;">
          <a href="javascript:void(0)" @click="showWx = !showWx">👉技术、商业合作、技术交流群</a>
          <div v-show="showWx" class="wx"> <img src="@/assets/imgs/wx.jpg" alt=""></div>
        </div>
      </div>
      <div class="generate-btn">
        <button :disabled="progressData.max>0" @click="generateImg">生成图片</button>
      </div>
      <div class="generate-img">
        <img @click="showPreImg" v-if="dragImgData.imageUrl" :src="dragImgData.imageUrl">
        <div v-else>图片预览（配合作者的图像预览节点）</div>
      </div>

      <ProgressBar v-model="progressData" />

      <DragImg v-model="dragImgData"></DragImg>
      <div>
        <UploadImg v-model="isShowImg2txt"></UploadImg>
      </div>
    </div>

  </div>

  <div class="fr82">
    <div>
      <PromtList></PromtList>
    </div>
    <div></div>
  </div>








</template>

<script setup>
import { inject, onMounted, ref } from 'vue'
import PromptTextArea from './PromptRender/PromptTextArea.vue';
import PromtList from './PromptRender/PromtList.vue';
import AutoComplete from './PromptRender/AutoComplete.vue';
import CustomRandomPrompt from './PromptRender/CustomRandomPrompt.vue';
import Favorites from './PromptRender/Favorites.vue';
import ImaginePrompt from './PromptRender/ImaginePrompt.vue';
import UploadImg from './PromptRender/UploadImg.vue';
import DragImg from './PromptRender/DragImg.vue';
import ProgressBar from './PromptRender/ProgressBar.vue';
import eventBus from '../utils/eventBus';
import { register } from '@/utils/load';
 

const progressMaxValue = ref(0); // 最大值
const currentProgress = ref(0); // 初始进度值
const progressData = ref(
  {
    max: 0,
    value: 0
  }
)
const showWx = ref(false)
const isShowImg2txt = ref(false)
const dragImgData = ref({
  imageUrl: '',
  isshow: false
})

function showPreImg(e) {
  e.stopPropagation();
  dragImgData.value.isshow = true
}

function deleteAllPrompt() {
  eventBus.emit('deleteAllPrompt')
}
function excuted(url) {
  dragImgData.value.imageUrl = url;
}
function progress(data) {
  progressData.value.value = data.detail.value;
  progressData.value.max = data.detail.max;
}

function generateImg() {
  let btn = document.querySelector(".queue-button-group button");
  btn.click();
}
onMounted(() => {

  register(excuted, progress)
})
</script>

<style lang="scss" scoped>
.prompt-container {
  position: sticky;
  top: 0;
  box-sizing: border-box;
  width: 100%;
  background: var(--body-bg-color);
  z-index: 10;

}

.fr82 {
  display: grid;
  grid-template-columns: 8fr 2fr;
  gap: 1em;
  padding: 1em;
}


.prompt-tools {
  margin: 10px 0;
  display: flex;
  align-items: center;
}

.version-info {
  color: #9c999d;
  font-size: 0.8em;

  a {
    color: #9c999d;
  }
}

.wx {
  width: 200px;

  img {
    width: 100%;
  }

  position: absolute;
  top: 10px;
}



.generate-btn button {
  width: 100%;
  height: 60px;
  font-weight: bolder;
  background: var(--main-color);
  margin-block: 10px;
  box-shadow: 0 0 0.5px var(--main-color);
  border: 0px;

}
.generate-btn button:disabled, button[disabled] {
  background-color: #cccccc; /* 灰色背景 */
  color: #fff; /* 淡色文字 */
  border: 1px solid #aaaaaa; /* 浅色边框 */
  cursor: not-allowed; /* 鼠标指针样式 */
 
}

.generate-img {
  text-align: center;
  height: 200px;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px dotted #b7b7b7ad;
  margin-bottom: 10px;
  

  img {
    cursor: pointer;
    height: 100%;

  }
}
</style>
