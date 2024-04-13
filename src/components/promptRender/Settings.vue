<template>
    <Dialog @closeDialog="closeDialog" v-if="transObj&&shortCutOjb" v-show="props.openSetting.isopen">
        <template v-slot:head>
            <div>设置</div>
        </template>
        <template v-slot:content>
           
                <div class="setting">       
                <div @click="activeTag=item" class="setting-nav" :class="item==activeTag?'active':''" v-for="item,index in settingNavs" :key="index">{{ item }}</div>          
            </div>
            <div class="setting-content">
                <div class="trans-content" v-show="activeTag=='翻译'">       
                        <label for="">服务商:</label>
                        <select name="translateServer" v-model="transObj.server">                    
                            <option value="free">免费</option>
                            <option value="baidu">百度</option>
                            <option value="ali" >阿里（功能还没写，先不要用）</option>
                            <option value="tx" >腾讯（功能还没写，先不要用）</option>
                        </select>        
                     <label for="">APPID:</label> <input type="text" v-model="transObj.appid"> 
                     <label for="">密钥:</label> <input type="text" v-model="transObj.secret">
                     <button class="btn" @click="testTransServer">测试翻译</button><label for="">{{ txt_test_trans }}</label>
            
                </div>
                <div class="shortcut-key" v-show="activeTag=='快捷键'">       
                    <span>
                        <label for="">按键1:</label>
                        <select name="firstKey" v-model="shortCutOjb.firstKey">
                            <option value="" ></option>
                            <option value="alt">alt</option>
                            <option value="ctrl" >ctrl</option>                      
                            <option value="commond" >commond</option>                      
                            <option value="shift" selected>shift</option>
                        </select>  
                    </span>
                    <span> <label for="">按键2</label> <input type="text" v-model="shortCutOjb.secondKey"> </span>
                             
                   
                  
                </div>
                <div>
                </div>
            </div>
            <div class="save" ><button @click="saveSettings" class="btn">保存</button></div>

         
          

        </template>
    </Dialog>

</template>

<script setup>
import { onMounted, inject, reactive, ref, watchEffect } from 'vue'
import { globStore } from '@/stores/index.js'
import Dialog from "@/components/promptRender/Dialog.vue"

const props = defineProps({
    openSetting: {
        type: Boolean,
        default: false
    }
})


let activeTag = ref("翻译")
let txt_test_trans = ref("")
const settingNavs=ref(['翻译','快捷键'])
const transObj= ref({
    server:'free',
    appid:'',
    secret:''
   
})
const shortCutOjb=ref({
    firstKey:'alt',
    secondKey:'q'
})

const globStoreData = globStore()

function closeDialog() {
  props.openSetting.isopen=false
  txt_test_trans.value=''
}

function saveSettings(istips=true) {
    localStorage.setItem('shortCutOjb',JSON.stringify(shortCutOjb.value))
    localStorage.setItem('transObj',JSON.stringify(transObj.value)) 
    setTransServer()
    istips&&alert('保存成功')
}

 

function loadSetting(){
    if(localStorage.getItem('shortCutOjb')){
        shortCutOjb.value = JSON.parse(localStorage.getItem('shortCutOjb'))
          transObj.value = JSON.parse(localStorage.getItem('transObj'))
    }
    else{
        saveSettings(false)
    }  
}

function setTransServer() {
  fetch('api/sixgod/setTransServer', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', 
    },
    body: JSON.stringify(transObj.value), 
  })
    
}
function testTransServer(){
    fetch('api/sixgod/testTransServer').then(res => res.json()).then(data => {
        txt_test_trans.value=data
  })
}


watchEffect(() => {


})


onMounted(() => {
  
    loadSetting()
     
})

</script>

<style lang="scss" scoped>

 

.setting {
    display: flex;
    .setting-nav {
        padding: 1em;
        font-size: 1.5em;
        cursor: pointer;
    }
}

.active{
      color: var(--favorite-tags-active-text-color);
 }

.setting-content { 
    padding: 2em;
    min-height: 100px;
   
   .trans-content{
      display: grid;
      grid-template-columns: max-content 300px;
      gap: 1em;
   }
   .shortcut-key span{
     margin-right: 1em;
   }
 
 
}

.save{
     text-align: center;
     padding: 2em;
}
</style>