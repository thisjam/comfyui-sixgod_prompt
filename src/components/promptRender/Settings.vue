<template>
    <div class="sixgod-settings">
        <button class="btn" @click="isshow = !isshow">设置</button>
        <Dialog v-model="isshow">
            <template v-slot:head>
                <div>配置</div>
            </template>
            <template v-slot:content>
                <Tabs style="padding: 10px;" v-model="activeIndex" class="setting-content">
                    <TabItem title="翻译设置" index="0">
                        <div style="padding: 20px 5px;">
                            <div class="line">
                                <label>自动翻译</label>
                                <div>
                                    <label>
                                        <input type="radio" :value="true" v-model="transObj.enable" />
                                        开启自动翻译
                                    </label>

                                    <label>
                                        <input type="radio" :value="false" v-model="transObj.enable" />
                                        关闭自动翻译
                                    </label>
                                </div>
                                <label>服务商</label>
                                <select v-model="transObj.server">
                                    <option value="free">免费</option>
                                    <option value="baidu">百度</option>
                                    <option value="llm">大语言模型</option>
                                </select>
                                <template v-if="transObj.server == 'baidu'">
                                    <label for="">APPID:</label> <input type="text" v-model="transObj.appid">
                                    <label for="">密钥:</label> <input type="text" v-model="transObj.secret">
                                </template>
                                <button class="btn" @click="testTransServer">测试翻译</button>
                                <label for="">{{ txt_test_trans }}</label>

                            </div>

                        </div>
                    </TabItem>
                    <TabItem title="大语言模型" index="1">
                        <div style="padding: 20px 5px;">
                            <div class="line">
                                <label>模型名【不要带文件名后缀】:</label>
                                <input type="text" v-model="transObj.llmName">
                                <label>gpu层数【0~？,-1为全部】:</label>
                                <input type="text" v-model="transObj.n_gpu_layers">
                                <label>temperature【想象力】:</label>
                                <input type="text" v-model="transObj.temperature">
                                <label>preset【系统指令预设】:</label>
                                <textarea type="text" v-model="transObj.preset" rows="5"></textarea>
                            </div>

                        </div>
                    </TabItem>
                    <TabItem title="快速呼出设置" index="2">
                        <div class="line" style="padding: 20px 5px;">
                            <label>快速呼出设置</label>
                            <div>
                                <label>
                                    <input type="radio" :value="true" v-model="transObj.isdbClick" />
                                    启用鼠标双击呼出界面
                                </label>

                                <label>
                                    <input type="radio" :value="false" v-model="transObj.isdbClick" />
                                    启用鼠标三击呼出界面
                                </label>
                            </div>
                            <label>边框高亮</label>
                            <div>
                                <label>
                                    <input type="radio" :value="true" v-model="transObj.isshowBorder" />
                                    显示绑定输入框边框颜色高亮
                                </label>

                                <label>
                                    <input type="radio" :value="false" v-model="transObj.isshowBorder" />
                                    隐藏绑定输入框边框颜色高亮
                                </label>
                            </div>

                            <label v-show="transObj.isshowBorder">选择一种颜色</label>
                            <div  v-show="transObj.isshowBorder"> <input type="color" style="margin-right: 10px;" id="colorPicker" v-model="transObj.borderColor">{{
                                transObj.borderColor }}</div>

                            <label  v-show="transObj.isshowBorder">边框大小</label>
                            <div  v-show="transObj.isshowBorder"> <input type="range"  style="margin-right: 10px;" id="slider" min="1" max="10" v-model="transObj.borderWidth">{{
                                transObj.borderWidth }}</div>

                        </div>

                    </TabItem>


                    <div class="save-setting"><button @click="saveSettings" class="btn">保存配置</button></div>
                </Tabs>

            </template>

        </Dialog>

    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import Dialog from './Dialog.vue';
import TabItem from './TabItem.vue';
import Tabs from './Tabs.vue';

const isshow = ref(false)
const activeIndex = ref(0)
const txt_test_trans = ref('')

const transObj = ref({
    enable: true,
    isdbClick: true,
    borderColor: '#1dcb10',
    borderWidth: 1,
    isshowBorder: true,
    server: 'free',
    appid: '',
    secret: '',
    llmName: 'qwen1_5-4b-chat-q2_k',
    n_gpu_layers: -1,
    temperature: 1.2,
    preset: '你是一名AI提示词工程师，用提供的关键词构思一副精美的构图画面，用一句话回复我，自定义风格、场景、装饰等，尽量详细，用中文回复'
})

function saveSettings(istips = true) {
    console.log(transObj.value);

    localStorage.setItem('transObj', JSON.stringify(transObj.value))
    setTransServer()
    istips && alert('保存成功')
}

function setTransServer() {
    if (localStorage.getItem('transObj')) {
        transObj.value = JSON.parse(localStorage.getItem('transObj'))
    }
    fetch('api/sixgod/setTransServer', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(transObj.value),
    })

}
function testTransServer() {
    txt_test_trans.value = '正在测试...'

    fetch('api/sixgod/testTransServer').then(res => res.json()).then(data => {
        txt_test_trans.value = data
    }).catch(error => {
        // 捕获所有错误（包括网络错误和 HTTP 错误）
        txt_test_trans.value = '翻译失败';
    });
}
onMounted(() => {
    setTransServer();
})
</script>

<style lang="scss" scoped>
.setting-content {
    min-height: 300px;
    position: relative;


}

.line {
    display: grid;
    grid-template-columns: max-content 400px;
    align-items: center;
    text-align: left;
    gap: 1.5em;
    font-size: 0.8em;
    margin-bottom: 50px;

}

.save-setting {
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    bottom: 10px;
}
</style>
