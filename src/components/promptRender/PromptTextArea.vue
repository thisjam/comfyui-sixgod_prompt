<!--
 * @Author: Six_God_K
 * @Date: 2025-02-22 19:29:19
 * @LastEditors: Six_God_K
 * @LastEditTime: 2025-03-03 13:56:36
 * @FilePath: \vue\comfy_newprompt\src\components\PromptRender\PromptTextArea.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<!-- 监听提示词 -->
<template>
    <div>
        <textarea  @compositionstart="handleCompositionStart" @compositionend="handleCompositionEnd"
            @input="handleInput" ref="Reftextarea" class="textarea-prompt sixgod-maintextarea" v-model="textareaValue"
            @keydown="handleKeydown"  placeholder="支持中文 Prompt"></textarea>
        {{ textareaPromptsData }}

        <DraggableList v-model:promptlist="promptInfoArr" v-model:textareaDom="Reftextarea"></DraggableList>
    </div>
</template>

<script setup>
import { nextTick, inject, onMounted, ref, watch } from 'vue'
import eventBus from '../../utils/eventBus';
import DraggableList from './DraggableList.vue';
const textareaPromptsData = ref('')

const isComposing = ref(false);
let textareaValue = ref('')
let separator = ref('\u200B')
const Reftextarea = ref(null)
const promptInfoArr = ref([])
// [{
//         "active": true,
//         "state": "enable",
//         "cn": "简单起手",
//         "en": "best quality,masterpiece",
//         "navName": "01起手式",
//         "id": "25421c78-4038-dfa0-ad09-b49c41de468e",
//         "w": 1,
//         "categoryName": "正面起手"
// }]

 
function handleKeydown(event) {
    if (event.key !== 'Tab')  return
    event.preventDefault();
  
    let arr = textareaValue.value.split(separator.value).filter(item => item.trim() !== "");
    if (arr.length === promptInfoArr.value.length) {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] != promptInfoArr.value[i].en) {
                break;
            }
        }
    }

    eventBus.emit('deleteAllPrompt')
    arr = arr.map(item => {
        return item.replace(/^[,，]+|[,，]+$/g, ""); // 去除开头和结尾的逗号
    });

    arr.forEach(item => {
        promptInfoArr.value.push({
            "active": true,
            "state": "enable",
            "cn": item,
            "en": item,
            "w": 1,
        });
    });
    // getEnablePrompt();

};

function deleteAllPromptHandle() {
    promptInfoArr.value = []
    // getEnablePrompt()

}

// 处理 compositionstart 事件（输入法开始组合输入）
function handleCompositionStart() {
    isComposing.value = true;
}

// 处理 compositionend 事件（输入法结束组合输入）
function handleCompositionEnd(event) {
    isComposing.value = false;
    nextTick(() => {
        handleInput(event); // 确认输入后执行逻辑
    });
}
function handleInput(event) {
    if (isComposing.value) return; // 忽略组合输入阶段

    const target = event.target;
    const oldValue = target.value;

    // 获取光标位置前后的字符
    const start = target.selectionStart;

    // 检查光标前一个字符是否为中英文逗号
    if (start > 0 && isComma(oldValue[start - 1])) {
        const newValue =
            oldValue.slice(0, start - 1) + // 光标前的部分（去掉最后一个逗号）
            oldValue[start - 1] + separator.value + // 插入逗号和零宽空格
            oldValue.slice(start); // 光标后的部分

        if (newValue !== oldValue) {
            target.value = newValue;

            // 计算光标偏移量
            const offset = 1; // 零宽空格的长度

            // 设置新光标位置
            nextTick(() => {
                target.setSelectionRange(start + offset, start + offset);
            });
        }
    }
}
// 判断字符是否为中英文逗号
function isComma(char) {
    return char === "," || char === "，"; // 英文逗号或中文逗号
}
function getEnablePrompt() {
    const items = promptInfoArr.value; // 缓存数组
    const sep = separator.value; // 缓存分隔符
    const enabledItems = items.filter(item => item.state === 'enable');
    const en_text = enabledItems.map(item => item.en).join(sep + ',');
    textareaValue.value = en_text;
}


function InputPromptHandle(data) {
    const existingItemIndex = promptInfoArr.value.findIndex(item => item.id === data.id);
    if (existingItemIndex !== -1) {
        promptInfoArr.value.splice(existingItemIndex, 1);
    } else {
        promptInfoArr.value.push(data);
    }
    // getEnablePrompt();
}

watch(
    () => [...promptInfoArr.value], // 深拷贝数组以确保监听到内部变化
    (newValue, oldValue) => {
        getEnablePrompt();
    },
    { deep: true } // 开启深度监听
);
onMounted(() => {
    eventBus.on('InputPrompt', (data) => {
        InputPromptHandle(data);
    })
    eventBus.on("deleteAllPrompt", () => {
        deleteAllPromptHandle()
    })
    eventBus.on("closeUI", () => {
        eventBus.emit('updatePrompt', { txt: textareaValue.value, promptInfo: promptInfoArr.value });
    })
    eventBus.on("loadTextareaData", (data) => {
        promptInfoArr.value = data.promptInfo


    })
})
</script>

<style lang="scss" scoped>
textarea {
    width: 100%;
    min-height: 6em;
    max-height: 10em;
    border-radius: 5px;
    background: var(--textarea-prompt-bg-color);
    border: 1px solid var(--textarea-prompt-border-color);
    font-size: 1em;
    color: inherit;
    box-sizing: border-box;
    line-height: 1.3em;
    padding: 10px;

}

textarea:focus {
    outline: none;
    border: 1px solid var(--textarea-prompt-focus-border-color);

}

.textarea-prompt {
    resize: none;
    margin: .5em 0;
}
</style>
