<template>
  <section :class="sectionClasses">
    <div class="container-custom">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  background?: 'light' | 'accent' | 'primary' | 'transparent' | 'alabaster'
  padding?: 'sm' | 'md' | 'lg' | 'xl' | 'none'
  fullWidth?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  background: 'transparent',
  padding: 'lg',
  fullWidth: false
})

const sectionClasses = computed(() => {
  const backgroundClasses = {
    light: 'bg-[var(--color-light)]',
    accent: 'bg-[var(--color-accent)]',
    primary: 'bg-[var(--color-text)]',
    transparent: 'bg-transparent',
    alabaster: 'bg-[var(--color-alabaster)]'
  }
  
  const paddingClasses = {
    none: '',
    sm: 'py-6 sm:py-8',
    md: 'py-8 sm:py-12 md:py-16',
    lg: 'py-12 sm:py-16 md:py-20',
    xl: 'py-16 sm:py-20 md:py-24'
  }
  
  return [
    'relative',
    backgroundClasses[props.background],
    paddingClasses[props.padding]
  ].filter(Boolean).join(' ')
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