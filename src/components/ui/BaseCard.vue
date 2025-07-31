<template>
  <div :class="cardClasses">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'default' | 'elevated' | 'outlined' | 'ghost'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  background?: 'light' | 'accent' | 'white' | 'transparent'
  shadow?: boolean
  rounded?: boolean
  fullHeight?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  padding: 'lg',
  background: 'light',
  shadow: true,
  rounded: true,
  fullHeight: false
})

const cardClasses = computed(() => {
  const baseClasses = 'transition-all duration-300 transform-gpu'
  
  const variantClasses = {
    default: 'bg-[var(--color-light)] shadow-modern-sm hover:shadow-modern-md',
    elevated: 'bg-[var(--color-light)] shadow-modern-md hover:shadow-modern-lg hover:-translate-y-1',
    outlined: 'bg-transparent border border-[var(--color-text)]/20 hover:border-[var(--color-text)]/30 hover:shadow-modern-sm',
    ghost: 'bg-transparent hover:bg-[var(--color-light)]/50'
  }
  
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }
  
  const backgroundClasses = {
    light: 'bg-[var(--color-light)]',
    accent: 'bg-[var(--color-accent)]',
    white: 'bg-white',
    transparent: 'bg-transparent'
  }
  
  const shadowClass = props.shadow && props.variant !== 'elevated' ? 'shadow-modern-sm hover:shadow-modern-md' : ''
  const roundedClass = props.rounded ? 'rounded-xl' : ''
  const heightClass = props.fullHeight ? 'h-full' : ''
  
  return [
    baseClasses,
    props.variant === 'default' ? backgroundClasses[props.background] : variantClasses[props.variant],
    paddingClasses[props.padding],
    shadowClass,
    roundedClass,
    heightClass
  ].filter(Boolean).join(' ')
})
</script> 