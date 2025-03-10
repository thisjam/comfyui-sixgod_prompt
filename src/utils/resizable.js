 
export default {
  mounted(el, binding) {
    let scale = 1;
    const config = {
      minScale: 0.5,  // 最小缩放比例‌:ml-citation{ref="1" data="citationList"}
      maxScale: 3,    // 最大缩放比例‌:ml-citation{ref="1" data="citationList"}
      sensitivity: binding.value?.sensitivity || 0.1, // 灵敏度参数化‌:ml-citation{ref="2" data="citationList"}
      transformOrigin: 'center center' // 缩放中心点‌:ml-citation{ref="3" data="citationList"}
    };

    Object.assign(config, binding.value);
    el.style.transformOrigin = config.transformOrigin;

    // 解析原始transform属性‌:ml-citation{ref="3" data="citationList"}
    const originalTransform = el.style.transform.replace(/none/g, '') || '';
    let transformParts = originalTransform.split(') ').filter(Boolean);

    const handleWheel = (e) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -config.sensitivity : config.sensitivity;
      scale = Math.min(config.maxScale, Math.max(config.minScale, scale + delta));

      // 保留原有transform属性‌:ml-citation{ref="3,5" data="citationList"}
      const newTransform = [
        ...transformParts.filter(p => !p.startsWith('scale')),
        `scale(${scale})`
      ].join(') ') + (transformParts.length ? ')' : '');

      el.style.transform = newTransform;
      binding.value?.onUpdate?.(scale); // 触发回调函数‌:ml-citation{ref="5" data="citationList"}
    };

    el._wheelHandler = handleWheel;
    el.addEventListener('wheel', handleWheel, { passive: false });
  },
  unmounted(el) {
    el.removeEventListener('wheel', el._wheelHandler);
    delete el._wheelHandler;
  }
};

 