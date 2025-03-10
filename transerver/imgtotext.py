'''
Author: Six_God_K
Date: 2025-03-09 20:39:16
LastEditors: Six_God_K
LastEditTime: 2025-03-10 00:20:15
FilePath: \ComfyUI_windows_portable\ComfyUI\custom_nodes\comfyui-sixgod_prompt\transerver\imgtotext.py
Description: 

Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
'''
import requests
import torch
from PIL import Image
from transformers import AutoProcessor, AutoModelForCausalLM 
from pathlib import Path
import os

class ImageToText:
    def __init__(self,model_name, precision='bf16'):
        self.model_path=Path(__file__).resolve().parent.parent / 'models/Florence'
        self.precision = precision
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.dtype = self.get_torch_dtype(self.precision)
        self.model, self.processor = self.loadModel(model_name)
    
    def get_torch_dtype(self, precision):
        # 根据设备类型和精度返回对应的torch数据类型
        if self.device.type == 'cuda':
            compute_capability = torch.cuda.get_device_capability(self.device)
            if precision == torch.bfloat16 and compute_capability[0] >= 8: # Ampere架构或更新版本
                return torch.bfloat16
            elif precision == torch.float16 and compute_capability[0] >= 7: # Volta架构或更新版本
                return torch.float16
        return torch.float32 # 默认情况下，CPU总是支持fp32
    def loadModel(self,model_name):
        # Define local model path
        local_model_path = self.model_path / ('models--' + model_name.replace('/', '--'))

        if local_model_path.exists() and any(local_model_path.iterdir()):
            print(f"本地模型 {model_name}，正在从本地加载...")
            try:
                model = AutoModelForCausalLM.from_pretrained(str(self.model_path), torch_dtype=self.dtype,trust_remote_code=True).to(self.device)
                processor = AutoProcessor.from_pretrained(str(self.model_path), trust_remote_code=True)
                return model, processor
            except Exception as e:
                print(f"从本地加载模型失败: {e}")
        else:
            print(f"未找到本地模型 {model_name}，准备从网络下载...")
            try:
                from huggingface_hub import snapshot_download         
                # Download model to local directory
                downloaded_dir = snapshot_download(repo_id=model_name, cache_dir=self.model_path, local_dir=self.model_path, local_dir_use_symlinks=False)
                print(f"模型下载成功至 {downloaded_dir}")

                # Load model from downloaded local path
                model = AutoModelForCausalLM.from_pretrained(downloaded_dir, torch_dtype=self.dtype, trust_remote_code=True).to(self.device)
                processor = AutoProcessor.from_pretrained(downloaded_dir, trust_remote_code=True)
                return model, processor
            except Exception as e:
                print(f"下载或加载模型失败: {e}")
                return None, None
    def run(self,task_prompt,image, text_input=None):
        if text_input is None:
            prompt = task_prompt
        else:
            prompt = task_prompt + text_input
        inputs = self.processor(text=prompt, images=image, return_tensors="pt").to(self.device, self.dtype)
        generated_ids = self.model.generate(
        input_ids=inputs["input_ids"],
        pixel_values=inputs["pixel_values"],
        max_new_tokens=1024,
        num_beams=3
        )
        generated_text = self.processor.batch_decode(generated_ids, skip_special_tokens=False)[0]

        parsed_answer = self.processor.post_process_generation(generated_text, task=task_prompt, image_size=(image.width, image.height))
        return parsed_answer
    

if __name__ == "__main__":
    # 'microsoft/Florence-2-base',
    # 'microsoft/Florence-2-base-ft',
    # 'microsoft/Florence-2-large',
    # 'microsoft/Florence-2-large-ft',
    # 'HuggingFaceM4/Florence-2-DocVQA',
    # 'thwri/CogFlorence-2.1-Large',
    # 'thwri/CogFlorence-2.2-Large',
    # 'gokaygokay/Florence-2-SD3-Captioner',
    # 'gokaygokay/Florence-2-Flux-Large',
    # 'MiaoshouAI/Florence-2-base-PromptGen-v1.5',
    # 'MiaoshouAI/Florence-2-large-PromptGen-v1.5',
    # 'MiaoshouAI/Florence-2-base-PromptGen-v2.0',
    # 'MiaoshouAI/Florence-2-large-PromptGen-v2.0'
    # ImageToText = ImageToText("microsoft/Florence-2-base", precision='bf16')
    ImageToText = ImageToText("gokaygokay/Florence-2-SD3-Captioner", precision='bf16')
    url = "https://huggingface.co/datasets/huggingface/documentation-images/resolve/main/transformers/tasks/car.jpg?download=true"
    image = Image.open(requests.get(url, stream=True).raw)
    prompt = "<MORE_DETAILED_CAPTION>"
    res=ImageToText.run(prompt,image)
    print(res)

 