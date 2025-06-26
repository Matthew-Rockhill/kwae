<template>
  <button 
    :class="buttonClasses"
    @click="$emit('click')"
    class="transition-all duration-300 transform hover:scale-105"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  active?: boolean
  variant?: 'primary' | 'secondary'
}

const props = withDefaults(defineProps<Props>(), {
  active: false,
  variant: 'primary'
})

defineEmits<{
  click: []
}>()

const buttonClasses = computed(() => {
  const baseClasses = 'px-5 py-2 font-light'
  
  if (props.active) {
    return `${baseClasses} bg-[var(--color-text)] text-[var(--color-light)]`
  } else {
    return `${baseClasses} bg-[var(--color-light)] text-[var(--color-text)] hover:bg-[var(--color-accent)]`
  }
})
</script> 