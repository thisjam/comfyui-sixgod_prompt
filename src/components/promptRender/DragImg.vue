<!--DragImg
 * @Author: Six_God_K
 * @Date: 2025-03-14 20:28:15
 * @LastEditors: Six_God_K
 * @LastEditTime: 2025-03-14 20:31:17
 * @FilePath: \comfyui-sixgod_prompt\src\components\promptRender\DragImg.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<template>
    <div v-if="data.imageUrl && data.isshow" v-autoDrag v-resizable class="full-image-preview">
        <div class="close-full-preview" @click="data.isshow = false">X</div>
        <img :src="data.imageUrl" />
    </div>
</template>

<script setup>
import { onMounted ,onUnmounted} from 'vue'

const data = defineModel(
    {
        imageUrl: '',
        isshow: false
    }
);
 
 
</script>

<style lang="scss" scoped>
.full-image-preview {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    justify-content: center;
    align-items: center;
    background-repeat: no-repeat;
    z-index: 9;
}

.full-image-preview img {
    max-width: 100%;
    max-height: 80vh;
}
.close-full-preview {
    position: absolute;
    top: -16px;
    right: -16px;
    border: none;
    cursor: pointer;
    font-size: 1.5em;
    padding: 5px;
    border-radius: 50%;
    background-color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 36px;
    height: 36px;
    z-index: 10;
    color: #a75151;
}
</style>
