/*
 * @Author: Six_God_K
 * @Date: 2025-03-03 21:41:18
 * @LastEditors: Six_God_K
 * @LastEditTime: 2025-03-14 20:55:20
 * @FilePath: \comfyui-sixgod_prompt\javascript\previewText.js
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */
 

import { app } from "../../../scripts/app.js";
import { ComfyWidgets } from "../../../scripts/widgets.js";
import { addStylesheet } from "../../scripts/utils.js";
// import { api } from "../../scripts/api.js";
 
app.registerExtension({
  name: "sixgod_prompts",
  async setup() {
   
  },

  async nodeCreated(ComfyNode, ComfyApp) {
 
    if (!ComfyNode || !ComfyNode.title?.includes("六神")) {
      return;
    }
    const widget = ComfyNode.widgets?.[0];
    if (!widget || !widget.element) {
      return;
    }
  
  
    setTimeout(() => {
      if (!ComfyNode.flags.id) {
        let uuid = getuuid();
        ComfyNode.flags = { id: uuid };
      }
      widget.element.dataset.focusId = ComfyNode.flags.id;
    }, 50);
  },
    // async loadedGraphNode(ComfyNode, ComfyApp) {
 
    // },
  init() {
    addStylesheet("sixgod.css", import.meta.url);
  },
  async beforeRegisterNodeDef(nodeType, nodeData, app) {
    if (nodeData.name === "SixGodPrompts_PreivewText") {
      function populate(text) {
        if (this.widgets) {
          for (let i = 1; i < this.widgets.length; i++) {
            this.widgets[i].onRemove?.();
          }
          this.widgets.length = 1;
        }

        const v = [...text];
        if (!v[0]) {
          // debugger
          v.shift();
        }

        const w = ComfyWidgets["STRING"](
          this,
          "",
          ["STRING", { multiline: true }],
          app
        ).widget;
        w.inputEl.readOnly = true;
        w.inputEl.style.opacity = 0.6;
        w.value = v.join("");

        requestAnimationFrame(() => {
          const sz = this.computeSize();
          if (sz[0] < this.size[0]) {
            sz[0] = this.size[0];
          }
          if (sz[1] < this.size[1]) {
            sz[1] = this.size[1];
          }
          this.onResize?.(sz);
          app.graph.setDirtyCanvas(true, false);
        });
      }

      // When the node is executed we will be sent the input text, display this in the widget
      const onExecuted = nodeType.prototype.onExecuted;
      nodeType.prototype.onExecuted = function (message) {
        onExecuted?.apply(this, arguments);
        populate.call(this, message.text);
      };

      const onConfigure = nodeType.prototype.onConfigure;
      nodeType.prototype.onConfigure = function () {
        onConfigure?.apply(this, arguments);
        if (this.widgets_values?.length) {
          populate.call(
            this,
            this.widgets_values.slice(+this.widgets_values.length > 1)
          );
        }
      };
    }
  },
});

function getuuid(length = 32, useHyphens = true) {
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
    for (let i = 0; i < segmentLengths.length && currentLength < length; i++) {
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
}
