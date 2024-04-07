<template>

  <template v-if="typeof obj === 'object'">
    <div class="prompt-content">
      <div class="j-categroy" v-for="val, key in obj" :key="key">
        <div v-if="typeof val === 'object'" class="j-obj">
          <div class="j-menu" @click="inputMenuToRandom(key)"> {{ key }}</div>
          <PromtList :obj="val" :pdata="props.pdata" :level="level + 1" :pName="key" :parenttit="parenttit" />
        </div>
        <div v-else :data-en="val" :data-parenttit="parenttit" class="j-string"
          @click="inputPrompt(key, val, true, $event)" @contextmenu.prevent.stop="inputPrompt(key, val, false, $event)">
          {{ key }}
        </div>
      </div>
    </div>

  </template>





</template>

<script setup>

import { inject } from 'vue'
import { globStore } from '@/stores/index.js'
const store = globStore()
const { globData } = store
const $common = inject('common')
 
const props = defineProps({
  obj: { type: Object, required: true },
  pName: { type: String, default: "" },
  level: { type: Number, default: 1 },
  pdata: { type: Object, required: true },
  parenttit: { type: String, default: "" },
});


function collectStringValues(obj) {
  const values = [];
  function traverseAndCollect(obj) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];

        if (typeof value === 'string') {
          values.push(value);
        } else if (typeof value === 'object' && value !== null) {
          traverseAndCollect(value);
        }
      }
    }
  }

  traverseAndCollect(obj);

  return values;
}

function inputMenuToRandom(key) {
  if (!globData.isRandomOpen) {
    return
  }
  let jsonObj= $common.getValueFromObj(globData.jsonData,key)
  let arr=collectStringValues(jsonObj)
  globData.random_prompt.push({cn:key,en:arr.join(',')})
  // console.log(globData.random_prompt)
    

  
}


 


function addHighLightCss(isLeftClick, dom) {
  let css = isLeftClick ? 'txt_active' : 'ntxt_active'
  if (dom.classList.contains('txt_active') || dom.classList.contains('ntxt_active')) {
    dom.classList.remove('txt_active')
    dom.classList.remove('ntxt_active')
    dom.classList.add('all_active')
  } else {
    dom.classList.add(css)
  }
  globData.cssList[dom.dataset.parenttit]++;


}




function removeHighLightCss(isLeftClick, dom) {
  let removecss = isLeftClick ? 'txt_active' : 'ntxt_active'
  let addcss = isLeftClick ? 'ntxt_active' : 'txt_active'
  if (dom.classList.contains('all_active')) {
    dom.classList.remove('all_active')
    dom.classList.add(addcss)
  }
  dom.classList.remove(removecss)
  globData.cssList[dom.dataset.parenttit]--;


}

function toggleTitleCss(dom) {
  let home_ele = dom.closest('.home');
  const selector = `.nav-menu [data-tit="${dom.dataset.parenttit}"]`;
  let navelement = home_ele.querySelector(selector);

  if (globData.cssList[dom.dataset.parenttit] == 0) {
    navelement.classList.remove('nav-selected')
  }
  else {
    navelement.classList.add('nav-selected')
  }
}


function inputToRandom(zh, en) {
  globData.random_prompt.push({ cn: zh, en: en, state: 'enable', w: 1 })
}




// 点击输入词库
function inputPrompt(zh, en, isLeftClick, event) {
  
  let targetEle=event.target
  if (globData.isRandomOpen) {
    inputToRandom(zh, en)
    return
  }

  let _isreture = false
  let _arr = isLeftClick ? props.pdata.txt : props.pdata.ntxt
  _arr.forEach((item, index) => {
    if (item.en == en) {//删除
      _arr.splice(index, 1)
      _isreture = true
      removeHighLightCss(isLeftClick, targetEle)
      return //沒有跳出方法 forEach跳出当前循环

    }
  })
  if (!_isreture) {
    addHighLightCss(isLeftClick, targetEle)
    _arr.push({ cn: zh, en: en, state: 'enable', w: 1 })
  }

  toggleTitleCss(targetEle)



}






</script>

<style scoped lang="scss">
.prompt-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(30%, 1fr));
  /* 自动填充列，最小单元格宽度为25 */
  gap: 15px;
  grid-auto-rows: minmax(200px, auto);


}

.prompt-content>.j-categroy {
  display: inline-block;
}

/* 外框*/
.j-obj {
  border: 1px solid var(--border-color);
  height: 100%;
  padding: 5px;
  border-radius: 5px;


}

/* 所有菜单按钮标题 */
.j-obj>.j-menu {
  font-weight: bold;
  background-color: var(--menu-prompt-bg-color);
  border-radius: 5px;
  margin: 5px 0;
  padding: 5px;
  text-align: center;
  cursor: pointer;
  color: var(--menu-prompt-text-color);
}

/* 按钮 */
.j-string {
  padding: 3px;
  margin: 3px;
  border-radius: 5px;
  background-color: var(--btn-prompt-bg-color);
  cursor: pointer;
  width: fit-content;
  color: var(--btn-prompt-text-color);
  position: relative;

  &:hover::after {
    content: attr(data-en);
    position: absolute;
    top: 100%;
    left: 0;
    background: var(--btn-prompt-hover-bg-color);
    border-radius: 5px;
    transform: translateY(15px);
    width: max-content;
    max-width: 800px;
    word-wrap: normal;
    color: var(--btn-prompt-hover-color);
    font-weight: bold;
    transition: width 0.3s linear;
    display: inline-block;
    overflow: hidden;
    padding: 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    z-index: 9;
  }


  &:hover::before {
    content: '';
    display: inline-block;
    width: 0;
    height: 0;
    border-top: 10px solid transparent;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 10px solid var(--btn-prompt-hover-triangle-bg-color);
    position: absolute;
    left: 0;
    top: 100%;
    z-index: 9;

  }

}

.txt_active {
  background: var(--btn-prompt-tactive-bg-color);
  color: var(--btn-prompt-tactive-text-color);
}

.ntxt_active {
  background: var(--btn-prompt-ntactive-bg-color);
  color: var(--btn-prompt-ntactive-text-color);

}

.all_active {
  background: var(--btn-prompt-allctive-bg-color);
  color: var(--btn-prompt-allctive-text-color);
}
</style>