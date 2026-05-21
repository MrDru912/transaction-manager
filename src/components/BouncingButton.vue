<template>
  <button
    v-ripple
    v-bind="$attrs"
    class="shimmer-btn"
    :class="{ 'is-pressed': pressed }"
    :style="{
        ...sizeStyle,
      backgroundColor: `rgba(${colorRgb}, 0.15)`,
      color: color,
    }"
    @mousedown="pressed = true"
    @mouseup="pressed = false;"
    @mouseleave="pressed = false"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const props = withDefaults(defineProps<{
  color?: string;
  width?: string | number;
  height?: string | number;
}>(), {
  color: '#43c6ac',
  height: 55,
});

defineOptions({
  inheritAttrs: false // important - lets control where $attrs go
})

const pressed = ref(false);

const sizeStyle = computed(() => ({
  height: typeof props.height === 'number' ? `${props.height}px` : props.height,
  width: props.width 
    ? (typeof props.width === 'number' ? `${props.width}px` : props.width)
    : 'fit-content',
}));

// converts hex to rgb so we can use it with opacity
const colorRgb = computed(() => {
  const hex = props.color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `${r}, ${g}, ${b}`;
});
</script>

<style scoped>
.shimmer-btn {
  position: relative;
  overflow: hidden;
  height: 55px;
  padding: 0 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  margin-inline: 3px;
  transition: transform 0.2s ease, background-color 0.15s ease;

  width: auto;
  min-width: min-content;
  padding: 0 8px;
  white-space: nowrap;

}

.shimmer-btn:hover {
  filter: brightness(1.15);
}

.shimmer-btn.is-pressed {
  transform: scale(0.95);
}
</style>