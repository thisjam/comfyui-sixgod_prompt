<template>
    <div class="imagine-prompt">
        <button class="btn" @click="imageinePrompt">随机灵感</button>
        <div class="spinner loading-suiji" v-if="is_suiji_loading">
            <div class="bounce1"></div>
            <div class="bounce2"></div>
            <div class="bounce3"></div>
        </div>
        <input  @keyup.enter.prevent="imageinePrompt" v-model="imagineWord" type="text" placeholder="请输入联想关键词，先要配置大模型" />
        <input v-model="startPrompt" type="text" placeholder="开始占位符" />
        <input v-model="endPrompt" type="text" placeholder="结束占位符" />
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import imagineJsonData from '../../imagineJson/random.json'
import eventBus from '../../utils/eventBus'
const startPrompt = ref('')
const endPrompt = ref('')
const imagineWord = ref('')
const is_suiji_loading = ref(false)

async function imageinePrompt() {
    try {
        is_suiji_loading.value = true
        eventBus.emit('deleteAllPrompt')
        let sendPrompt = null;
        if (imagineWord.value) {
            sendPrompt = await llmImagine(imagineWord.value)
        }
        else {
            sendPrompt = normalImagine()
        }
    
        sendPrompt && eventBus.emit('InputPrompt', sendPrompt)
    } catch (error) {
        alert('大模型接口异常，请检查配置')
        is_suiji_loading.value = false
    }
    is_suiji_loading.value = false
}

async function llmImagine(imaginetext) {
    let res = await fetch('api/sixgod/imaginePrompt', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(imaginetext),
    })

    let resjoson = await res.json()

    let sendPrompt = {
        "active": true,
        "state": "enable",
        "cn": resjoson,
        "en": resjoson,
        "w": 1,
    }
    
    return sendPrompt
}
function normalImagine() {
    let randomIndex = Math.floor(Math.random() * imagineJsonData.length);
    let random_cn = imagineJsonData[randomIndex].key
    // let random_en = imagineJsonData[randomIndex].val
    let prompt_cn = startPrompt.value + random_cn + endPrompt.value
    // let prompt_en = startPrompt.value + random_en + endPrompt.value

    let sendPrompt = {
        "active": true,
        "state": "enable",
        "cn": prompt_cn,
        "en": prompt_cn,
        "w": 1,
    }
    return sendPrompt
}

onMounted(() => {

})
</script>

<style lang="scss" scoped>
.imagine-prompt {
    display: flex;
}

.imagine-prompt input {

    padding: 5px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
    width: 30em;
    height: 2em;
    margin-left: 10px;
}




.spinner {
  width: 70px;
  text-align: center;
}

.spinner > div {
  width: 18px;
  height: 18px;
  background-color: #fff;

  border-radius: 100%;
  display: inline-block;
  -webkit-animation: sk-bouncedelay 1.4s infinite ease-in-out both;
  animation: sk-bouncedelay 1.4s infinite ease-in-out both;
}

.spinner .bounce1 {
  -webkit-animation-delay: -0.32s;
  animation-delay: -0.32s;
}

.spinner .bounce2 {
  -webkit-animation-delay: -0.16s;
  animation-delay: -0.16s;
}

@-webkit-keyframes sk-bouncedelay {
  0%, 80%, 100% { -webkit-transform: scale(0) }
  40% { -webkit-transform: scale(1.0) }
}

@keyframes sk-bouncedelay {
  0%, 80%, 100% { 
    -webkit-transform: scale(0);
    transform: scale(0);
  } 40% { 
    -webkit-transform: scale(1.0);
    transform: scale(1.0);
  }
}


</style>
