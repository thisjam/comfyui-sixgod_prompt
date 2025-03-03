<template>
  <!-- <div>
    <div ref="mainDiv">
      <textarea name="" id="" data-focus-id="11"></textarea>
      <textarea name="" id="" data-focus-id="12"></textarea>
    </div>
    <div>
      <button @click="add">添加</button>
    </div>
  </div> -->

  <MainApp></MainApp>
</template>

<script setup>
import { ref } from 'vue'
import MainApp from './components/MainApp.vue'
// const mainDiv = ref(null)

// function add() {
//   const newTextarea = document.createElement('textarea');
//   newTextarea.style.display = 'block';
//   newTextarea.style.marginBottom = '10px';
//   mainDiv.value.appendChild(newTextarea);
// }

</script>

<style lang="scss" scoped></style>
