<!--
 * @Author: Six_God_K
 * @Date: 2024-04-03 19:06:48
 * @LastEditors: Six_God_K
 * @LastEditTime: 2024-04-07 15:03:13
 * @FilePath: \comfyui-sixgod_prompt\src\components\promptRender\Dialog.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
-->
<template>


  <div class="six-dialog">
    <div class="head">
      <slot name="head"></slot>
      <span class="close-btn" @click="closeDialog">X</span>
    </div>
    <div class="content">
      <slot name="content"></slot>
    </div>
  </div>



</template>

<script setup>
import { onMounted, defineEmits } from 'vue'
// 定义将要触发的事件名称
const emit = defineEmits(['closeDialog']);

function closeDialog() {
  emit('closeDialog');
}



</script>

<style lang="scss" scoped>
.six-dialog {
  position: fixed;
  overflow: hidden;
  left: 50%;
  background: var(--dialog-bg-color);
  transform: translateX(-50%);
  border-radius: 3px;
  z-index: 1000;
  box-shadow: var(--dialog-box-shadow);
  font-size: inherit;
  min-width: 50%;

  .head {
    position: sticky;
    top: 0;
    background: var(--dialog-head-bg-color);
    padding: 1em;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #ffffff;
    font-weight: bold;

    .close-btn {
      cursor: pointer;
      color: var(--dialog-close-text-color);
      font-size: 1.2em;
      font-weight: 600;
      padding: 0 0.5em;

      &:hover {
        color: var(--dialog-close-hover-text-color);
      }
    }
  }

}
</style>
