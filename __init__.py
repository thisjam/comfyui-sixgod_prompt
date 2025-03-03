'''
Author: Six_God_K
Date: 2024-04-08 09:37:03
LastEditors: Six_God_K
LastEditTime: 2025-03-03 18:31:44
FilePath: \vue\comfy_newprompt\__init__.py
Description: 

Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
'''
import sys 
import os
import shutil
import folder_paths
import shutil
import server
from aiohttp import web
import json
import requests
import re
import random
 
 
try:
    from transerver import Translator,baidu,freebd,llmTranslate,llm
except:
    transerver_path = os.path.join(os.path.dirname(__file__), "transerver")
    sys.path.append(transerver_path)
    import Translator,baidu,freebd,llmTranslate,llm
 


 

current_script = os.path.realpath(__file__)
current_folder = os.path.dirname(current_script)   #本插件目录  
path1 = current_folder+ r"/json"
path2 = current_folder+ r"/yours"


transObj={}
 
class SixGodPrompts:
    def __init__(self):
        pass  
    @classmethod
    def INPUT_TYPES(s):  
       
        return {"required": {
            "text": ("STRING", {"multiline": True,"placeholder": "双击打开页面"}),
            "clip": ("CLIP",),
            "seed": ("INT", {"default": 0, "min": 0, "max":sys.maxsize}),   
        }}
    
    RETURN_TYPES = ("CONDITIONING","STRING","INT")
    FUNCTION = "encode"
    CATEGORY = "conditioning"
    

    def encode(self, clip, text,seed):
        text=extract_tags(text)
        if(contains_chinese(text)==True):
           text=translate(text)
        tokens = clip.tokenize(text)
        cond, pooled = clip.encode_from_tokens(tokens, return_pooled=True)
        return ([[cond, {"pooled_output": pooled}]],text,seed)
    

class SixGodPrompts_Text:
    @classmethod
    def INPUT_TYPES(s):    
        return {"required": {
            "text": ("STRING", {"multiline": True,"placeholder": "双击打开页面，带自动中文翻译功能的文本"}),
        }}
    
    RETURN_TYPES = ("STRING",)
    FUNCTION = "encode"
    CATEGORY = "conditioning"
    # 定义一个encode函数，用于对文本进行编码
    def encode(self, text):
        text=extract_tags(text)
        if(contains_chinese(text)==True):
           text=translate(text)
        return (text,)
 
class SixGodPrompts_PreivewText:
    @classmethod
    def INPUT_TYPES(s):
        return {
            "required": {
                "text": ("STRING", {"forceInput": True}),
            },
            "hidden": {
                "unique_id": "UNIQUE_ID",
                "extra_pnginfo": "EXTRA_PNGINFO",
            },
        }

   
    RETURN_TYPES = ("STRING",)
    FUNCTION = "preview"
    OUTPUT_NODE = True
    CATEGORY = "conditioning"

    def preview(self, text, unique_id=None, extra_pnginfo=None):
        return {"ui": {"text": text}, "result": (text,)}


WEB_DIRECTORY = "./javascript"


NODE_CLASS_MAPPINGS = {
    "SixGodPrompts": SixGodPrompts,
    "SixGodPrompts_Text": SixGodPrompts_Text,
    "SixGodPrompts_PreivewText": SixGodPrompts_PreivewText,
    
}

 
NODE_DISPLAY_NAME_MAPPINGS = {
    "SixGodPrompts": "SixGodPrompts",
    "SixGodPrompts_Text": "SixGodPrompts_Text",

}


def translate(text):
    if(transObj['server']=='free'):
         trans_server=freebd.FreeBDTranslator()
         return Translator.translate_text(trans_server,text)
    elif(transObj['server']=='llm'):
         trans_server=llmTranslate.LLMTranslator()
         return Translator.translate_text(trans_server,text,transObj)
    elif(transObj['server']=='baidu'):
         trans_server=baidu.BaiduTranslator()
         return Translator.translate_text(trans_server, transObj['appid'],transObj['secret'],text)
  
     


def LoadTagsFile():    
      dic={}
      loadjsonfiles(path1,dic)
      loadjsonfiles(path2,dic)
      obj=json.dumps(dic,ensure_ascii=False)        
      return  obj                   
 
def loadjsonfiles(path,dic):
    files = os.listdir( path ) 
    for item in files:
        if item.endswith(".json"):
                filepath=path+'/'+item
                filename=filepath[filepath.rindex('/') + 1:-5]
                with open(filepath, "r",encoding="utf-8-sig") as f:
                        res=json.loads(f.read())                       
                        dic[filename]=res


 
 
def contains_chinese(s):
    pattern = re.compile(r'[\u4e00-\u9fff]+')
    return bool(pattern.search(s))


def extract_tags(text):
    pattern = r'#\[(.*?)\]'
    matches=re.findall(pattern, text)  
    for i in matches:
        newarr=i.split(',')
        random.seed(random.random())
        rdindex=random.randint(0,len(newarr)-1)
        rdtext=newarr[rdindex]
        text = re.sub(pattern, rdtext, text,count=1)
    return text
    





# 获取JSON数据 
@server.PromptServer.instance.routes.get("/api/sixgod/getJsonFiles")
async def getJsonFiles(request):
    josn=LoadTagsFile()
    return web.json_response(josn, content_type='application/json')


#测试翻译
@server.PromptServer.instance.routes.get("/api/sixgod/testTransServer")
async def testTransServer(request):
    trans_text = translate('苹果')
    if (trans_text.lower()!='apple'):
         trans_text='翻译失败'
    else:
         trans_text='接口正常'      
    return web.json_response(trans_text, content_type='application/json')

     
#翻译配置
@server.PromptServer.instance.routes.post("/api/sixgod/setTransServer")
async def setTransServer(request):
    post = await request.json()
    global transObj; transObj= {**post} 
    return web.json_response('ok', content_type='application/json')

@server.PromptServer.instance.routes.post("/api/sixgod/imaginePrompt")
async def imaginePrompt(request):
        post = await request.json()
        res=llm.chat_imagine(post,transObj)
        return web.json_response(res, content_type='application/json')
        # return web.json_response("测试啊", content_type='application/json')
    
 