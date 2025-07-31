<template>
  <div :class="spacingClasses">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
  direction?: 'vertical' | 'horizontal' | 'both'
}

const props = withDefaults(defineProps<Props>(), {
  spacing: 'md',
  direction: 'vertical'
})

const spacingClasses = computed(() => {
  const spacingValues = {
    xs: '2',
    sm: '3', 
    md: '4',
    lg: '6',
    xl: '8',
    '2xl': '12',
    '3xl': '16'
  }

  const directionClasses = {
    vertical: `space-y-${spacingValues[props.spacing]} sm:space-y-${Number(spacingValues[props.spacing]) + 2}`,
    horizontal: `space-x-${spacingValues[props.spacing]} sm:space-x-${Number(spacingValues[props.spacing]) + 2}`,
    both: `space-y-${spacingValues[props.spacing]} space-x-${spacingValues[props.spacing]} sm:space-y-${Number(spacingValues[props.spacing]) + 2} sm:space-x-${Number(spacingValues[props.spacing]) + 2}`
  }

  return directionClasses[props.direction]
})
</script>