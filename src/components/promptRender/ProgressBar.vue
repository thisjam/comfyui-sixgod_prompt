<template>
 
  <div  v-if="props.max > 0" class="progress-container">
    <div class="progress-bar" :style="{ width: calculatedProgress + '%' }"></div>
  </div>
 

</template>

<script setup>
import { computed, watch } from 'vue';

// 定义props
const props = defineModel()



// 计算属性来计算当前进度的百分比
const calculatedProgress = computed(() => (props.value.value / props.value.max) * 100);

// 监听value的变化
watch(() => props.value.value, (newValue) => {
  if (newValue >= props.value.max) {
    props.value.max = 0;
    props.value.value = 0;

  }
}, { immediate: false }); // 不需要立即触发
</script>

<style scoped>
.progress-container {
  width: 100%;
  background-color: #ddd;
  margin-bottom: 20px;
  height: 5px;
  border-radius: 5px;
}

.progress-bar {
  height: 100%;
  width: 0%;
  background-color: #4caf50;
  text-align: center;
  line-height: 30px;
  color: white;
  border-radius: 5px;

}
</style>