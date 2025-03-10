// draggable.js
export default {
    mounted(el) {
      let isDragging = false;
      let startX = 0, startY = 0;
      let initialTransform = el.style.transform; // 保存初始 transform
      let initialCursor = document.body.style.cursor; // 保存初始光标
  
      // 确保 fixed 定位并初始化坐标
      const computedStyle = window.getComputedStyle(el);
      if (computedStyle.position !== 'fixed') {
        el.style.position = 'fixed';
      }
  
      // 移除 transform 并基于当前位置设置 left/top
      const rect = el.getBoundingClientRect();
      el.style.transform = 'none'; // 禁用 transform
      el.style.left = `${rect.left}px`;
      el.style.top = `${rect.top}px`;
  
      const onMouseMove = (e) => {
        if (!isDragging) return;
        el.style.left = `${e.clientX - startX}px`;
        el.style.top = `${e.clientY - startY}px`;
      };
  
      const onMouseUp = () => {
        isDragging = false;
        document.body.style.cursor = initialCursor; // 恢复光标
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };
  
      el.onmousedown = (e) => {
        isDragging = true;
        document.body.style.cursor = 'grabbing'; // 拖拽时显示抓取光标
  
        // 计算初始偏移（处理可能的空值）
        const left = parseFloat(el.style.left) || 0;
        const top = parseFloat(el.style.top) || 0;
        startX = e.clientX - left;
        startY = e.clientY - top;
  
        e.preventDefault(); // 防止文本选中
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
      };
  
      // 清理函数
      el.cleanup = () => {
        document.body.style.cursor = initialCursor;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        el.style.transform = initialTransform; // 恢复原始 transform
      };
    },
  
    unmounted(el) {
      if (el.cleanup) el.cleanup();
    }
  };