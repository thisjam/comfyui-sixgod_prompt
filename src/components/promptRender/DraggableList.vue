<template>
    <div class="draggable-container">
        <textarea ref="refEditTextarea" v-show="editText" type="text" v-model="editText" @blur="finishEdit"> </textarea>

        <span v-show="promptlist.length" :class="{ 'expand-rotate': isShowPromptList }" class="expand-btn"
            @click="isShowPromptList = !isShowPromptList">▲</span>


        <TransitionGroup name="list">
            <template v-for="(item, index) in promptlist" :key="index">
                <!-- @click="editPrompt(index)" 
                @dblclick="toggleEnableState(item)" -->
                <div :data-index="index" v-show="isShowPromptList" draggable="true" @dragstart="dragstart"
                    @dragenter="dragenter" @dragend="dragend" @mouseover="mouseover(item, $event)"
                    @mouseleave="mouseleave" class="drag-item" :class="item.state"
                    @mousedown="handleMouseDown(item, index, $event)"
                    @contextmenu.prevent.stop="deletePrompt(index, item, $event)">
                    <div class="word en"> {{ item.en }}</div>
                    <div class="word cn"> {{ item.cn }}</div>
                    <div class="operation" @click.prevent.stop>
                        <div class="add" @click.stop="changeWeight(item, true)">+</div>
                        <div class="sub" @click.stop="changeWeight(item, false)">-</div>                
                    </div>
                   
                </div>

            </template>
        </TransitionGroup>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import eventBus from '../../utils/eventBus';
// import Tanslator from '@/icons/Tanslator.vue';

const promptlist = defineModel('promptlist', { required: true });
const textareaDom = defineModel('textareaDom', { required: true });
let current_index = -1;
let target_index = -1
let currentDom = ref(null)
let refEditTextarea = ref(null)
let isShowPromptList = ref(true)
let editText = ref('')
let editingIndex = ref(-1)
let isDraging = false


let clickTimeout = ref(null);
let dragDelayTimeout = null; // 拖拽检测延迟计时器
const DOUBLE_CLICK_DELAY = 220; // 双击间隔时间（毫秒）
const DRAG_DELAY = 100; // 拖拽检测延迟计时器


function dragstart(e) {
    isDraging = true;
    // 清除拖拽检测延迟计时器
    if (dragDelayTimeout) {
        clearTimeout(dragDelayTimeout);
        dragDelayTimeout = null;
    }

    setTimeout(() => {
        e.target.classList.add('draging')
    }, 0);
    currentDom.value = e.target;
    current_index = e.target.dataset.index

}
function dragenter(e) {
    if (e.target == currentDom.value) return
    target_index = e.target.dataset.index;
}

function dragend(e) {
    isDraging = false;
    e.target.classList.remove('draging')
    swapItems(promptlist.value, current_index, target_index)

}


// function getDragItemindex(dom) {
//     const children = Array.from(dom.parentNode.children)
//     return children.indexOf(dom);
// }

