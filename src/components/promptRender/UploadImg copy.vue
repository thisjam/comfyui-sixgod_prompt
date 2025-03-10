<template>

    <div v-show="isshow" class="upload-img-component">

        <div class="upload-container" @dragover.prevent @drop="handleDrop">
            <div v-if="imageUrl" class="image-preview" @click="isshowfullPreview = true">
                <img :src="imageUrl" alt="Uploaded Image" />
                <a class="close-button" @click="clearImage">x</a>
            </div>
            <div v-else class="upload-prompt" @click="triggerFileInput">
                将图片拖到这里上传或点击选择图片
            </div>
            <Loading v-model="isshowLoading"></Loading>
            <input type="file" ref="refFileInput" @change="handleFileChange" style="display:none" />
        </div>

    </div>

    <div v-if="imageUrl && isshowfullPreview" class="full-image-preview" v-autoDrag v-resizable>
        <div class="close-full-preview" @click="isshowfullPreview = false">X</div>
        <img :src="imageUrl" alt="Uploaded Image" />
    </div>


</template>

<script setup>
import { ref } from 'vue';
import Loading from './Loading.vue';
import eventBus from '../../utils/eventBus'

const isshow = defineModel(false);// 显示上传框
const imageUrl = ref(null);
const refFileInput = ref(null);
const cachedFile = ref(null);
const imgDesc = ref(null);
const isshowfullPreview = ref(false);
const isshowLoading = ref(false);


// 处理文件选择
const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
        cacheImage(file);
        sendToBackend();
    } else {
        alert('请选择一个有效的图片文件');
    }
};

// 处理拖拽
const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        cacheImage(file);
        sendToBackend();
    } else {
        alert('请拖拽一个有效的图片文件');
    }
};

// 缓存图片并显示预览
const cacheImage = (file) => {
    // 预览图片
    imageUrl.value = URL.createObjectURL(file);
    // 缓存文件
    cachedFile.value = file;
};

// 发送图片到后端
const sendToBackend = async () => {
    if (!cachedFile.value) {
        console.error('没有可上传的图片');
        return;
    }

    const formData = new FormData();
    formData.append('image', cachedFile.value);
    let url = "/api/sixgod/img2txt"
    try {
        isshowLoading.value = true;
        const response = await fetch(url, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json(); // 返回响应中的JSON数据
        // imgDesc.value = data;
        sendImgPrompt(data);
        console.log(data)
        isshowLoading.value = false;
        // console.log(data['<MORE_DETAILED_CAPTION>'])
    } catch (error) {
        console.error('请求失败:', error);
        isshowLoading.value = false;
        alert('请求失败');
    }
};

function sendImgPrompt(promptObj) {
    eventBus.emit('deleteAllPrompt');
    let sendPrompt = {
        "active": true,
        "state": "enable",
        "en": promptObj.en,
        "cn":  promptObj.cn,
        "w": 1,
    }
    eventBus.emit('InputPrompt', sendPrompt)
    eventBus.emit('sendPrePrompt', promptObj.cn)

}

// 触发文件选择框
const triggerFileInput = () => {
    refFileInput.value.click();
};

// 清除图片和缓存
const clearImage = (e) => {
    e.stopPropagation();

    imageUrl.value = null;
    clearCachedFile();
};

// 清除缓存的文件
const clearCachedFile = () => {
    cachedFile.value = null;
};
</script>

<style scoped>
.upload-img-component {
    position: relative;
}

.upload-container {
    width: 100%;
    height: 100px;
    border: 1px dashed #ccc;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    left: 0;
}

.image-preview {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    cursor: pointer;
}

.image-preview img {
    max-width: 100%;
    max-height: 100%;
}

.close-button {

    border: none;
    cursor: pointer;
    font-size: 2em;
    padding: 5px;
    position: absolute;
    top: 0;
    right: 5px;

    &:hover {
        color: red;

    }
}

.upload-prompt {
    color: #999;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

}

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

}
</style>