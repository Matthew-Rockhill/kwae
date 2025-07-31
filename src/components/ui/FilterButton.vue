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
  const baseClasses = 'px-3 py-1.5 sm:px-4 sm:py-2 md:px-5 md:py-2 font-light text-sm sm:text-base touch-action-manipulation rounded-full border border-[var(--color-accent)]/20'
  
  if (props.active) {
    return `${baseClasses} bg-[var(--color-text)] text-[var(--color-light)] border-[var(--color-text)]`
  } else {
    return `${baseClasses} bg-[var(--color-light)] text-[var(--color-text)] hover:bg-[var(--color-accent)]/10 hover:border-[var(--color-accent)]/40 active:bg-[var(--color-accent)]/20`
  }
})
</script> 