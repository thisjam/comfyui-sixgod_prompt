
<template>
    <Dialog @closeDialog="closeDialog" v-show="globData.isRandomOpen">
        <template v-slot:head>
            <div>配置随机词库</div>
        </template>
        <template v-slot:content>
            <div class="randprompt">
                <div class="random-input"><label>自定义标题：</label><input type="text" v-model="title">
                </div>
                <div class="random-preview">
                    <div @contextmenu.prevent.stop="deletePrompt(index)" v-for="(item, index) in globData.random_prompt"
                        :key="index">{{ item.cn }}</div>
                </div>
                <div>
                    <textarea v-model="prompt_en" class="random-textarea" rows="5" cols="100"></textarea>
                </div>
                <div class="random-footer">
                    <button @click="RandomPromptToTextArea(true)">发送到正向提示框</button>
                    <button @click="RandomPromptToTextArea(false)">发送到负向提示框</button>
                    <button @click="deleteAll">清空</button>
                </div>

            </div>

        </template>
    </Dialog>
  
</template>

<script setup>
import { onMounted, inject, reactive, ref, watchEffect } from 'vue'
import { globStore } from '@/stores/index.js'
import Dialog from "@/components/promptRender/Dialog.vue"



const store = globStore()
const { globData, getPromptObj,toggleRandomOpen } = store
 

let prompt_en = ref('')
let title = ref('')

function closeDialog() {
    toggleRandomOpen()
}


function deletePrompt(index) {
    globData.random_prompt.splice(index, 1)

}


function deleteAll() {
    globData.random_prompt.splice(0, globData.random_prompt.length)
    prompt_en.value = ''

}




function RandomPromptToTextArea(isPositive) {
    if (title.value && prompt_en.value) {
        let pdataObj = getPromptObj();
        let parr = isPositive ? pdataObj.txt : pdataObj.ntxt;
        parr.push(({ cn: '#[' + title.value + ']', en: '#[' + prompt_en.value + ']', state: 'enable', w: 1 }))
        deleteAll()

    }
    else {
        alert('检查标题或内容是否为空')
    }



}

watchEffect(() => {
    prompt_en.value = `${globData.random_prompt.map(item => item.en).join()}`


})


onMounted(() => {

})
</script>

<style lang="scss" scoped>
.randprompt {
    padding: 1em;

    .random-input {
        display: grid;
        grid-template-columns: 1fr 8fr;
        align-items: center;
        padding: 10px;

        input {
            height: 2em;
        }

    }

    .random-textarea {
        box-sizing: border-box;
        padding: 1em;
        width: 100%;
        outline: none;
    }

    .random-footer {
        display: flex;
        justify-content: center;
        padding: 10px;

    }

    .random-preview {
        border-radius: 5px;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: flex-start;

        div {
            padding: .2em;
            margin: 0.2em;
            border-radius: 5px;
            border: 1px solid var(--random-btns-border-color);
            cursor: pointer;

        }

    }


}


</style>