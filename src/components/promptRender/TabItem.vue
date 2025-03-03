<!-- TabItem组件 -->
<template>
    <div v-show="isActive" >
        <slot></slot>
    </div>
 
</template>

<script setup>
import { inject, computed, onMounted, onUnmounted, provide } from 'vue'
 
defineOptions({
    inheritAttrs: false,
    name: 'TabItem',
})
const uniqueId = generateUniqueId();
const props = defineProps({
    index: { type: [String, Number], required: true },
    title: { type: String, required: true }
})


function generateUniqueId() {
    return `tab-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}


const activeTabIndex = inject('activeTabIndex')
onMounted(() => {
 
});
onUnmounted(() => {
 
});

 



const isActive = computed(() => props.index == activeTabIndex.value)


</script>