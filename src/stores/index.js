/*
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2024-03-25 17:39:31
 * @LastEditors: Six_God_K
 * @LastEditTime: 2024-04-26 17:26:37
 * @FilePath: \comfyui-sixgod_prompt\src\stores\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { defineStore } from 'pinia';
import { ref ,computed,watch} from 'vue'

// ref() 就是 state 属性
// computed() 就是 getters
// function() 就是 actions
export const globStore = defineStore('globStore', () => {
    const globData = ref({
        activeNavName:'',//选中 tag 名字
        jsonData:null,
        jsonFileNames:[],
        cssList:{},
        is_txt_prompt_page:true,
        is_suiji_loading:false,
        txt_prompt:{
            txt:[],//[{zh:zh,en:en,state:true}]
            ntxt:[]
        },
        img_prompt:{
            txt:[],
            ntxt:[]
        },
        random_prompt:[],//{cn:cn,en:en}
        prompt_tips:[],//{cn:cn,en:en}
        isRandomOpen:false,
        isFaviriteOpen:false,
        
       
            
    })
    // let c_promptObj = computed(() => globData.value.is_txt_prompt_page? globData.value.txt_prompt : globData.value.img_prompt)
    
    function getPromptObj(){      
        return globData.value.is_txt_prompt_page? globData.value.txt_prompt : globData.value.img_prompt
    }
    function toggleRandomOpen(){
         globData.value.isRandomOpen=!globData.value.isRandomOpen   
    }
    function toggleFaviriteOpen(){      
         globData.value.isFaviriteOpen=!globData.value.isFaviriteOpen
   
    }
   
    return { globData,getPromptObj,toggleRandomOpen,toggleFaviriteOpen}
  })