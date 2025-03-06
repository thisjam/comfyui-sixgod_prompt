<!--
 * @Author: Six_God_K
 * @Date: 2025-02-22 19:36:34
 * @LastEditors: Six_God_K
 * @LastEditTime: 2025-03-06 12:44:25
 * @FilePath: \comfyui-sixgod_prompt\src\components\MainApp.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->

<template>
    <div id="six_god_k">
        <div class="mainApp" v-show="openWindow" :data-them="currentThem" ref="refMainApp">
            <div class="sixgod-container">
                <div class="main-head">
                    <div>
                        <!-- <button class="btn">同步数据</button>
                        <button class="btn">设置</button> -->
                        <Settings></Settings>
                    </div>
                    <div><span @click="changThem(item)" class="color" v-for="item, index in themCssArr" :key="index"
                            :style="{ background: item.bgcolor }"></span></div>
                    <div class="onoff" @click="closeUI">X</div>
                </div>
                <Home v-if="isDataReady"></Home>
            </div>
        </div>
    </div>

</template>

<script setup>
import { onMounted, ref, provide, computed } from 'vue'
import Home from './Home.vue';
import Settings from './PromptRender/Settings.vue';
import eventBus from '../utils/eventBus';
let currentThem = ref('');
let refMainApp = ref(null);
let themCssArr = [
    { cssThem: 'default', bgcolor: '#f97316' },
    { cssThem: 'pink', bgcolor: '#E06C75' },
    { cssThem: 'blue', bgcolor: '#5DADE2' },
    { cssThem: 'green', bgcolor: '#238636' },
    { cssThem: 'yellow', bgcolor: '#FF9800' },
]
let openWindow = ref(false);
let isDataReady = ref(false);
const currentTextareaDom = ref(null);
const textareaPromptsList = ref([]);
const JsonData = ref(null);

//静态注册
function initializeTextareas() {
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(textarea => {
        addTextareaEvents(textarea);
    });
}

const currentId = ref(''); //当前textareaid


const c_textareaPromptsList = computed(() => {
    return textareaPromptsList.value.find(item => item.id === currentId.value)
})



function addTripleClickHandler(element, delay = 500) {
    let clicks = 0;
    let timeout;

    element.addEventListener('click', (event) => {
        clicks++; // 增加点击计数

        if (clicks === 1) {
            timeout = setTimeout(() => {
                // 如果在指定延迟内没有达到三次点击，则重置计数器
                if (clicks < 3) {
                    clicks = 0;
                }
            }, delay);
        }

        if (clicks === 3) {
            // 清除定时器
            clearTimeout(timeout);
            // 执行三击事件处理器
            // callback.call(this, event);
            bindFocusBlurEvents(element);
            // 重置点击计数器
            clicks = 0;
        }
    });
}
function addDbClickkHandler(textarea) {
    textarea.addEventListener('dblclick', (e) => {
        bindFocusBlurEvents(textarea);
    });
}

function bindFocusBlurEvents(textarea) {

    if (!textarea.dataset.focusId) {
        let uid = getuuid();
        textarea.dataset.focusId = uid;
    }
    currentId.value = textarea.dataset.focusId;
    if (!textareaPromptsList.value.find(item => item.id == currentId.value)) {
        textareaPromptsList.value.push({
            id: currentId.value,
            promptInfo: textarea.value ? [{
                "active": true,
                "state": "enable",
                "cn": textarea.value,
                "en": textarea.value,
                "w": 1,
            }] : [],
        })
        
    }
    addBorder(textarea);
    openWindow.value = true;
    currentTextareaDom.value = textarea;
    eventBus.emit('loadTextareaData', c_textareaPromptsList.value);

}

function addBorder(textarea) {
    let settings = JSON.parse(localStorage.getItem('transObj'));
    if (settings?.isshowBorder)
        textarea.style.border = `${settings.borderWidth}px solid ${settings.borderColor}`;
    else{
        textarea.style.border = `1px solid #1dcb10`;
    }
}

function addTextareaEvents(textarea) {
    setTimeout(() => {
        if (textareaPromptsList.value.find(item => item.id == textarea.dataset.focusId)) {
            addBorder(textarea);
        }
        let settings = JSON.parse(localStorage.getItem('transObj'))
        let isdbClick = settings?.isdbClick||true;
        if (isdbClick) {
            addDbClickkHandler(textarea);
        } else {
            addTripleClickHandler(textarea);
        }

    }, 200)


}








//动态注册
function registerDynimicTextAreaFocus() {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    if (node.tagName.toLowerCase() === 'textarea') {
                        // bindFocusBlurEvents(node); // 为新添加的 textarea 绑定事件
                        // addTripleClickHandler(node, bindFocusBlurEvents)
                        addTextareaEvents(node);
                    }

                }
            })
        })
    })


    observer.observe(document.body, {
        childList: true,
        subtree: true,
    })


}


let idCount = 0;
function loadRemoteJsonFile() {
    fetch('api/sixgod/getJsonFiles').then(res => res.json()).then(data => {

        let formateJsonData = formatPromptData(JSON.parse(data));
        JsonData.value = formateJsonData
        isDataReady.value = true;
    })

}
provide('formateJsonData', computed(() => JsonData.value));

