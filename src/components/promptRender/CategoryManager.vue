<template>
    <Dialog v-model="isshow" title="分类管理">

        <template v-slot:head>
            <div>{{ title }}</div>
            <div>
                <button class="btn" @click="add">{{ addtitle }}</button>
                <button class="btn" @click="save">保存</button>
            </div>
        </template>
        <template v-slot:content>
            <div class="data-list">
                <div class="data-item" v-for="(item, index) in c_sortedList" :key="index">
                    <div class="tit">
                        <input v-show="item.editTitle" v-model="item.title" @blur="item.editTitle = false">
                        <div v-show="!item.editTitle" @dblclick="openEditMode(item, $event)"> {{ item.title }}
                        </div>
                    </div>
                    <div class="opera">
                        <button class="btn" @click="SetorderIndex(index, item)">排</button>
                        <button class="btn" @click="deleteItem(index)">删</button>
                    </div>
                </div>
            </div>
        </template>

    </Dialog>
</template>

<script setup>
import { onMounted, ref, nextTick, computed, inject } from 'vue'
import Dialog from "./Dialog.vue"
const favoritesPrivewList = defineModel('favoritesPrivewList')
const isshow = defineModel('isshow')
const dataList = defineModel('categoryList')
 
const common = inject('common')
const props = defineProps({
    title: {
        type: String,
    },
    addtitle: {
        type: String,
    }
})

const c_sortedList = computed(() => {
    return dataList.value.sort((a, b) => b.orderIndex - a.orderIndex)
})

function SetorderIndex(index, item) {
    let userInput = window.prompt("请输入一个排序数字，越大越靠前", item.orderIndex);
    let number = Number(userInput)
    if (number||number==0) {  
        dataList.value[index].orderIndex = number
    }
}
const openEditMode = (item, event) => {
    if (item.id == 666) {
        alert('不能修改系统分类')
        return
    }
    item.editTitle = true
    nextTick(() => {
        event.target.previousElementSibling.focus();
    });


}

function deleteItem(index) {

    if (dataList.value[index].id == 666) {
        alert('不能删除系统分类')
        return
    }
    if (confirm('确定要删除吗？')) {
  
        favoritesPrivewList.value.forEach((item) => {
            if (item.categoryId == dataList.value[index].id) {
                item.categoryId = 666
                item.categoryName = '全部'
            }
        })
        dataList.value.splice(index, 1);
    }

}

function add() {
    dataList.value.push({
        title: '默认分类',
        id: common.getuuid(),
        orderIndex: 0,
        editTitle: true
    })
}

function save() {
    localStorage.setItem('fcp', JSON.stringify(dataList.value));
    alert('保存成功');
}
 

onMounted(() => {
   
})

</script>

<style lang="scss" scoped>
.data-list {
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



.data-item {
    box-sizing: border-box;
    display: grid;
    align-items: center;
    align-content: center;
    grid-template-columns: 8fr 3fr;
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



    .tit {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;


    }

    .tit div {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

    }

    .opera {
        text-align: center;
    }

}
</style>
