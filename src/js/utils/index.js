/*
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2024-03-24 16:41:40
 * @LastEditors: thisjam 3213441409@qq.com
 * @LastEditTime: 2024-04-01 16:11:17
 * @FilePath: \webui-prompt\src\js\common.js
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
  }
  
};

export default common;
