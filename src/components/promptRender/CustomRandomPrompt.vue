<template>
    <div>
        <button class="btn" @click="closeDialog = !closeDialog">自定义随机词库</button>
        <Dialog v-model="closeDialog">
            <template v-slot:head>
                <div>配置随机词库</div>
            </template>
            <template v-slot:content>
                <div class="randprompt">
                    <div class="random-input"><label>自定义标题：</label><input type="text" v-model="title">
                    </div>
                    <div class="random-preview">
                        <div @contextmenu.prevent.stop="deleteCutomPrompt(index)"
                            v-for="(item, index) in randomCategoryPrompts" :key="index">{{ item.cn }}</div>
                    </div>
                    <div>
                        <textarea v-model="prompt_en" class="random-textarea" rows="5" cols="100"></textarea>
                    </div>
                    <div class="random-footer">
                        <button class="btn" @click="inputToTextArea">发送到提示框</button>
                        <button class="btn" @click="clearAll">清空</button>
                    </div>

                </div>

            </template>
        </Dialog>
    </div>
</template>

<script setup>
import { onMounted, ref, watch, watchEffect } from 'vue'
import Dialog from './Dialog.vue';
import eventBus from '../../utils/eventBus';

const closeDialog = ref(false)
const title = ref('')
const randomCategoryPrompts = ref([])
const prompt_en = ref('')
// active: false,//激活标识
// state: 'enable',//启用标识
// cn: key,
// en: value,
// navName: fristKey,
// id: getuuid(),
// w: 0,
// categoryName: categoryName//组件遍历时使用


function inputToTextArea() {
    if (title.value && prompt_en.value) {
        let data =
        {
            cn: '#[' + title.value + ']',
            en: '#[' + prompt_en.value + ']',
            state: 'enable',
            w: 1,

        }
  
        eventBus.emit('InputPrompt', data)
    }
    else {
        alert('检查标题或内容是否为空')
    }
}

function deleteCutomPrompt(index) {
    randomCategoryPrompts.value.splice(index, 1)
}


function clearAll() {
    randomCategoryPrompts.value = []
    eventBus.emit('clearCustomRondomPrompt')
}

watchEffect(() => {
    prompt_en.value = `${randomCategoryPrompts.value.map(item => item.en).join()}`

})
watch(
    () => closeDialog.value,
    (newVal) => {
        eventBus.emit('openCustomRondomPrompt', newVal)
    }
);

onMounted(() => {
    eventBus.on('inputCategoryPrompts', (data) => {
        randomCategoryPrompts.value = data
    })
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
        font-size: 0.8em;

        input {
            height: 2em;
            width: 100%;
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
