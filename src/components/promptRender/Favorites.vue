<template>

    <Dialog class="favorites"  @closeDialog="closeDialog" v-if="globData.isFaviriteOpen" >
        <template v-slot:head>
            <div>
                <label @click="isPositive = !isPositive" :class="isPositive ? 'active' : ''">正面收藏夹</label>
                <label @click="isPositive = !isPositive" :class="!isPositive ? 'active' : ''">负面收藏夹</label>
            </div>
            <div>
                <button class="btn" @click="addPromptToFavorites(0, $event)">收藏当前正面</button>
                <button class="btn" @click="addPromptToFavorites(1, $event)">收藏当前负面</button>
                <button class="btn" @click="deleteAll">全部删除</button>              
                <button class="btn" @click="backups">备份收藏</button>
                <button class="btn" @click="restore">导入收藏</button>
                <button class="btn" @click="save">保存</button>
            </div>
        </template>
        <template v-slot:content>
            <div class="prompt-list">
                <div class="prompt-item" v-for="item, index in sortedList" :key="index" >
                    <div class="tit">
                        <input v-show="item.editTitle" type="text" v-model="item.title" @blur="item.editTitle = false">
                        <div v-show="!item.editTitle" @dblclick="openEditMode(item, true, $event)"> {{ item.title }}
                        </div>
                    </div>
                    <div class="con">
                        <input v-show="item.editContent" type="text" v-model="item.content"
                            @blur="item.editContent = false">
                        <div v-show="!item.editContent" @dblclick="openEditMode(item, false, $event)"> {{
                    item.content }}
                        </div>
                    </div>
                    <div class="opera">
                        <button @click="inputToJSonList(item)">导</button>
                        <button @click="SetorderIndex(index,item)">排</button>
                        <button @click="deleteItem(index)">删</button>        
                    </div>
                </div>

            </div>


        </template>
 

    </Dialog>

</template>

<script setup>
import { onMounted, nextTick, ref, watchEffect,computed } from 'vue'
import Dialog from "@/components/promptRender/Dialog.vue"

import { globStore } from '@/stores/index.js'

const store = globStore()
const { globData,toggleFaviriteOpen,getPromptObj } = store

let isPositive = ref(true);
let favoritesPrivewList = ref([])
let favoritesPlist = ref([])
let favoritesPNlist = ref([])
let promptObj = ref(null)


const sortedList = computed(() => {
      return favoritesPrivewList.value.sort((a, b) => b.orderIndex - a.orderIndex);
 });
 

function closeDialog() {
    toggleFaviriteOpen()
}


function inputToJSonList(item) {
     let arrjson=isPositive.value ? promptObj.value.txt:promptObj.value.ntxt
     arrjson.push({ cn: item.title, en: item.content, state: 'enable', w: 1 })
    // let homeEle = e.target.closest('.home');
    // let textareaEle = homeEle.querySelectorAll('.textarea-prompt')[0];  
}

function addPromptToFavorites(textareaIndex, e) {
    let homeEle = e.target.closest('.home');
    let textareaEle = homeEle.querySelectorAll('.textarea-prompt')[textareaIndex];
    if (!textareaEle || !textareaEle.value) return
    let userInput = window.prompt("请输入标题:", "");
    let arr = textareaIndex == '1' ? favoritesPNlist.value : favoritesPlist.value;
    if (userInput !== null) {
        arr.push({
            title: userInput,
            content: textareaEle.value,
            orderIndex: 0,
            editTitle: false,
            editContent: false
        })

    }

}


function SetorderIndex(index,item) {
   
    let userInput = window.prompt("请输入一个排序数字，越大越靠前", item.orderIndex);
    let number=Number(userInput)
    if(number){
         favoritesPrivewList.value[index].orderIndex =number
   
    }
   
}

function openEditMode(item, istit, event) {
    istit ? item.editTitle = true : item.editContent = true
    nextTick(() => {
        event.target.previousElementSibling.focus();
    });
}

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


function save() {
    localStorage.setItem('fp', JSON.stringify(favoritesPlist.value));
    localStorage.setItem('fnp', JSON.stringify(favoritesPNlist.value));
    alert('保存成功');
}

function loadFavorites() {
    favoritesPlist.value = localStorage.getItem('fp') ? JSON.parse(localStorage.getItem('fp')) : [];
    favoritesPNlist.value = localStorage.getItem('fnp') ? JSON.parse(localStorage.getItem('fnp')) : [];
}
function toggleList() {
    isPositive.value ? favoritesPrivewList.value = favoritesPlist.value : favoritesPrivewList.value = favoritesPNlist.value;
  
}

function backups(){ 
    if(!favoritesPlist.value.length&&!favoritesPNlist.value.length){
        alert('收藏夹没有数据！')
        return
    }
    let data = {fp:favoritesPlist.value,fnp:favoritesPNlist.value};
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
  input.onchange = function(e) {
    let file = e.target.files[0];
    if (!file) {
      alert('没有选择文件');
      return;
    }
    let reader = new FileReader();
    // 文件读取完成后的回调函数
    reader.onload = function(e) {
      let errmsg="不是收藏夹格式文件"
      try {
        // 尝试解析文件内容为JSON对象
        let data = JSON.parse(e.target.result);
        if(!data.fp||!data.fnp){   
            throw new Error(errmsg);        
        }
        favoritesPlist.value = data.fp || '';
        favoritesPNlist.value = data.fnp || '';
        alert('操作成功，记得点击保存！');
      } catch (error) {
        console.error('解析JSON字符串时发生错误:', error.message);
        alert(errmsg);
      }
    };
    // 文件读取出错时的回调函数
    reader.onerror = function(error) {
      console.error('读取文件时发生错误:', error);
      alert('读取文件失败');
    };
    // 开始读取文件内容
    reader.readAsText(file, 'utf-8');
  };

  // 触发文件选择对话框
  input.click();
}
watchEffect(() => {
    toggleList();
    promptObj.value= getPromptObj()
})

onMounted(() => {
    loadFavorites();


})
</script>

<style lang="scss" scoped>
.favorites {
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

    label {
        color: var(--favorite-tags-text-color);
        margin: 5px;
        font-size: 1em;
        font-weight: 600;
        cursor: pointer;
    }

    .active {
        color: var(--favorite-tags-active-text-color);

    }
    .prompt-list{
        height: 700px;
    }

    .prompt-item {
        display: grid;
        align-items: center;
        align-content: center;
        grid-template-columns: 2fr 7fr 2fr;


        &:hover {
            background: var(--favorite-row-hover-bg-color);
        }

        border-bottom: 1px solid var(--favorite-row-bottom-border-color);

        input {
            width: 100%;
        }

        .opera {
            display: flex;
            justify-content: center;
            align-items: center;

            button {
                padding:5px
            }

        }

        &>div {
            display: -webkit-box;
            overflow: hidden;
            white-space: normal !important;
            text-overflow: ellipsis;
            word-wrap: break-word;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            box-sizing: border-box;
            line-height: 3em;
            padding: 0 11px;
            height: 100%;

            div {
                height: 100%;
            }


        }


    }

}

</style>
 