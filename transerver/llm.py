'''
Author: Six_God_K
Date: 2024-04-23 22:30:05
LastEditors: Six_God_K
LastEditTime: 2025-03-09 19:26:52
FilePath: \comfyui-sixgod_prompt\transerver\llm.py
Description: 

Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
'''
# '''
# Author: Six_God_K
# Date: 2024-04-23 22:30:05
# LastEditors: Six_God_K
# LastEditTime: 2024-04-26 15:01:32
# FilePath: \comfyui-sixgod_prompt\transerver\llm.py
# Description: 

# Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
# '''
# import requests
# from install import install_packge
# OpenAI=install_packge()

# def chat(question,modelName="qwen/qwen1_5-4b-chat-q5_k_m",Preset="Translate Chinese into English"):
#         try:    
#             client = OpenAI(base_url="http://127.0.0.1:1234/v1", api_key="lm-studio")
#             completion = client.chat.completions.create(
#             model=modelName,
#             messages=[
#             {"role": "system", "content": Preset},
#             {"role": "user", "content": question}
#             ],
#             temperature=0.7,
#             )
#             return completion.choices[0].message.content         
#         except requests.exceptions.RequestException as e:
#             print(e)
#             return question


 
 
import time
import os
import folder_paths
from pathlib import Path
# from llama_cpp import Llama
try:
      from llama_cpp import Llama
      extension_path=Path(__file__).resolve().parent.parent / 'models'
      def chat(question,**kwargs):
        llm = Llama(
            model_path=os.path.join(extension_path,kwargs['llmName'])+'.gguf',
            n_gpu_layers=int(kwargs['n_gpu_layers']),
        )
 
        res=llm.create_chat_completion(
            messages = [
                {"role": "system", "content":kwargs['preset']},
                {
                    "role": "user",
                    "content": question
                }
            ],
            temperature=float(kwargs['temperature'])

        )
    
        return(res['choices'][0]["message"]['content'])
      
         
      def chat_imagine(question,settings):
          return chat(question,**settings)


except Exception as e:
     err_msg='找不到llama_cpp模块'
     print(err_msg)
 



# if __name__ == '__main__':
#         start_time = time.time()
#         question='一个美女'
#         modelName="qwen1_5-4b-chat-q2_k"
#         Preset=f'你是一名AI提示词工程师，用提供的关键词构思一副精美的构图画面，只需要提示词，不要你的感受，自定义风格、场景、装饰等，尽量详细，用中文回复'
#         res= chat(question,modelName,Preset)
#         end_time = time.time()
#         run_time = end_time - start_time
#         print(run_time)
#         print(res)
#         pass
 
    
 