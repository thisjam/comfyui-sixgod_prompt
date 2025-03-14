<!-- 监听提示词 -->
<template>
    <div>
        <!-- 导航 -->
        <div class="nav-menu" ref="refNavMenu">
            <div class="tags" v-for="(item, index) in navArr" :key="index" @click="toggelNavActive(index)"
                :class="{ 'active': nav_activeIndex == index, 'nav-selected': item.SelectedChildIds.length > 0 }">
                {{ item.navName }}
            </div>
        </div>

        <div class="prompt-list" v-if="navArr.length">

            <template v-for="(val, index) in categoryArr">
                <div class="prompt-category" v-if="navArr[nav_activeIndex].navName == val.navName">
                    <div class="prompt-category-title" @click="getCategoryPrompts(val.title)"> {{ val.title }}</div>
                    <div class="prompt-btn-container">
                        <!-- 按分类显示的按钮 -->
                        <template v-for="item, index in promptData" :key="item.id">
                            <Tips :content="item.en" v-if="item.categoryName == val.title">
                                <span :class="[item.active ? 'active' : '']" class="prompt-btn" @click="btnClick(item)">
                                    {{ item.cn }}
                                </span>
                            </Tips>
                        </template>


                    </div>

                </div>
            </template>
        </div>
    </div>
</template>

<script setup>
import { onMounted, inject, ref, provide, reactive } from 'vue'
import eventBus from '../../utils/eventBus';
import Tips from './Tips.vue';


const refNavMenu = ref(null);
const formateJsonData = inject('formateJsonData', {});

const nav_activeIndex = ref(0);
const promptData = ref([]);
const navArr = ref([]);//导航数组信息包含navName、SelectedChildIds
// [{ "SelectedChildIds": ["25421c78-4038-dfa0-ad09-b49c41de468e"], "navName": "01起手式" },
// { "SelectedChildIds": [], "navName": "02人物" },
// { "SelectedChildIds": [], "navName": "03服饰" },
// { "SelectedChildIds": [], "navName": "04人物发型" },
// { "SelectedChildIds": [], "navName": "05动作" },
// { "SelectedChildIds": [], "navName": "06面部表情" },
// { "SelectedChildIds": [], "navName": "动物装饰" },
// { "SelectedChildIds": [], "navName": "场景道具" },
// { "SelectedChildIds": [], "navName": "抽卡机" },
// { "SelectedChildIds": [], "navName": "新服饰" },
// { "SelectedChildIds": [], "navName": "景观" },
// { "SelectedChildIds": [], "navName": "艺术、魔法" },
// { "SelectedChildIds": [], "navName": "颜色" }]
const categoryArr = ref(formateJsonData.value.categoryArr);
// [{ "navName": "01起手式", "title": "正面起手" },
//  { "navName": "01起手式", "title": "负面起手" },
//  ...
// ]




const customRondomPrompts = ref([]);
const isOpenCustomRondomPrompt = ref(false);


function moveToContainer() {
    let parentContainer = document.querySelector('.float-left');
    if (refNavMenu.value && parentContainer) {
        parentContainer.appendChild(refNavMenu.value);

    }
}



//点击词库按钮
function btnClick(item) {
    if (isOpenCustomRondomPrompt.value) {
        //随机词库
        getBtnPrompts(item);
    }
    else
        eventBus.emit('InputPrompt', item);
}

function deleteAllPromptHandle() {
    navArr.value.forEach(item => {
        item.SelectedChildIds = [];
    })
    promptData.value.forEach(item => {
        item.active = false;
    })


}


function InputPromptHandle(item) {
    // item可能是其他页面的不响应数据，所以要主动查找
    if (!item.navName) return;//不是导航里面的词库
    let btnData = promptData.value.find(btn => btn.id == item.id)
    btnData.active = !btnData.active;
    let navName = item.navName;
    let id = item.id;
    let result = navArr.value.find(item => item.navName === navName);
    let array = result.SelectedChildIds;
    //切换导航选中样式
    array.includes(id) ? array.splice(array.indexOf(id), 1) : array.push(id);

}





function toggelNavActive(index) {
    nav_activeIndex.value = index;
}



