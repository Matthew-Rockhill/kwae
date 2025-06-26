<template>
  <svg 
    :class="iconClasses"
    :viewBox="viewBox"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <slot />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  color?: 'primary' | 'secondary' | 'muted' | 'white' | 'current'
  viewBox?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  color: 'current',
  viewBox: '0 0 20 20'
})

const iconClasses = computed(() => {
  const sizeClasses = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
    xl: 'h-8 w-8'
  }
  
  const colorClasses = {
    primary: 'text-[var(--color-text)]',
    secondary: 'text-[var(--color-secondary)]',
    muted: 'text-[var(--color-text)]/70',
    white: 'text-[var(--color-text-light)]',
    current: 'text-current'
  }
  
  return [
    'flex-shrink-0',
    sizeClasses[props.size],
    colorClasses[props.color]
  ].join(' ')
})
</script> 