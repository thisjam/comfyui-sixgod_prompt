<!--
 * @Author: Six_God_K
 * @Date: 2025-02-27 11:18:33
 * @LastEditors: Six_God_K
 * @LastEditTime: 2025-03-03 21:28:02
 * @FilePath: \vue\comfy_newprompt\src\components\PromptRender\Favorites.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<template>
    <div>
        <button class="btn" @click="isshow = !isshow">收藏夹</button>
        <Dialog class="favorites" v-model="isshow">
            <template v-slot:head>
                <div>收藏夹</div>
                <div><input v-model="searchWord" type="text" @keydown.enter="search">
                    <button @click="searchList = []; searchWord = ''">取消</button>
                    <button @click="search">查找</button>
                </div>
                <div>
                    <button class="btn" @click="addPromptToFavorites">收藏</button>
                    <button class="btn" @click="deleteAll">全部删除</button>
                    <button class="btn" @click="isShowCategoryManager = !isShowCategoryManager">分类管理</button>
                    <button class="btn" @click="backups">备份收藏</button>
                    <button class="btn" @click="restore">导入收藏</button>
                    <button class="btn" @click="save">保存</button>
                </div>
            </template>


            <template v-slot:content>
                <div class="favorites-list">
                    <Tabs v-model="activeTabIndex" style="padding: 10px;">
                        <TabItem v-for="(categor, categorIndex) in categoryList" :index="categorIndex" :key="categor.id"
                            :title="categor.title">
                            <template v-for="(item, index) in c_sortedList" :key="index">
                                <template v-if="item.categoryId == categor.id || categor.id == 666">
                                    <div class="favorites-item">
                                        <div class="tit">
                                            <input v-show="item.editTitle" v-model="item.title"
                                                @blur="item.editTitle = false">
                                            <div v-show="!item.editTitle" @dblclick="openEditMode(item, true, $event)">
                                                {{ item.title }}
                                            </div>
                                        </div>
                                        <div class="con">
                                            <textarea v-show="item.editContent" v-model="item.content"
                                                @blur="item.editContent = false">  </textarea>
                                            <div :title="item.content" v-show="!item.editContent"
                                                @dblclick="openEditMode(item, false, $event)"> {{
                                                    item.content }}
                                            </div>

                                        </div>
                                        <div class="opera">
                                            <button class="btn" @click="inputToJSonList(item)">导</button>
                                            <button class="btn" @click="SetorderIndex(index, item)">排</button>
                                            <button class="btn" @click="deleteItem(index)">删</button>
                                        </div>
                                    </div>

                                </template>
                            </template>
                        </TabItem>
                    </Tabs>
                </div>
            </template>


        </Dialog>

        <CategoryManager v-model:favoritesPrivewList="favoritesPrivewList" v-model:isshow="isShowCategoryManager"
            v-model:categoryList="categoryList" title="分类管理" addtitle="添加分类"></CategoryManager>

    </div>
</template>

<script setup>
import { onMounted, nextTick, ref, inject, computed, reactive } from 'vue'
import Dialog from "./Dialog.vue"
import eventBus from '../../utils/eventBus'
import Tabs from './Tabs.vue'
import TabItem from './TabItem.vue'
import CategoryManager from './CategoryManager.vue'
const common = inject('common')
const isshow = ref(false)
const isShowCategoryManager = ref(false)
const searchWord = ref('')
const activeTabIndex = ref(0)
// const tempData = {
//     title: 'title',
//     content: 'content',
//     orderIndex: 0,
//     editTitle: false,
//     editContent: false
// }
const favoritesPrivewList = ref([])
const categoryList = ref([])
const searchList = ref([])

// function needCategory() {
//     eventBus.emit('needCategory')
// }



function openEditMode(item, istit, event) {
    istit ? item.editTitle = true : item.editContent = true
    nextTick(() => {
        event.target.previousElementSibling.focus();
    });
}




function SetorderIndex(index, item) {
    let userInput = window.prompt("请输入一个排序数字，越大越靠前", item.orderIndex);
    let number = Number(userInput)
    if (number) {
        favoritesPrivewList.value[index].orderIndex = number

    }
}


function inputToJSonList(item) {

    let data =
    {
        cn: item.title,
        en: item.content,
        state: 'enable',
        w: 1,
        id: common.getuuid()

    }

    eventBus.emit('InputPrompt', data)


}

const c_sortedList = computed(() => {
    let arr = searchList.value.length ? searchList.value : favoritesPrivewList.value;
    return arr.sort((a, b) => b.orderIndex - a.orderIndex);
});

function deleteItem(index) {
    if (confirm('确定要删除吗？')) {
        favoritesPrivewList.value.splice(index, 1);
    }
}
function deleteAll() {
    if (confirm('确定要删除吗？')) {
        favoritesPrivewList.value.splice(0, favoritesPrivewList.value.length);
    }
}

