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
  variant?: 'default' | 'italic' | 'light' | 'hero'
  color?: 'primary' | 'secondary' | 'muted' | 'white'
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
  const baseClasses = 'font-montserrat'
  
  // Mobile-first responsive sizing with better scaling
  const sizeClasses = {
    1: 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl',
    2: 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl',
    3: 'text-xl sm:text-2xl md:text-3xl lg:text-4xl',
    4: 'text-lg sm:text-xl md:text-2xl',
    5: 'text-base sm:text-lg md:text-xl',
    6: 'text-sm sm:text-base md:text-lg'
  }
  
  const variantClasses = {
    default: 'font-extralight',
    italic: 'font-cormorant italic font-normal',
    light: 'font-light',
    hero: 'font-medium'
  }
  
  const colorClasses = {
    primary: 'text-[var(--color-text)]',
    secondary: 'text-[var(--color-secondary)]',
    muted: 'text-[var(--color-text)]/70',
    white: 'text-white'
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
    alignClasses[props.align],
    'leading-tight'
  ].filter(Boolean).join(' ')
})
</script> 