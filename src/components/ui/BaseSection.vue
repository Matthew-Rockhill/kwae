<template>
  <section :class="sectionClasses">
    <div :class="containerClasses">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  background?: 'light' | 'accent' | 'primary' | 'transparent' | 'alabaster' | 'white'
  padding?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'none'
  fullWidth?: boolean
  spacing?: 'tight' | 'normal' | 'relaxed' | 'loose'
}

const props = withDefaults(defineProps<Props>(), {
  background: 'transparent',
  padding: 'lg',
  fullWidth: false,
  spacing: 'normal'
})

// Content spacing classes for internal elements
const spacingClasses = {
  tight: 'space-y-4 sm:space-y-6',
  normal: 'space-y-6 sm:space-y-8', 
  relaxed: 'space-y-8 sm:space-y-12',
  loose: 'space-y-12 sm:space-y-16'
}

const sectionClasses = computed(() => {
  const backgroundClasses = {
    light: 'bg-[var(--color-light)]',
    accent: 'bg-[var(--color-accent)]',
    primary: 'bg-[var(--color-text)]',
    transparent: 'bg-transparent',
    alabaster: 'bg-[var(--color-alabaster)]',
    white: 'bg-white'
  }
  
  // Modern spacing system with 2025 standards
  const paddingClasses = {
    none: '',
    xs: 'py-6 sm:py-8',
    sm: 'py-8 sm:py-12',
    md: 'py-12 sm:py-16',
    lg: 'py-16 sm:py-20',
    xl: 'py-20 sm:py-24',
    '2xl': 'py-24 sm:py-32',
    '3xl': 'py-32 sm:py-40'
  }
  
  return [
    'relative',
    backgroundClasses[props.background],
    paddingClasses[props.padding]
  ].filter(Boolean).join(' ')
})

const containerClasses = computed(() => {
  const baseClasses = 'container-custom'
  const spacingClass = spacingClasses[props.spacing]
  
  return [baseClasses, spacingClass].filter(Boolean).join(' ')
})
</script>

<style scoped>
.container-custom {
  max-width: 1280px;
  margin: 0 auto;
  padding-left: 1rem;
  padding-right: 1rem;
}

@media (min-width: 640px) {
  .container-custom {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
}

@media (min-width: 1024px) {
  .container-custom {
    padding-left: 2rem;
    padding-right: 2rem;
  }
}
</style> 