function backups() {
    if (!favoritesPrivewList.value.length) {
        alert('收藏夹没有数据！')
        return
    }
    let data = { fp: favoritesPrivewList.value, fcp: categoryList.value };
    let dataString = JSON.stringify(data);
    let blob = new Blob([dataString], { type: 'application/json' });
    let url = URL.createObjectURL(blob);
    let link = document.createElement('a');
    link.href = url;
    link.download = '收藏.txt';
    link.click();
    URL.revokeObjectURL(url);
}

function restore() {
    let input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt';
    // 文件选择改变时的处理函数
    input.onchange = function (e) {
        let file = e.target.files[0];
        if (!file) {
            alert('没有选择文件');
            return;
        }
        let reader = new FileReader();
        // 文件读取完成后的回调函数
        reader.onload = function (e) {
            let errmsg = "不是收藏夹格式文件"
            try {
                // 尝试解析文件内容为JSON对象
                let data = JSON.parse(e.target.result);
                if (!data.fp || !data.fcp) {
                    throw new Error(errmsg);
                }
                favoritesPrivewList.value = data.fp;
                categoryList.value = data.fcp;
                alert('操作成功，记得点击保存！');
            } catch (error) {
                console.error('解析JSON字符串时发生错误:', error.message);
                alert(errmsg);
            }
        };
        // 文件读取出错时的回调函数
        reader.onerror = function (error) {
            console.error('读取文件时发生错误:', error);
            alert('读取文件失败');
        };
        // 开始读取文件内容
        reader.readAsText(file, 'utf-8');
    };

    // 触发文件选择对话框
    input.click();
}


function addPromptToFavorites() {

    let textareaEle = document.querySelector('.sixgod-maintextarea')
    if (!textareaEle || !textareaEle.value) return
    let userInput = window.prompt("请输入标题:", "");
    if (userInput !== null) {
        favoritesPrivewList.value.push({
            title: userInput,
            content: textareaEle.value,
            orderIndex: 0,
            editTitle: false,
            editContent: false,
            categoryName: categoryList.value[activeTabIndex.value].title,
            categoryId: categoryList.value[activeTabIndex.value].id
        })

    }

}

function save() {
    localStorage.setItem('fp', JSON.stringify(favoritesPrivewList.value));
    alert('保存成功');
}

function search() {

    const set = new Set();
    if (searchWord.value) {
        let searchTitle = favoritesPrivewList.value.filter(item => item.title.includes(searchWord.value))
        let searchContent = favoritesPrivewList.value.filter(item => item.content.includes(searchWord.value))
        searchTitle.forEach(item => set.add(item));
        searchContent.forEach(item => set.add(item));
        searchList.value = Array.from(set);
    } else {
        searchList.value = [...set]
    }

}
const systemCategory = ref({
    title: '全部',
    orderIndex: -1,
    editTitle: false,
    id: 666,

})
function loadFavorites() {
    favoritesPrivewList.value = localStorage.getItem('fp') ? JSON.parse(localStorage.getItem('fp')) : [];
    categoryList.value = localStorage.getItem('fcp') ? JSON.parse(localStorage.getItem('fcp')) : [];
    categoryList.value.find((item) => item.id == 666) || categoryList.value.push(systemCategory.value)

}


onMounted(() => {

    loadFavorites();
    // setTimeout(() => {
    //     needCategory();
    // }, 200);
    // eventBus.on('sendCategory', (arr) => {
    //     categoryList.value = arr;
    // })

})
</script>

<style lang="scss" scoped>
.favorites-list {
    height: 600px;
    // padding: 100px;
    overflow-y: scroll;

    &::-webkit-scrollbar {
        width: 2px;
    }

    &::-webkit-scrollbar-track {
        background-color: var(--scrollbar-track-bg-color);

        /* 设置滚动条轨道的颜色 */
    }

    &::-webkit-scrollbar-thumb {
        background-color: var(--scrollbar-thumb-bg-color);
        /* 设置滚动条滑块（thumb）的颜色 */
        border-radius: 5px;

    }
}


.favorites-item {
    box-sizing: border-box;
    display: grid;
    align-items: center;
    align-content: center;
    grid-template-columns: 2fr 8fr 3fr;
    padding-block: 10px;
    padding-inline: 20px;



    border-bottom: 1px solid var(--favorite-row-bottom-border-color);

    &:hover {
        background: var(--favorite-row-hover-bg-color);
    }

    input {
        width: 80%;
        height: 30px;
    }

    textarea {
        width: 100%;
        height: 50px;
        font-size: 1em;
    }

    .con,
    .tit {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

    }

    .con div,
    .tit div {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

    }

    .opera {
        text-align: right;
    }

}
</style>
