 
<template>

   <div class="" v-show="close">

    <div class="six-dialog" v-show="close">
      <div class="head">
        <slot name="head"></slot>
        <span class="close-btn" @click="close=false">X</span>
      </div>
      <div class="tbs">
        <slot name="tbs"></slot>
      </div>
      <div class="content">
        <slot name="content"></slot>
      </div>
    </div>
  </div>

  
  
  </template>
  
  <script setup>
  import {ref } from 'vue'
  const close=defineModel()
  
  
  
  </script>

  
  
  <style lang="scss" scoped>
  .main-modal{
    background: rgba(153, 147, 147, 0.411);
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9;
  }
  .six-dialog {
    position: fixed;
    top:10%;
    overflow: hidden;
    left: 50%;
    background: var(--dialog-bg-color);
    transform: translateX(-50%);
    border-radius: 3px;
    box-shadow: var(--dialog-box-shadow);
    font-size: inherit;
    min-width: 50%;
    z-index: 1000;
  
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
  