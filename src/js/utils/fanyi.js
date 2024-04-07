/*
 * @Author: thisjam 3213441409@qq.com
 * @Date: 2024-04-01 22:15:38
 * @LastEditors: Six_God_K
 * @LastEditTime: 2024-04-02 17:57:28
 * @FilePath: \webui-prompt\src\js\utils\fanyi.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

class Fanyi {
  constructor(
    appId = "#",
    secretKey = "#",
    path = "https://fanyi-api.baidu.com/api/trans/vip/translate"
  ) {
    this.appId = appId;
    this.secretKey = secretKey;
    this.path = path;
  }

  _get(url) {
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((jsonData) => {
        // 使用返回的JSON数据
        // console.log(jsonData);  
        return jsonData;
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }
  // 翻译方法
  translate(text, from, to) {
    let url =
      this.path +
      "?q=" +
      text +
      "&from=" +
      from +
      "&to=zh&appid=" +
      this.appId +
      "&salt=" +
      Math.random() +
      "&sign=" +
      this.secretKey;
      this._get(url)
    //http://api.fanyi.baidu.com/api/trans/vip/translate?q=apple&from=en&to=zh&appid=2015063000000001&salt=1435660288&sign=f89f9594663708c1605f3d736d01d2d4
  }
}
