<!-- Tabs组件 -->
<template>
    <div class="next-gen-tabs">
        <div class="tabs-container" ref="tabsRef">
            <div v-for="(pane, index) in panes" :key="pane.id" class="tab-item"
                :class="{ active: activeTabIndex === index }" @click="switchTab(index)" ref="tabItems">
                {{ pane.title }}
            </div>
            <div class="active-line" :style="activeLineStyle"></div>

        </div>

        <div class="tab-content">
            <slot></slot>
        </div>

    </div>
</template>

<script setup>
import { ref, watch, onMounted, nextTick, computed, provide, onUnmounted, useSlots, watchEffect } from 'vue';


const activeTabIndex = defineModel()
const tabsRef = ref(null);
const tabItems = ref([]);
const panes = ref([])

// 获取插槽内容
const slots = useSlots();

const activeLineStyle = ref({
    width: '0px',
    transform: 'translateX(0)'
});

provide('activeTabIndex', computed(() => activeTabIndex.value));

function generateUniqueId() {
    return `tab-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
watchEffect(getSlotData);
// function getSlotData() {
//     if (slots.default) {
//         const tabItems = slots.default().filter((vnode) => vnode.type.name === 'TabItem');

//         panes.value = tabItems.map((vnode, index) => ({
//             id: generateUniqueId(),
//             title: vnode.props?.title || `Tab ${index + 1}`,
//         }));


//         console.log('slots.default', slots.default().length);
//         console.log('slots', slots.default());

//     }


// }
function getSlotData() {
    if (!slots.default) return;
    let rawVNodesString = 'Symbol(v-fgt)'
    // 获取插槽内容
    const rawVNodes = slots.default();

    // 检查是否是动态渲染（Fragment）
    const isFragment = rawVNodes.length === 1 && typeof rawVNodes[0].type === 'symbol' && rawVNodes[0].type.toString() === rawVNodesString;
    // 提取子节点
    const tabItems = isFragment
        ? rawVNodes[0]?.children || [] // 动态渲染：从 children 中提取子节点
        : rawVNodes; // 静态渲染：直接使用 rawVNodes

    // 过滤有效的 TabItem 节点
    const filteredTabItems = tabItems.filter((vnode) => vnode.type.name === 'TabItem');

    // 构建 panes 数据

    panes.value = filteredTabItems.map((vnode, index) => ({
        id: `tab-${index}`,
        title: vnode.props?.title || `Tab ${index + 1}`,
    }));
    
  
  
    


}




const switchTab = async (index) => {
    activeTabIndex.value = index;
};

const updateActiveLine = async () => {
    await nextTick();
    const activeTab = tabItems.value[activeTabIndex.value];
    if (!activeTab) return;

    const { left, width } = activeTab.getBoundingClientRect();
    const containerLeft = tabsRef.value.getBoundingClientRect().left;

    activeLineStyle.value = {
        width: `${width}px`,
        transform: `translateX(${left - containerLeft}px)`,
        transition: `transform 0.4s var(--transition-curve), 
                  width 0.4s var(--transition-curve)`
    };
};

let observer = null;
// 确保子组件挂载完成后解析插槽内容
onMounted(async () => {
    await nextTick();
    getSlotData();
    updateActiveLine();
    observer = new ResizeObserver(updateActiveLine);
    observer.observe(tabsRef.value);
});
onUnmounted(() => observer.disconnect());
watch(activeTabIndex, updateActiveLine);
</script>

<style scoped>
.next-gen-tabs {
  
    --transition-curve: cubic-bezier(0.34, 1.56, 0.64, 1);
}

.tabs-container {
    position: relative;
    display: flex;
    gap: 32px;
    /* padding: 0 24px; */
    box-sizing: border-box;
    border-bottom: 1px solid  var(--tags-bottom-bg-color);
}


.tab-item {
    cursor: pointer;
    padding: 12px 0;
    font-size: 16px;
    transition: color 0.3s var(--transition-curve);
    color: var(--tags-text-color);
    white-space: nowrap;
}

.tab-item.active {
    color: var(--tags-active-color);
    font-weight: 500;
}

.active-line {
    position: absolute;
    bottom: -2px;
    height: 3px;
    background: var(--tags-active-color);
    border-radius: 2px;
    will-change: transform, width;
    backface-visibility: hidden;
    /* box-shadow: 0 2px 8px rgba(42, 133, 255, 0.2); */
}
</style>