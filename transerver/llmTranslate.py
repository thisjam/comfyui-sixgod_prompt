'''
Author: Six_God_K
Date: 2024-04-13 12:54:31
LastEditors: Six_God_K
LastEditTime: 2025-03-08 22:42:21
FilePath: \custom_nodes\comfyui-sixgod_prompt\transerver\llmTranslate.py
Description: 

Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
'''
import Translator 
import requests
import json
import llm


class LLMTranslator(Translator.TranslatorInterface):
     def translate(self,text: str,**kwargs) -> str:    
       lang_to= kwargs.get("lang_to","en")
       if lang_to == "en":       
         kwargs['preset']= "你是一个翻译专家，请把提供的文本翻译成英文"
       elif lang_to == "zh":    
         kwargs['preset']= "你是一个翻译专家，请把提供的文本翻译成中文"
       return llm.chat(text,**kwargs)


 
            