function swapItems(arr, i, j) {
    if (i !== j && i >= 0 && j >= 0 && i < arr.length && j < arr.length) {

        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
}



function mouseover(item, e) {
    highlightText(textareaDom.value, item.en)
}
function mouseleave(item, e) {
    textareaDom.value.setSelectionRange(0, 0);
}



function highlightText(input, searchText) {
    const startIndex = input.value.indexOf(searchText);
    if (startIndex !== -1) {
        const endIndex = startIndex + searchText.length;
        // 设置选区范围
        input.setSelectionRange(startIndex, endIndex);
        // 将焦点移到textarea上，以便选区可见
        input.focus();
    }

}



function matchWeightPrompt(str, w) {
    // <lora:2Dhx_XianxiaMap_v1.0:1>,
    str = str.replace(/[（（））]/g, ''); // 去除两侧的全角括号
    str = str.replace(/[()]/g, ''); // 去除两侧的半角括号
    let lorastr = str.substr(0, 2);
    let strarr = str.split(':')
    if (lorastr == '<l')
        return `${strarr[0]}:${strarr[1]}:${w.toFixed(1)}>`
    if (w == 1) return strarr[0]
    else return `(${strarr[0]}:${w.toFixed(1)})`

}


function changeWeight(item, isadd) {
    if (isadd) {
        if (item.w >= 1.9) return
        item.w += 0.1
    }
    else {
        if (item.w <= 0.2) return
        item.w -= 0.1
    }
    let en_prompt = matchWeightPrompt(item.en, item.w)
    let cn_prompt = matchWeightPrompt(item.cn, item.w)
    item.en = en_prompt
    item.cn = cn_prompt
}



function deletePrompt(index, item, e) {
    eventBus.emit('InputPrompt', item);
}


function handleMouseDown(item, index, event) {
    if (event.target.closest('.add') || event.target.closest('.sub')) {
      return; // 如果是 .add 或 .sub，则不执行后续逻辑
    }
    if (event.button === 2) {
        return;
    }
    if (isDraging) return;
    dragDelayTimeout = setTimeout(() => {
        if (!isDraging) {
            // 如果没有发生拖拽，则处理单击事件
            handleClick(item, index);
        }
    }, DRAG_DELAY); // 设置拖拽检测延迟时间（例如 200ms）
}

function handleClick(item, index) {
    if (clickTimeout) {
        // 如果存在未完成的单击计时器，说明是双击
        clearTimeout(clickTimeout);
        clickTimeout = null;
        editPrompt(index);
    } else {
        // 否则启动单击计时器
        clickTimeout = setTimeout(() => {
            toggleEnableState(item);
            clickTimeout = null;
        }, DOUBLE_CLICK_DELAY);
    }
}
function toggleEnableState(item) {
    item.state == 'enable' ? item.state = 'disable' : item.state = 'enable';
}

function editPrompt(index) {
    promptlist.value[index].state = 'edit'
    editText.value = promptlist.value[index].en
    editingIndex.value = index
}

function finishEdit() {
    promptlist.value[editingIndex.value].en = editText.value
    promptlist.value[editingIndex.value].state = 'enable';
    editingIndex.value = -1;
    editText.value = ''

}

onMounted(() => {

})
</script>

<style lang="scss" scoped>
.draggable-container {
    display: flex;
    overflow: hidden;
    flex-wrap: wrap;
    position: relative;
    min-height: 20px;
}

textarea {
    width: 60%;
    height: 20em;
    position: fixed;
    background-color: var(--editearea-prompt-bg-color);
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 99;
    color: var(--editearea-prompt-text-color);
    outline: none;
    padding: 1em;

}

textarea:focus {
    border: 1px solid var(--editearea-prompt-border-color);

}



.drag-item.draging {
    background-color: transparent;
    opacity: 0.5;
    border: 1px dashed var(--drag-prompt-draging-border-color);
}


.drag-item {
    cursor: pointer;
    display: flex;
    flex-direction: column;
    border: 1px solid var(--drag-prompt-border-color);
    border-radius: 3px;
    margin: .2em;
    position: relative;
    opacity: .8;
    background: var(--drag-prompt-bg-color);
    font-size: 0.8em;

    .operation {
        position: absolute;
        display: flex;
        flex-direction: column;
        text-align: center;
        right: 0;
        height: 100%;
        width: 1.2em;
        opacity: 0;
        transition: opacity 0.1s ease-in-out;
        // border: 1px solid red;
        /* 添加过渡效果 */


    }

    .add,
    .sub {
        height: 50%;
        display: flex;
        align-items: center;
        justify-content: center
    }

    .add {
        color: var(--add-text-color);
        background: var(--add-bg-color);
        border: 1px solid var(--add-border-color);
    }

    .sub {
        color: var(--sub-text-color);
        background: var(--sub-bg-color);
        border: 1px solid var(--sub-border-color);
    }

    &:hover {
        .operation {
            opacity: 0.8
        }
    }



    /* 允许子元素换行 */
    .word {
        padding: .5em;
        display: inline-block;
        cursor: pointer;
        font-size: 1.1em;
        width: 15em;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        pointer-events: none; //可以静止触发拖拽事件

    }

    .en {
        border-bottom: 0px;
        font-weight: bold;
    }

    .cn {
        border-top: 1px solid var(--drag-prompt-cn-top-border-color);
        opacity: 0.7;

    }


}

.disable {
    text-decoration: line-through;
    background-color: var(--drag-prompt-disable-bg-color);
}

.drag-item.edit {
    visibility: visible;
    box-shadow: var(--drag-prompt-edit-shadow)
}

.expand-btn {
    position: absolute;
    right: 0;
    top: 0;
    font-size: 1em;
    cursor: pointer;
    user-select: none;
    transition: transform 0.3s ease;

}


.expand-btn.expand-rotate {
    transform: rotate(180deg);
}



.list-enter-active,
.list-leave-active {
    transition: all 0.1s ease;
}

.list-enter-from,
.list-leave-to {
    opacity: 0;
    transform: translateX(30px);
}
</style>
