/*
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2024-03-24 16:41:40
 * @LastEditors: Six_God_K
 * @LastEditTime: 2024-04-15 21:12:14
 * @FilePath: \comfyui-sixgod_prompt\src\js\utils\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

const common = {
  debounce: function (fn, delay = 300) {
    let timer = null;
    return function (...args) {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        fn.apply(this, args);
        timer = null;
      }, delay);
    };
  },
  getValueFromObj:function(obj, targetKey) {
    if (obj && typeof obj === 'object') {
      for (const key in obj) {
        if (key === targetKey) {
          return obj[key];
        } else if (typeof obj[key] === 'object') {
          const foundValue = this.getValueFromObj(obj[key], targetKey);
          if (foundValue !== undefined) {
            return foundValue;
          }
        }
      }
    }
  
    return undefined;
  },

  JsonObjtoArr(jsonObj) {
    const arr = [];
    function traverse(obj) {
      if (typeof obj !== 'object' || obj === null) {
        return;
      }
      for (let [key, value] of Object.entries(obj)) {
        if (typeof value === 'string') {
           arr.push({'cn': key,'en': value });       
        }
        else if(typeof value === 'object'){
          traverse(value);
        }
      }
    }
  
    traverse(jsonObj);
  
    return arr;
  }
  
};

export default common;
