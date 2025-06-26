<template>
  <component 
    :is="tag"
    :class="headingClasses"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  level?: 1 | 2 | 3 | 4 | 5 | 6
  variant?: 'default' | 'italic' | 'light'
  color?: 'primary' | 'secondary' | 'muted'
  align?: 'left' | 'center' | 'right'
}

const props = withDefaults(defineProps<Props>(), {
  level: 1,
  variant: 'default',
  color: 'primary',
  align: 'left'
})

const tag = computed(() => `h${props.level}`)

const headingClasses = computed(() => {
  const baseClasses = 'font-extralight'
  
  const sizeClasses = {
    1: 'text-4xl md:text-5xl',
    2: 'text-3xl md:text-4xl',
    3: 'text-2xl md:text-3xl',
    4: 'text-xl md:text-2xl',
    5: 'text-lg md:text-xl',
    6: 'text-base md:text-lg'
  }
  
  const variantClasses = {
    default: '',
    italic: 'font-cormorant italic',
    light: 'font-light'
  }
  
  const colorClasses = {
    primary: 'text-[var(--color-text)]',
    secondary: 'text-[var(--color-secondary)]',
    muted: 'text-[var(--color-text)]/70'
  }
  
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  }
  
  return [
    baseClasses,
    sizeClasses[props.level],
    variantClasses[props.variant],
    colorClasses[props.color],
    alignClasses[props.align]
  ].filter(Boolean).join(' ')
})
</script> 