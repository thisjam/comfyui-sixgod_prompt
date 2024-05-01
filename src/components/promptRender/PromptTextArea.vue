<template>
  <div>
    <div> 
     <textarea ref="Reftextarea" class="textarea-prompt" v-model="textareaValue"  
     :placeholder="props.isPositive?`正向提示词 支持中文 Prompt`:`负面提示词 支持中文 Negative Prompt`"  
     @blur="valiPrompt(props.isPositive,globData.cssList,$event)"></textarea>
    </div>
    <div class="prompt-list"  >
        <span v-show="props.list.length" class="expand" @click="isShowPromptList=!isShowPromptList">{{isShowPromptList?'▼':'▲'  }}</span>
        <Draggable v-show="isShowPromptList" :list="props.list" :textareaDom="Reftextarea" :isPositive="props.isPositive"> </Draggable>    
    </div>
  </div>
</template>




<script setup>
import { onMounted, ref, defineProps, watch, inject } from 'vue'
import  Draggable from './Draggable.vue'
import { globStore } from '@/stores/index.js'
import romdomJson from '@/randomjson/random1.json';
const eventBus = inject('eventBus')


const store = globStore()
const { globData } = store

const $common = inject('common')

// 自動高度防抖
const autoHeight = $common.debounce(() => {
    Reftextarea.value.style.height = 'auto';
    Reftextarea.value.style.height = `${Reftextarea.value.scrollHeight}px`;
}, 100);



const props = defineProps({
    list:{type:Object,required:true}, //globData.txt_prompt globData.img_prompt
    syncDom: { type: Object, required: true },
    isPositive: { type: Boolean, required: true }
})


let textareaValue = ref(null)
const Reftextarea = ref(null)
let  isShowPromptList = ref(true)
 

 

//获取启用的提示词文本
function getEnablePrompt(arr) {
  let _en_text = '';
  let _enableArr = []
  arr.forEach(element => {
    if (element.state == 'enable') {
      _en_text += element.en + ',';
      _enableArr.push(element)
    }
  })
  return { text: _en_text, arr: _enableArr };
}

 
//清空所有正/负面相关样式
function clearActiveBtnHighLight(isPositive,globCssList,e) {
  let removecss = isPositive ? 'txt_active' : 'ntxt_active'
  let addcss = isPositive ? 'ntxt_active' : 'txt_active'
  let homeEle=e.target.closest('.home')
  let activeBtns = homeEle.querySelectorAll('.j-string');
 

  Object.entries(globCssList).forEach(([key, value]) => {
    globCssList[key] = 0;
  });

  activeBtns.forEach(itemEle => {
    if (itemEle.classList.contains('all_active')) {
      itemEle.classList.remove('all_active')
      itemEle.classList.add(addcss)
      globCssList[itemEle.dataset.parenttit]++;
    }
    itemEle.classList.remove(removecss)
    const selector = `.nav-menu [data-tit="${itemEle.dataset.parenttit}"]`;
    let navelement = homeEle.querySelector(selector);
    if (globCssList[itemEle.dataset.parenttit] == 0) {
      navelement.classList.remove('nav-selected')
    }
    else {
      navelement.classList.add('nav-selected')
    }
  })

 

}

 

function valiPrompt(isPositive,globCssList,e) {
  let source_promptarr = props.list;
  let textarea_text= textareaValue.value
  if (!textarea_text && source_promptarr.length == 0) {
    //空文本空数组
    return
  };
  let enable_promptObj = getEnablePrompt(source_promptarr)
  let prompobj_text = enable_promptObj.text;
  if (prompobj_text === textarea_text) {
    return   //提示词文本没有变动
  }
  else {
   
    if (prompobj_text === textarea_text.substr(0, prompobj_text.length)) {
      //末尾提示词变化
       
      let _newprompt = textarea_text.substr(prompobj_text.length);//截取末尾变动的文本
      let _newpromptarr = _newprompt.split(',').filter(Boolean);
      _newpromptarr.forEach(item => {
        source_promptarr.push({
          en: item,
          state: 'enable',
          cn: item,
          w: 1
        })
      })
    }
    else {
      
      clearActiveBtnHighLight(isPositive,globCssList,e)
      let _addnewpromptarr = textarea_text.split(',').filter(Boolean);

      for (let i = source_promptarr.length - 1; i >= 0; i--) {
        if (source_promptarr[i].state == 'enable') {
          source_promptarr.splice(i, 1);
        }
      }
      _addnewpromptarr.forEach(item => {
        source_promptarr.push({
          en: item,
          state: 'enable',
          cn: item,
          w: 1
        })
      })



    }


  }

}

//同步到gradio的文本框
const syncDomData = $common.debounce(() => {
    props.syncDom.value = textareaValue.value
}, 800);


watch(
    () => textareaValue.value,
    (newValue, oldValue) => {              
        syncDomData()//同步到comfyui
        // autoHeight()
    }
);

 
watch(
  () => props.list,
  (newValue, oldValue) => {
    textareaValue.value = getEnablePrompt(newValue).text; 
  },
  { deep: true }
);

async function imaginePrompt(imaginetext) {
 let res=await fetch('api/sixgod/imaginePrompt', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', 
    },
    body: JSON.stringify(imaginetext), 
  })
 return res
  
}


onMounted(() => {
  //初始同步comfyui节点输入框
  eventBus.on('loadTextArea',function(arr){
    textareaValue.value=props.isPositive?arr[0]:arr[1]
  })
  //不通用部分
  eventBus.on('autoTips',function(tempPrompt){
      if (props.isPositive) {
        textareaValue.value = tempPrompt
        props.list.push({ en: tempPrompt.en, state: 'enable', cn: tempPrompt.cn, w: 1 })
      }
       
  })
  eventBus.on('suji_prompt',async(text,placeholderPrompts)=>{  
     if(props.isPositive){ 
      if(text){
        globData.is_suiji_loading=true
        let res= await imaginePrompt(text)
        let Prompt=await res.json()
        textareaValue.value=placeholderPrompts.start+Prompt+placeholderPrompts.end
        globData.is_suiji_loading=false
      }
      else{
        let randomIndex = Math.floor(Math.random() *romdomJson.length);
        let random_cn=romdomJson[randomIndex].key
        textareaValue.value=placeholderPrompts.start+random_cn+placeholderPrompts.end
      }
     
          
     }
   
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
  border: 1px  solid var(--textarea-prompt-border-color);
  font-size: 1em;
  color: inherit;
  box-sizing: border-box;
  line-height: 1em;
  padding: 10px;
 
 
  
}

 textarea:focus {
  outline: none;
  border: 1px solid var(--textarea-prompt-focus-border-color);

}

.textarea-prompt {
  resize: none;
  // overflow: hidden;
  margin: .5em 0;
}

.prompt-list {
  display: flex;
  // min-height: 70px;
  position: relative;
  width: 100%;
  .expand{
    position: absolute;
    right: 0;
    top: -1em;
    font-size: 1em;
    cursor: pointer;

  }
 
}


</style>
