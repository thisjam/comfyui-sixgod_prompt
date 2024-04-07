/*
 * @Author: thisjam 3213441409@qq.com
 * @Date: 2024-03-31 16:29:06
 * @LastEditors: thisjam 3213441409@qq.com
 * @LastEditTime: 2024-03-31 16:31:53
 * @FilePath: \webui-prompt\src\js\utils\eventBus.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const eventBus = {
    events: {},
    on(event, callback) {
      if (!this.events[event]) {
        this.events[event] = []
      }
      this.events[event].push(callback)
    },
    emit(event, ...args) {
      if (this.events[event]) {
        this.events[event].forEach(callback => {
          callback(...args)
        })
      }
    }
  }

  export default eventBus