// function initNavActiveArr(navarr) {
//     arr_navAcive.value = Array.from({ length: Object.keys(navarr).length }, (_, index) => index === 0);
// }
//随机词库按钮
function getBtnPrompts(item) {

    customRondomPrompts.value.push({
        en: item.en,
        cn: item.cn
    })
    eventBus.emit('inputCategoryPrompts', customRondomPrompts.value);

}
//随机词库标题
function getCategoryPrompts(categoryName) {
    if (!isOpenCustomRondomPrompt.value) return;
    let arr = promptData.value.filter(item => item.categoryName == categoryName);
    let en_prompts = arr.map(item => item.en).join(',');

    customRondomPrompts.value.push({
        en: en_prompts,
        cn: categoryName
    })
    eventBus.emit('inputCategoryPrompts', customRondomPrompts.value);
}

function initAllData() {

  
    if (!formateJsonData.value.btnArr) return;
    if (!formateJsonData.value.navArr) return;
  
    promptData.value = JSON.parse(JSON.stringify(formateJsonData.value.btnArr));
    navArr.value = JSON.parse(JSON.stringify(formateJsonData.value.navArr));


}

function loadTextareaDataHandel(data) {

    initAllData();
    if (data.promptInfo.length <= 0) return

    let activePromptArr = data.promptInfo.filter(item => item.active);
    let activeIdsArr = activePromptArr.map(item => item.id);

    promptData.value.forEach(item => {
        if (activeIdsArr.includes(item.id)) {
            item.active = true; // 直接修改原数组中的 active 属性

        }
    });


    for (let i = 0; i < activePromptArr.length; i++) {
        for (let j = 0; j < navArr.value.length; j++) {
            if (activePromptArr[i].navName == navArr.value[j].navName) {
                navArr.value[j].SelectedChildIds.push(activePromptArr[i].id)
            }

        }
    }

}

// 调用函数
onMounted(() => {



    moveToContainer();

    eventBus.on("InputPrompt", (data) => {
        InputPromptHandle(data)
    })
    eventBus.on("deleteAllPrompt", () => {
        deleteAllPromptHandle()
    })
    eventBus.on("openCustomRondomPrompt", (isOpen) => {
        isOpenCustomRondomPrompt.value = isOpen;
    })
    eventBus.on("clearCustomRondomPrompt", () => {
        customRondomPrompts.value = [];
    })
    eventBus.on("loadTextareaData", (data) => {
        loadTextareaDataHandel(data)

    })

})
</script>

<style lang="scss" scoped>
.nav-menu {

    display: flex;
    margin-top: 2em;
    box-shadow: var(--navtag-shadow);
    background-color: var(--navtag-bg-color);
    color: var(--navtag-text-color);


}

.nav-selected {
    position: relative;

    &::after {
        position: absolute;
        content: '';
        display: block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--navtag-prompt-selected-color);
        right: 3px;
        top: 50%;
        transform: translateY(-50%);
    }
}

.nav-menu .tags {
    padding: 1em;
    cursor: pointer;
}

.nav-menu .active {
    background: var(--navtag-active-bg-color);
    color: var(--navtag-active-text-color);
    font-weight: bolder;
}

.prompt-list {
    display: grid;
    justify-content: space-between;
    grid-template-columns: repeat(auto-fit, minmax(30%, 1fr));
    grid-auto-rows: minmax(200px, auto);
    gap: 15px;
    box-sizing: border-box;
}

.prompt-btn-container {
    margin-block: 0.5em;
}

.prompt-category {
    border: 1px solid white;
    padding: 0.5em;
    border-radius: 3px;
    height: 100%;
    box-sizing: border-box;
}

.prompt-category-title {
    background-color: var(--menu-prompt-bg-color);
    text-align: center;
    padding-block: 0.5em;
    border-radius: 5px;
    cursor: pointer;
    color: var(--menu-prompt-text-color)
}



.prompt-btn {
    display: inline-block;
    padding: 3px;
    margin: 3px;
    border-radius: 5px;
    background-color: var(--btn-prompt-bg-color);
    cursor: pointer;
    width: fit-content;
    color: var(--btn-prompt-text-color);
    position: relative;

    &.active {
        background: var(--btn-prompt-active-bg-color);
        color: var(--btn-prompt-active-text-color);
    }
}
</style>
