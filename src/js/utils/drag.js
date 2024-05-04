// 在src/directives/Draggable.js
export default {
    mounted(el, binding) {
      let isDragging = false;
      let isMoved = false;
      let dragStartTime = 0;
      const clickThreshold = 200; 
      const onMouseDown = (event) => {
        if (event.button !== 0) return;
        isMoved = false;
        isDragging = true;
        dragStartTime = event.timeStamp;
        const { clientX, clientY } = event;
        const { left, top } = el.getBoundingClientRect();
        const offsetX = clientX - left;
        const offsetY = clientY - top;
        const onMouseMove = (moveEvent) => {
          moveEvent.preventDefault(); 
          if (!isDragging) return;
          isMoved = true; 
          const { clientX: moveX, clientY: moveY } = moveEvent;
          const finalX = moveX - offsetX;
          const finalY = moveY - offsetY;
          el.style.position = 'fixed';
          el.style.cursor = 'move';
          el.style.left = `${finalX}px`;
          el.style.top = `${finalY}px`;
        };
  
        const onMouseUp = (event) => {
          const duration = event.timeStamp - dragStartTime;
  
          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', onMouseUp);
          el.style.cursor = 'pointer';
          if (isDragging) {
            isDragging = false;
            if (isMoved || duration > clickThreshold) {
              event.preventDefault(); 
              if (typeof binding.value === 'object' && binding.value.onDragEnd) {
                binding.value.onDragEnd(event); 
              }
            } else {
              if (typeof binding.value === 'object' && binding.value.onClick) {
                binding.value.onClick(event);
              }
            }
          }
        };
  
   
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
      };
  
      el.addEventListener('mousedown', onMouseDown);
    }
  };