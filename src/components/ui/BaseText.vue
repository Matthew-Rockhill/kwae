<template>
  <component 
    :is="tag"
    :class="textClasses"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  tag?: 'p' | 'span' | 'div' | 'small'
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl'
  weight?: 'light' | 'normal' | 'medium' | 'semibold'
  color?: 'primary' | 'secondary' | 'muted' | 'light' | 'white'
  opacity?: number
  italic?: boolean
  align?: 'left' | 'center' | 'right'
  leading?: 'tight' | 'normal' | 'relaxed' | 'loose'
}

const props = withDefaults(defineProps<Props>(), {
  tag: 'p',
  size: 'base',
  weight: 'normal',
  color: 'primary',
  italic: false,
  align: 'left',
  leading: 'normal'
})

const textClasses = computed(() => {
  const baseClasses = ''
  
  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  }
  
  const weightClasses = {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold'
  }
  
  const colorClasses = {
    primary: props.opacity ? `text-[var(--color-text)]/${props.opacity}` : 'text-[var(--color-text)]',
    secondary: 'text-[var(--color-secondary)]',
    muted: 'text-[var(--color-text)]/70',
    light: 'text-[var(--color-text)]/60',
    white: 'text-[var(--color-text-light)]'
  }
  
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  }
  
  const leadingClasses = {
    tight: 'leading-tight',
    normal: 'leading-normal',
    relaxed: 'leading-relaxed',
    loose: 'leading-loose'
  }
  
  const italicClass = props.italic ? 'italic' : ''
  
  return [
    baseClasses,
    sizeClasses[props.size],
    weightClasses[props.weight],
    colorClasses[props.color],
    alignClasses[props.align],
    leadingClasses[props.leading],
    italicClass
  ].filter(Boolean).join(' ')
})
</script> 