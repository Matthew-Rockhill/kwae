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
  variant?: 'default' | 'italic' | 'light' | 'hero' | 'gradient' | 'glow'
  color?: 'primary' | 'secondary' | 'muted' | 'white' | 'gradient'
  align?: 'left' | 'center' | 'right'
  animate?: boolean
  decoration?: 'none' | 'underline' | 'dots' | 'accent'
  shadow?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  level: 1,
  variant: 'default',
  color: 'primary',
  align: 'left',
  animate: false,
  decoration: 'none',
  shadow: false
})

const tag = computed(() => `h${props.level}`)

const headingClasses = computed(() => {
  const baseClasses = 'font-montserrat tracking-tight transition-all duration-300'
  
  // Modern typography scale with improved hierarchy
  const sizeClasses = {
    1: 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extralight tracking-tight',
    2: 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extralight', 
    3: 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light',
    4: 'text-xl sm:text-2xl md:text-3xl font-light',
    5: 'text-lg sm:text-xl md:text-2xl font-normal',
    6: 'text-base sm:text-lg md:text-xl font-medium'
  }
  
  const variantClasses = {
    default: '',
    italic: 'font-cormorant italic font-light',
    light: 'font-extralight tracking-wide',
    hero: 'font-light tracking-tight',
    gradient: 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent',
    glow: 'drop-shadow-glow'
  }
  
  const colorClasses = {
    primary: 'text-[var(--color-text)]',
    secondary: 'text-[var(--color-secondary)]',
    muted: 'text-[var(--color-text)]/70',
    white: 'text-white',
    gradient: 'bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-primary)] bg-clip-text text-transparent animate-gradient'
  }
  
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  }

  // Improved line heights based on heading level
  const lineHeightClasses = {
    1: 'leading-[1.1]',
    2: 'leading-[1.15]', 
    3: 'leading-[1.2]',
    4: 'leading-[1.3]',
    5: 'leading-[1.4]',
    6: 'leading-[1.5]'
  }
  
  const animationClass = props.animate ? 'animate-fade-in-up' : ''
  
  // Shadow classes
  const shadowClasses = {
    default: props.shadow ? 'drop-shadow-lg' : '',
    white: props.shadow ? 'drop-shadow-2xl' : '',
    hero: 'drop-shadow-2xl'
  }
  
  // Decoration classes
  const decorationClasses = {
    none: '',
    underline: 'relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-[var(--color-secondary)] after:to-transparent after:transform after:scale-x-0 after:origin-left after:transition-transform after:duration-500 hover:after:scale-x-100',
    dots: 'relative after:absolute after:-bottom-2 after:left-1/2 after:-translate-x-1/2 after:flex after:gap-1 after:content-[""] before:content-[""] before:absolute before:-bottom-2 before:left-1/2 before:-translate-x-1/2 before:w-1 before:h-1 before:bg-[var(--color-secondary)] before:rounded-full',
    accent: 'relative pl-6 before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-[80%] before:bg-gradient-to-b before:from-[var(--color-secondary)] before:to-transparent before:rounded-full'
  }

  const getShadowClass = () => {
    if (props.variant === 'hero' || props.color === 'white') return shadowClasses.hero
    return shadowClasses.default
  }

  return [
    baseClasses,
    sizeClasses[props.level],
    variantClasses[props.variant],
    colorClasses[props.color],
    alignClasses[props.align],
    lineHeightClasses[props.level],
    animationClass,
    getShadowClass(),
    decorationClasses[props.decoration]
  ].filter(Boolean).join(' ')
})
</script> 