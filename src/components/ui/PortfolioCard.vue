<template>
  <div 
    class="portfolio-card group relative overflow-hidden rounded-2xl bg-white transform transition-all duration-700 hover:shadow-xl shadow-lg border border-[var(--color-accent)]/10 select-none"
    @contextmenu.prevent
  >
    <!-- Image Container -->
    <div class="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 rounded-t-2xl">
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
        class="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 transform-gpu filter group-hover:brightness-110 select-none pointer-events-none"
        :class="[imageClasses, { 'opacity-0': !imageLoaded }]"
        @load="handleImageLoad"
        @error="handleImageError"
        @contextmenu.prevent
        @dragstart.prevent
        loading="lazy"
        draggable="false"
      />
      
      <!-- Invisible protection overlay -->
      <div class="absolute inset-0 select-none pointer-events-auto cursor-pointer z-10" @click="$emit('click')"></div>
      
      <!-- Subtle overlay on hover -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

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
}

const props = defineProps<Props>()

defineEmits<{
  click: []
}>()

// Image loading states
const imageLoaded = ref(false)
const imageError = ref(false)
const retryCount = ref(0)

// Reset loading states when image changes
watch(() => props.image.thumbnailUrl || props.image.src, () => {
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

<style scoped>
/* Additional image protection */
img {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
  user-drag: none;
  -webkit-touch-callout: none;
}

/* Prevent selection on entire card */
.portfolio-card {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-touch-callout: none;
}
</style>