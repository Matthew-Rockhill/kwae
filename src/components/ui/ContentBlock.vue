<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20" :class="containerClass">
    <!-- Image Column -->
    <div class="relative" :class="imageOrder">
      <div class="aspect-[3/4] overflow-hidden rounded-lg">
        <img 
          :src="image.src" 
          :alt="image.alt" 
          class="w-full h-full object-cover"
        />
      </div>
    </div>
    
    <!-- Content Column -->
    <div class="flex flex-col justify-center" :class="contentOrder">
      <div class="prose prose-lg max-w-none">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface ImageData {
  src: string
  alt: string
}

interface Props {
  image: ImageData
  imagePosition?: 'left' | 'right'
  spacing?: 'normal' | 'large'
}

const props = withDefaults(defineProps<Props>(), {
  imagePosition: 'left',
  spacing: 'normal'
})

const containerClass = computed(() => {
  return props.spacing === 'large' ? 'mb-24' : 'mb-16'
})

const imageOrder = computed(() => {
  if (props.imagePosition === 'right') {
    return 'order-1 lg:order-2'
  }
  return 'order-1 lg:order-1'
})

const contentOrder = computed(() => {
  if (props.imagePosition === 'right') {
    return 'order-2 lg:order-1'
  }
  return 'order-2 lg:order-2'
})
</script> 