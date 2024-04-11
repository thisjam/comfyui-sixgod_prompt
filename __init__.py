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
 

 
class SixGodPrompts:
    def __init__(self):
        pass
    
    @classmethod
    def INPUT_TYPES(s):  
        return {"required": {
            "text": ("STRING", {"multiline": True,"placeholder": "alt+q 呼出/隐藏 词库面板"}),
            "clip": ("CLIP",),
            "seed": ("INT", {"default": 0, "min": 0, "max":sys.maxsize})
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
    
 






WEB_DIRECTORY = "./javascript"


NODE_CLASS_MAPPINGS = {
    "SixGodPrompts": SixGodPrompts,
    
}

 
NODE_DISPLAY_NAME_MAPPINGS = {
    "SixGodPrompts": "SixGodPrompts(v1.2)",
     
}


comfy_path = os.path.dirname(folder_paths.__file__)
mycss_path = os.path.join(comfy_path, 'custom_nodes','comfyui-sixgod_prompt','sixgod.css')
css_path = os.path.join(comfy_path, "web",'sixgod.css')
shutil.copy(mycss_path, css_path)

current_script = os.path.realpath(__file__)
current_folder = os.path.dirname(current_script)   #本插件目录  
path1 = current_folder+ r"/json"
path2 = current_folder+ r"/yours"


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




@server.PromptServer.instance.routes.get("/api/sixgod/getJsonFiles")
async def getJsonFiles(request):
    josn=LoadTagsFile()
    return web.json_response(josn, content_type='application/json')



 
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
    

 
def decodeLong(data):
      
     return data['data'][0]['dst']

def decodeShort(data):
     result=json.loads(data['result'])  
     restcont=result['content'][0]['mean'][0]['cont']
     restext=list(restcont.keys())[0]
     return restext

def decodeText(data,trans_text): 
    jsonObj=json.loads(data.content.decode('utf-8'))
    if 'type' in jsonObj:
        if(jsonObj['type']==1): # type=1||2
             return  decodeShort(jsonObj)
        else :
             return  decodeLong(jsonObj)        
    else:
        return trans_text
   
def translate(trans_text):
    url1="https://fanyi.baidu.com/transapi"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.182 Safari/537.36',
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }

    postdata1={
        "from": "zh",
        "to": "en",
        "query": trans_text,
        "source": "txt",
    }
    try:    
        res= requests.post(url1,headers=headers,data=postdata1)   
        return decodeText(res,trans_text)

    except requests.exceptions.RequestException as e:
        print(f"err：{e}")
        return trans_text    