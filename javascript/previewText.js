/*
 * @Author: Six_God_K
 * @Date: 2024-09-03 14:00:06
 * @LastEditors: Six_God_K
 * @LastEditTime: 2025-02-17 14:02:14
 * @FilePath: \vue\comfyui-sixgod_prompt\javascript\previewText.js
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */


import { app } from "../../../scripts/app.js";
import { ComfyWidgets } from "../../../scripts/widgets.js";
import { addStylesheet } from "../../scripts/utils.js";

// Displays input text on a node
app.registerExtension({
	name: "sixgod_prompts",
	async beforeRegisterNodeDef(nodeType, nodeData, app) {
		addStylesheet("sixgod.css", import.meta.url);
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
                    debugger
					v.shift();
				}

                const w = ComfyWidgets["STRING"](this, "", ["STRING", { multiline: true }], app).widget;
                w.inputEl.readOnly = true;
                w.inputEl.style.opacity = 0.6;
                w.value = v.join('');
				
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
					populate.call(this, this.widgets_values.slice(+this.widgets_values.length > 1));
				}
			};
		}
	},
});