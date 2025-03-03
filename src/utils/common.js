/*
 * @Author: Six_God_K
 * @Date: 2025-02-27 13:34:11
 * @LastEditors: Six_God_K
 * @LastEditTime: 2025-02-27 13:34:39
 * @FilePath: \vue\comfy_newprompt\src\utils\common.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
let common = {
  getuuid: function (length = 32, useHyphens = true) {
    // 检查长度是否合法
    if (length < 1 || length > 128) {
      throw new Error("Length must be between 1 and 128.");
    }

    const segments = [];
    let currentLength = 0;

    // 定义每个段的默认长度（如果启用连字符）
    const segmentLengths = [8, 4, 4, 4, 12]; // 标准 UUID 的分段长度

    if (useHyphens) {
      // 如果启用连字符，按标准分段生成
      for (
        let i = 0;
        i < segmentLengths.length && currentLength < length;
        i++
      ) {
        const segmentLen = Math.min(segmentLengths[i], length - currentLength);
        const segment = Array.from({ length: segmentLen }, () =>
          Math.floor(Math.random() * 16).toString(16)
        ).join("");
        segments.push(segment);
        currentLength += segmentLen;
      }
    } else {
      // 如果不启用连字符，直接生成指定长度的字符串
      segments.push(
        Array.from({ length }, () =>
          Math.floor(Math.random() * 16).toString(16)
        ).join("")
      );
    }

    // 如果总长度不足，补充剩余部分
    if (currentLength < length) {
      const remaining = Array.from({ length: length - currentLength }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join("");
      segments.push(remaining);
    }

    // 返回结果
    return segments.join(useHyphens ? "-" : "");
  },
};
export default common;
