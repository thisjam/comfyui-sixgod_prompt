'''
Author: Six_God_K
Date: 2024-04-13 12:54:31
LastEditors: Six_God_K
LastEditTime: 2025-03-14 22:32:37
FilePath: \ComfyUI_windows_portable\ComfyUI\custom_nodes\comfyui-sixgod_prompt\transerver\baidu.py
Description: 

Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
'''
import Translator 
import requests
import json
import hashlib

class BaiduTranslator(Translator.TranslatorInterface):
     def __init__(self):
        super().__init__()
        pass
    #  def translate(self,appid:str,secretKey:str,text: str) -> str:
     def translate(self, text: str, **kwargs) -> str:   
        url='https://fanyi-api.baidu.com/api/trans/vip/translate'
       
        postdata={
            "appid":kwargs['appid'],
            "from": kwargs.get("lang_from","auto"),
            "to": kwargs.get("lang_to","en"),
            "q": text,
            "salt": "1435660288",# 随机数
            "sign":self.encrypt_string_to_md5(kwargs['appid']+text+"1435660288"+kwargs['secret'])
            }
      
        try:    
            resdata= requests.post(url,headers=self.headers,data=postdata)  
            jsonObj=json.loads(resdata.content.decode('utf-8'))
            if('error_code'in jsonObj):
                print('trans_result erro')
                return text
            return jsonObj['trans_result'][0]['dst']
         
            
        except requests.exceptions.RequestException as e:
            print(e)

     def encrypt_string_to_md5(self,input_string):
        encoded_string = input_string.encode()
        md5_hash = hashlib.md5()
        md5_hash.update(encoded_string)
        hashed_value = md5_hash.hexdigest()
        return hashed_value   


# if __name__ == '__main__':
#     text="红色的气球"
#     baidu_translator = BaiduTranslator()
#     res = Translator.translate_text(baidu_translator, appid,secretKey,text)
#     print(res)
            