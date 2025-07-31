<template>
  <div 
    class="group relative overflow-hidden rounded-xl bg-[var(--color-light)] transform transition-all duration-500 hover:scale-[1.02] hover:shadow-modern-lg cursor-pointer active:scale-[0.98] shadow-modern-sm animate-on-scroll"
    @click="$emit('click')"
  >
    <!-- Image Container -->
    <div class="relative aspect-[4/3] overflow-hidden bg-gray-100">
      <!-- Loading Skeleton -->
      <div 
        v-if="!imageLoaded && !imageError" 
        class="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse"
      >
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
      
      <!-- Error State -->
      <div 
        v-if="imageError" 
        class="absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-500"
      >
        <div class="text-center">
          <svg class="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          <p class="text-sm">Failed to load</p>
          <button 
            @click="retryImage" 
            class="text-xs text-blue-500 hover:text-blue-700 mt-1"
          >
            Retry
          </button>
        </div>
      </div>
      
      <!-- Main Image -->
      <img 
        :src="image.thumbnailUrl || image.src" 
        :alt="image.alt || image.title || 'Portfolio image'" 
        class="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 transform-gpu"
        :class="[imageClasses, { 'opacity-0': !imageLoaded }]"
        @load="handleImageLoad"
        @error="handleImageError"
        loading="lazy"
      />
      
      
      <!-- Overlay for NGO category -->
      <template v-if="showOverlay">
        <div class="absolute inset-0 bg-gradient-to-t from-[var(--color-text)]/90 via-[var(--color-text)]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div class="absolute inset-0 flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
          <BaseText v-if="image.category" tag="span" size="sm" color="primary" :opacity="80" class="uppercase tracking-wider mb-2">
            {{ image.category }}
          </BaseText>
          <BaseHeading v-if="image.title" :level="5" color="primary" class="mb-2 text-white">
            {{ image.title }}
          </BaseHeading>
          <BaseText v-if="image.description" size="sm" color="white" class="line-clamp-2" :opacity="80">
            {{ image.description }}
          </BaseText>
        </div>
        <div class="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <BaseButton variant="ghost" size="sm" class="bg-white/10 backdrop-blur-sm text-white hover:bg-white/20">
            View Details
          </BaseButton>
        </div>
      </template>
    </div>
    
    <!-- Static Content for NGO category -->
    <template v-if="showStaticContent">
      <div class="p-4">
        <BaseText v-if="image.category" tag="span" size="sm" color="primary" :opacity="70" class="uppercase tracking-wider">
          {{ image.category }}
        </BaseText>
        <BaseHeading v-if="image.title" :level="6" class="mt-1">
          {{ image.title }}
        </BaseHeading>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import BaseText from './BaseText.vue'
import BaseHeading from './BaseHeading.vue'
import BaseButton from './BaseButton.vue'

interface PortfolioImage {
  src?: string
  thumbnailUrl?: string
  fullUrl?: string
  alt?: string
  title?: string
  description?: string
  category?: string
}

interface Props {
  image: PortfolioImage
  category: string
  subcategory?: string
  showOverlay?: boolean
  showStaticContent?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showOverlay: false,
  showStaticContent: false
})

defineEmits<{
  click: []
}>()

// Image loading states
const imageLoaded = ref(false)
const imageError = ref(false)
const retryCount = ref(0)

// Reset loading states when image changes
watch(() => props.image.thumbnailUrl || props.image.src, (newUrl) => {
  imageLoaded.value = false
  imageError.value = false
  retryCount.value = 0
}, { immediate: true })

// Handle image load success
const handleImageLoad = () => {
  imageLoaded.value = true
  imageError.value = false
}

// Handle image load error
const handleImageError = () => {
  imageLoaded.value = false
  imageError.value = true
  console.warn(`Failed to load image: ${props.image.thumbnailUrl || props.image.src}`)
}

// Retry loading image
const retryImage = () => {
  if (retryCount.value < 3) {
    retryCount.value++
    imageError.value = false
    imageLoaded.value = false
    
    // Force image reload by adding timestamp
    const img = new Image()
    const originalSrc = props.image.thumbnailUrl || props.image.src || ''
    const separator = originalSrc.includes('?') ? '&' : '?'
    img.src = `${originalSrc}${separator}retry=${retryCount.value}`
    
    img.onload = () => {
      imageLoaded.value = true
      imageError.value = false
    }
    
    img.onerror = () => {
      imageError.value = true
      imageLoaded.value = false
    }
  }
}

// Computed class for image effects based on category/subcategory
const imageClasses = computed(() => {
  const baseClasses = []
  
  if (props.category === 'lifestyle' && (props.subcategory === 'rockpooling' || props.subcategory === 'traditional-wedding')) {
    baseClasses.push('brightness-110 contrast-105 saturate-105')
  }
  
  // Add fade-in animation when loaded
  if (imageLoaded.value) {
    baseClasses.push('animate-fade-in')
  }
  
  return baseClasses.join(' ')
})
</script> 