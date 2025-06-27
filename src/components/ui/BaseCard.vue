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
  const baseClasses = 'transition-all duration-300'
  
  const variantClasses = {
    default: 'bg-[var(--color-light)]',
    elevated: 'bg-[var(--color-light)] shadow-lg hover:shadow-xl',
    outlined: 'bg-transparent border border-[var(--color-text)]/20',
    ghost: 'bg-transparent'
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
  
  const shadowClass = props.shadow && props.variant !== 'elevated' ? 'shadow-md hover:shadow-lg' : ''
  const roundedClass = props.rounded ? 'rounded-lg' : ''
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