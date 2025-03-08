from baidu import BaiduTranslator
from llmTranslate import  LLMTranslator
from freebd import  FreeBDTranslator
from Translator import TranslatorInterface

class TranslatorFactory:
    @staticmethod
    def create_translator(service_type: str,**kwargs) -> TranslatorInterface:
        pass
        if  service_type == 'baidu':
            return BaiduTranslator(**kwargs)
        elif service_type == 'free':
            return FreeBDTranslator(**kwargs)
        elif service_type == 'llm':
            return LLMTranslator(**kwargs)
        else:
            raise ValueError(f"未知的服务类型: {service_type}")
    
if __name__ == '__main__':
    text="一个女孩在雨中行走"
    baidu_translator= TranslatorFactory.create_translator("free")
    res = baidu_translator.translate(text)
    print(res)
    
 



 