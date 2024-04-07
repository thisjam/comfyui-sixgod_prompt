<!--
 * @Author: thisjam 3213441409@qq.com
 * @Date: 2024-03-27 22:30:40
 * @LastEditors: Six_God_K
 * @LastEditTime: 2024-04-04 11:59:16
 * @FilePath: \webui-prompt\src\components\promptRender\Draggable.vue
 * @Description:  打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <div  class="draggable-container" >
   
      <template v-for="(item, index) in list" :key="index">
                <textarea v-if="item.state === 'edit'"  type="text" v-model="item.en" @blur="item.state = 'enable'"> </textarea>
                <div  draggable="true"  
                @dragstart="dragstart" @dragenter="dragenter" @dragend="dragend" 
                @mouseover="mouseover(item, $event)"
                @mouseleave="mouseleave"
                class="drag-item" 
                :class="item.state" 
                @click="toggleEnableState(item)"
                @dblclick="editPrompt(item, $event)" 
                @contextmenu.prevent.stop="deletePrompt(index,item,$event)">
                  <div class="word en"> {{ item.en }}</div>
                  <div class="word cn"> {{ item.cn }}</div>
                   <div class="operation" @click.prevent.stop @dblclick.prevent.stop="">
                    <div class="add" @click="changeWeight(item,true)">+</div>
                     <div class="sub" @click="changeWeight(item,false)">-</div>
                   </div>
               </div>   
      
    </template>

    </div>

</template>

<script setup>
import { ref} from "vue";
import { globStore } from '@/stores/index.js'
const store = globStore()
const { globData } = store


const props=defineProps({
  list: { type: Array, required: true},
  textareaDom:{type:Object, required: true},//用来表示hover 文本框高亮
  isPositive:{type:Boolean, required: true}
});


 
let target_index = -1
let current_index = -1
let currentDom=ref(null)


 
 



function swapItems(arr,i, j) {
  if (i !== j && i >= 0 && j >= 0 && i < arr.length && j < arr.length) {
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
}


function toggleEnableState(item) {
  item.state == 'enable' ? item.state = 'disable' : item.state = 'enable';
}

function editPrompt(dom, event) {
  dom.state = 'edit';
  const parent = event.target.parentNode.parentNode;
  setTimeout(() => {
    parent.querySelector('textarea').focus();
  }, 100);

}

function deletePrompt(index,item,e) {
  props.list.splice(index, 1)

  const elehom=e.target.closest('.home')
  const selector = `.prompt-content [data-en="${item.en}"]`;
  const eleBtn=elehom.querySelector(selector)
  const menutit=eleBtn.dataset.parenttit;
  delBtnActiveCss(eleBtn,props.isPositive)
  delMenuAcitveCss(elehom,menutit)
 
}


function delBtnActiveCss(btnTargetEle,isPositive) {
  let removecss = isPositive ? 'txt_active' : 'ntxt_active'
  let addcss = isPositive ? 'ntxt_active' : 'txt_active'
  if (btnTargetEle.classList.contains('all_active')) {
    btnTargetEle.classList.remove('all_active')
    btnTargetEle.classList.add(addcss)
  }
  btnTargetEle.classList.remove(removecss)
  globData.cssList[btnTargetEle.dataset.parenttit]--;

  
}



function delMenuAcitveCss(homeEle,menutit){

  const selector = `.nav-menu [data-tit="${menutit}"]`;
  let navelement = homeEle.querySelector(selector);

  if (globData.cssList[menutit] == 0) {
    navelement.classList.remove('nav-selected')
  }
  else {
    navelement.classList.add('nav-selected')
  }

}





function dragstart(e) {
  setTimeout(() => {
    e.target.classList.add('draging')
  }, 0);
    currentDom.value=e.target;
    current_index=getDragItemindex(e.target)
 
}



function getDragItemindex(dom) {
  const children=Array.from(dom.parentNode.children)
  return children.indexOf(dom)
}

function dragenter(e) {
   if(e.target==currentDom.value) return
   target_index=getDragItemindex(e.target);
}

function dragend(e) { 
    e.target.classList.remove('draging')
    swapItems(props.list,current_index,target_index)
   
}

function matchWeightPrompt(str,w){
    // <lora:2Dhx_XianxiaMap_v1.0:1>,
  str = str.replace(/[（（））]/g, ''); // 去除两侧的全角括号
  str = str.replace(/[()]/g, ''); // 去除两侧的半角括号

  let lorastr=str.substr(0,2);
  let strarr=str.split(':')

  if(lorastr=='<l') 
  return `${strarr[0]}:${strarr[1]}:${w.toFixed(1)}>`

 
  if(w==1) return strarr[0]
  else  return  `(${strarr[0]}:${w.toFixed(1)})` 
  
}


function changeWeight(item,isadd){
  if(isadd){
    if(item.w>=1.9) return
      item.w+=0.1
  }
  else{
    if(item.w<=0.2) return
      item.w-=0.1
  }
  let en_prompt= matchWeightPrompt(item.en,item.w)
  let cn_prompt= matchWeightPrompt(item.cn,item.w)
  item.en=en_prompt
  item.cn=cn_prompt
}
 

function mouseover(item,e) {
  // let textarea=document.querySelector('#'+props.textareaId)
  highlightText(props.textareaDom,item.en)
 
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

function mouseleave() {
  // let textarea=document.querySelector('#'+props.textareaId)
  props.textareaDom.setSelectionRange(0,0);
}

 
</script>

<style lang="scss" scoped>
 
.draggable-container{
    display: flex;
    overflow: hidden;
    flex-wrap: wrap;
}

 textarea {
  width: 60%;
  height: 20em;
  position: absolute;
  background-color: var(--editearea-prompt-bg-color);
  top: 50%;
  left: 50%;
  transform: translate(-40%, -50%);
  z-index: 99;
  color: var(--editearea-prompt-text-color);
  outline: none;
  padding: 1em;
 
}

textarea:focus {
  border: 1px solid var(--editearea-prompt-border-color);

}

 
 
.drag-item.draging{
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
   
    .operation{
       position: absolute; 
       display: flex; 
       flex-direction: column;
       text-align: center;
       right: 0;
       height: 100%;
       width: 1.2em;
       opacity:0;
       transition: opacity 0.1s ease-in-out; /* 添加过渡效果 */
      
     
    }
    .add ,.sub{  
      height: 50%;
    }
    .add{
      color: var(--add-text-color);
      background: var(--add-bg-color);
      border:1px solid var(--add-border-color);
    }
    .sub{
      color: var(--sub-text-color);
      background: var(--sub-bg-color);
      border:1px solid var(--sub-border-color);
    }
    &:hover{
      .operation{
        opacity:0.8
      }
    }
    


    /* 允许子元素换行 */
    .word {
      padding: .5em;
      display: inline-block;
      cursor: pointer;
      font-size: .5em;
      width: 15em;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      pointer-events: none;//可以静止触发拖拽事件

    }

    .en {
      border-bottom: 0px;
    }
    .cn {
      border-top: 1px solid var(--drag-prompt-cn-top-border-color);
      opacity: 0.7;

    }


  }

.disable {
  text-decoration: line-through;
  background-color:var(--drag-prompt-disable-bg-color);
}
.drag-item.edit{
  visibility: visible;
  box-shadow:var(--drag-prompt-edit-shadow)
  
}
 
 
 
</style>
