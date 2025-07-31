<template>
  <button 
    :class="buttonClasses"
    @click="$emit('click', $event)"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'ghost' | 'white'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  fullWidth: false,
  disabled: false
})

defineEmits<{
  click: [event: MouseEvent]
}>()

const buttonClasses = computed(() => {
  const baseClasses = 'transition-all duration-300 rounded-lg uppercase tracking-wider font-light hover:scale-105 hover:shadow-lg transform-gpu'
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-hover)] hover:from-[var(--color-primary-hover)] hover:to-[var(--color-primary)] text-[var(--color-text-light)] shadow-md',
    secondary: 'bg-transparent hover:bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] border border-[var(--color-secondary)] hover:border-[var(--color-secondary-hover)] hover:shadow-md',
    ghost: 'bg-transparent hover:bg-[var(--color-text)]/5 text-[var(--color-text)] hover:shadow-sm',
    white: 'bg-white hover:bg-gray-50 text-[var(--color-text)] border border-white hover:shadow-md'
  }
  
  const sizeClasses = {
    sm: 'px-6 py-2 text-sm',
    md: 'px-8 py-3 text-base',
    lg: 'px-10 py-4 text-lg'
  }
  
  const widthClass = props.fullWidth ? 'w-full' : ''
  const disabledClass = props.disabled ? 'opacity-50 cursor-not-allowed hover:scale-100 hover:shadow-none' : ''
  
  return [
    baseClasses,
    variantClasses[props.variant],
    sizeClasses[props.size],
    widthClass,
    disabledClass
  ].filter(Boolean).join(' ')
})
</script> 