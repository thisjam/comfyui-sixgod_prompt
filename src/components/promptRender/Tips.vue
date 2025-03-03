<template>
    <div class="tooltip-wrapper">
        <span ref="triggerRef" class="tooltip-trigger" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
            <slot></slot>
        </span>
        <div v-show="isVisible" ref="tooltipRef" class="tooltip" :class="computedPosition" :style="tooltipStyles">
            {{ content }}
            <div class="tooltip-arrow" :style="arrowStyles"></div>
        </div>
    </div>
</template>

<script>
import { ref, nextTick, onBeforeUnmount } from 'vue';

export default {
    props: {
        content: {
            type: String,
            required: true,
        },
        delay: {
            type: Number,
            default: 100,
        },
    },
    setup(props) {
        const isVisible = ref(false);
        const triggerRef = ref(null);
        const tooltipRef = ref(null);
        const tooltipStyles = ref({ top: '0', left: '0' });
        const arrowStyles = ref({ left: '50%' }); // 初始化三角图标位置
        const computedPosition = ref('bottom');
        let timeoutId = null;
        let scrollHandler = null;

        const calculatePosition = () => {
            if (!triggerRef.value || !tooltipRef.value) return;

            const triggerRect = triggerRef.value.getBoundingClientRect();
            const tooltipRect = tooltipRef.value.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const windowWidth = window.innerWidth;

            // 垂直位置计算
            let desiredTop = triggerRect.bottom + 8;
            let desiredPosition = 'bottom';

            if (desiredTop + tooltipRect.height > windowHeight) {
                desiredTop = triggerRect.top - tooltipRect.height - 8;
                desiredPosition = 'top';
            }

            // 水平位置计算
            let desiredLeft = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
            desiredLeft = Math.max(0, Math.min(desiredLeft, windowWidth - tooltipRect.width));

            // 动态调整三角图标位置
            const arrowLeft = Math.max(
                8, // 最小偏移量，防止超出 Tooltip 边界
                Math.min(
                    triggerRect.left - desiredLeft + triggerRect.width / 2, // 计算三角图标相对于 Tooltip 的中心位置
                    tooltipRect.width - 8 // 最大偏移量，防止超出 Tooltip 边界
                )
            );

            tooltipStyles.value = {
                top: `${desiredTop}px`,
                left: `${desiredLeft}px`,
            };
            computedPosition.value = desiredPosition;
            arrowStyles.value = {
                left: `${arrowLeft}px`, // 设置三角图标的位置
            };
        };

        const showTooltip = async () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(async () => {
                isVisible.value = true;
                await nextTick();
                calculatePosition();
                scrollHandler = () => (isVisible.value = false);
                window.addEventListener('scroll', scrollHandler, true);
            }, props.delay);
        };

        const hideTooltip = () => {
            clearTimeout(timeoutId);
            isVisible.value = false;
            if (scrollHandler) {
                window.removeEventListener('scroll', scrollHandler, true);
            }
        };

        onBeforeUnmount(() => {
            hideTooltip();
        });

        return {
            isVisible,
            triggerRef,
            tooltipRef,
            tooltipStyles,
            arrowStyles, // 新增：三角图标样式
            computedPosition,
            handleMouseEnter: showTooltip,
            handleMouseLeave: hideTooltip,
        };
    },
};
</script>

<style scoped>
.tooltip-wrapper {
    display: inline-block;
    position: relative;
}

.tooltip-trigger {
    cursor: default;
}

.tooltip {
    position: fixed;
    background: var(--btn-prompt-hover-bg-color);
    color: var(--btn-prompt-hover-color);
    padding: 8px 12px;
    border-radius: 4px;
    font-size: 12px;
    z-index: 9999;
    max-width: 400px;
    text-align: center;
    min-width: 100px;
    word-wrap: break-word;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    animation: fadeIn 0.2s ease-out;
}

.tooltip-arrow {
    position: absolute;
    width: 8px;
    height: 8px;
    background: var(--btn-prompt-hover-bg-color);
    transform: rotate(45deg);
}

.tooltip.bottom .tooltip-arrow {
    top: -4px;
}

.tooltip.top .tooltip-arrow {
    bottom: -4px;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-2px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>