function loadJsonFile() {
    // 假设你的 JSON 文件位于 src/yours/ 目录下
    const importJsonFiles = import.meta.glob('../../json/*.json', { eager: true });
    const jsonData = {};

    // 遍历并加载所有 JSON 文件
    for (const path in importJsonFiles) {
        const module = importJsonFiles[path]; // 如果使用 eager，这里已经是解析后的模块
        const fileName = path.match(/[^/]+(?=\.json$)/)[0]; // 提取 .json 前的部分
        jsonData[fileName] = module.default;
        // console.log(`Loaded ${fileName}:`, module.default);
    }

    isDataReady.value = true;
    const formateJsonData = formatPromptData(jsonData);

    provide('formateJsonData', formateJsonData);

}


function formatPromptData(obj, navArr = [], categoryArr = [], btnArr = [], level = 1, fristKey = '', categoryName = '') {
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            const value = obj[key];
            if (typeof value === 'object' && value !== null) {
                if (level == 1) {
                    fristKey = key
                    navArr.push({
                        SelectedChildIds: [],
                        navName: key,
                    })
                }
                if (level == 2) {
                    categoryName = key
                    categoryArr.push({
                        navName: fristKey,
                        title: key,
                    })
                }
                formatPromptData(value, navArr, categoryArr, btnArr, level + 1, fristKey, categoryName)
            } else {
                idCount++
                btnArr.push({
                    active: false,//激活标识
                    state: 'enable',//启用标识
                    cn: key,
                    en: value,
                    navName: fristKey,
                    id: idCount,
                    w: 1,
                    categoryName: categoryName//组件遍历时使用
                })
            }
        }
    }
    return { navArr, categoryArr, btnArr }
}

function getuuid(length = 32, useHyphens = true) {
    // 检查长度是否合法
    if (length < 1 || length > 128) {
        throw new Error('Length must be between 1 and 128.');
    }

    const segments = [];
    let currentLength = 0;

    // 定义每个段的默认长度（如果启用连字符）
    const segmentLengths = [8, 4, 4, 4, 12]; // 标准 UUID 的分段长度

    if (useHyphens) {
        // 如果启用连字符，按标准分段生成
        for (let i = 0; i < segmentLengths.length && currentLength < length; i++) {
            const segmentLen = Math.min(segmentLengths[i], length - currentLength);
            const segment = Array.from({ length: segmentLen }, () =>
                Math.floor(Math.random() * 16).toString(16)
            ).join('');
            segments.push(segment);
            currentLength += segmentLen;
        }
    } else {
        // 如果不启用连字符，直接生成指定长度的字符串
        segments.push(
            Array.from({ length }, () => Math.floor(Math.random() * 16).toString(16)).join('')
        );
    }

    // 如果总长度不足，补充剩余部分
    if (currentLength < length) {
        const remaining = Array.from({ length: length - currentLength }, () =>
            Math.floor(Math.random() * 16).toString(16)
        ).join('');
        segments.push(remaining);
    }

    // 返回结果
    return segments.join(useHyphens ? '-' : '');
}

function closeUI() {
    openWindow.value = false;
    eventBus.emit('closeUI');

}
function changThem(item) {
    currentThem.value = item.cssThem;
    refMainApp.value.dataset.datathem = item.cssThem
    window.localStorage.setItem('currentThem', item.cssThem)
}

function saveAllPromptsData() {
    localStorage.setItem('six-promptsData', JSON.stringify(textareaPromptsList.value));
}

function loadAllPromptsData() {
    localStorage.getItem('six-promptsData') ? textareaPromptsList.value = JSON.parse(localStorage.getItem('six-promptsData')) : textareaPromptsList.value = [];

}

function initEsc() {
    document.addEventListener('keydown', function (event) {
        if (event.key.toLowerCase() == 'escape') {
            closeUI();
        }
    })
}
onMounted(() => {
    currentThem.value = window.localStorage.getItem('currentThem') || 'default'
    initEsc();
    loadAllPromptsData();
    initializeTextareas();
    registerDynimicTextAreaFocus();
    loadRemoteJsonFile();
    // loadJsonFile();
    eventBus.on('updatePrompt', (data) => {
        if (currentTextareaDom.value) {
            currentTextareaDom.value.value = data.txt;
        }
        textareaPromptsList.value.find(item => item.id == currentId.value).promptInfo = data.promptInfo;
        saveAllPromptsData();
    })
    eventBus.on("deleteAllPrompt", () => {
        textareaPromptsList.value.find(item => item.id == currentId.value).promptInfo = [];
    })

})
</script>

<style lang="scss" scoped>
.main-head {
    text-align: center;
    padding: 15px;
    display: flex;
    justify-content: space-between;
}

.color {
    width: 30px;
    height: 30px;
    display: inline-block;
    border-radius: 50%;
    cursor: pointer;
    margin: 0 3px;
}

.onoff {
    font-size: 20px;
    cursor: pointer;
    width: 20px;
    height: 20px;
    line-height: 20px;
    padding: 5px;

    &:hover {
        color: rgb(196, 4, 4);
        font-weight: bold;
    }
}
</style>