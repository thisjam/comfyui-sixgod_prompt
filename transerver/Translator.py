'''
Author: Six_God_K
Date: 2024-04-13 12:12:19
LastEditors: Six_God_K
LastEditTime: 2025-03-08 18:48:46
FilePath: \custom_nodes\comfyui-sixgod_prompt\transerver\Translator.py
Description: 

Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
'''
from abc import ABC, abstractmethod


class TranslatorInterface(ABC):
    def __init__(self):
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.182 Safari/537.36',
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
        # self.lang_from='zh'
        # self.lang_to='en'
    @abstractmethod
    def translate(self, text: str, **kwargs) -> str:
        pass


