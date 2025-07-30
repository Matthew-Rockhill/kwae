<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-2 sm:p-4">
    <div class="relative mx-auto transition-all duration-300 ease-out">
      <!-- Close Button - positioned within the container -->
      <button 
        @click="$emit('close')"
        class="absolute top-0 right-0 z-20 p-2 sm:p-3 text-white/80 hover:text-white transition-colors duration-200 bg-black/20 hover:bg-black/40 backdrop-blur-sm rounded-bl-lg touch-action-manipulation"
        aria-label="Close lightbox"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      
      <!-- Navigation Buttons - positioned within the container -->
      <button 
        v-if="showNavigation && currentIndex > 0"
        @click="$emit('prev')"
        class="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 text-white/80 hover:text-white transition-colors duration-200 bg-black/20 hover:bg-black/40 backdrop-blur-sm rounded-r-lg touch-action-manipulation"
        aria-label="Previous image"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button 
        v-if="showNavigation && currentIndex < totalImages - 1"
        @click="$emit('next')"
        class="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 text-white/80 hover:text-white transition-colors duration-200 bg-black/20 hover:bg-black/40 backdrop-blur-sm rounded-l-lg touch-action-manipulation"
        aria-label="Next image"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
      
      <!-- Image Container -->
      <div 
        class="relative bg-white/5 rounded-lg overflow-hidden backdrop-blur-sm transition-all duration-300 ease-out"
        :style="containerStyle"
      >
        <img 
          v-if="currentImage"
          ref="imageRef"
          :src="currentImage.src" 
          :alt="currentImage.alt || 'Gallery image'"
          class="w-full h-full mx-auto block object-contain"
          :class="{ 'opacity-0': !imageLoaded, 'opacity-100': imageLoaded }"
          @load="handleImageLoad"
          @click.stop
        />
        
        <!-- Loading indicator -->
        <div 
          v-if="!imageLoaded" 
          class="absolute inset-0 flex items-center justify-center"
        >
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
        
        <!-- Image Counter -->
        <div 
          v-if="showNavigation && totalImages > 1"
          class="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/40 backdrop-blur-sm text-white/90 text-sm rounded-full"
        >
          {{ currentIndex + 1 }} / {{ totalImages }}
        </div>
        
        <!-- Caption -->
        <div 
          v-if="currentImage?.title || currentImage?.description"
          class="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent text-white"
        >
          <h3 v-if="currentImage.title" class="text-xl font-light mb-2">{{ currentImage.title }}</h3>
          <p v-if="currentImage.description" class="text-gray-200 text-sm">{{ currentImage.description }}</p>
        </div>
      </div>
    </div>
    
    <!-- Click outside to close -->
    <div 
      class="absolute inset-0 -z-10" 
      @click="$emit('close')"
      aria-label="Close lightbox"
    ></div>
  </div>
</template>

<script setup lang="ts">
interface LightboxImage {
  src: string
  alt?: string
  title?: string
  description?: string
}

interface Props {
  isOpen: boolean
  currentImage?: LightboxImage
  currentIndex: number
  totalImages: number
  showNavigation?: boolean
}

// Handle keyboard navigation and image loading
import { onMounted, onUnmounted, ref, computed, watch } from 'vue'

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  prev: []
  next: []
}>()

// Image loading and aspect ratio state
const imageRef = ref<HTMLImageElement>()
const imageLoaded = ref(false)
const imageAspectRatio = ref(1)
const imageNaturalWidth = ref(0)
const imageNaturalHeight = ref(0)

// Handle image load to get natural dimensions
const handleImageLoad = (event: Event) => {
  const img = event.target as HTMLImageElement
  imageNaturalWidth.value = img.naturalWidth
  imageNaturalHeight.value = img.naturalHeight
  imageAspectRatio.value = img.naturalWidth / img.naturalHeight
  imageLoaded.value = true
}

// Reset image state when image changes
watch(() => props.currentImage?.src, () => {
  imageLoaded.value = false
  imageAspectRatio.value = 1
}, { immediate: true })

// Computed container dimensions based on aspect ratio
const containerStyle = computed(() => {
  // Include forceRecalculation to trigger updates on resize
  forceRecalculation.value
  
  if (!imageLoaded.value || !props.currentImage) {
    // Fallback to original max-width behavior
    return {
      maxWidth: '72rem', // 6xl = 72rem
      width: '100%'
    }
  }

  // Get viewport dimensions (accounting for padding)
  const viewportHeight = window.innerHeight
  const viewportWidth = window.innerWidth
  const padding = viewportWidth < 640 ? 16 : 32 // p-2 sm:p-4
  const availableWidth = viewportWidth - (padding * 2)
  const maxHeight = viewportWidth < 640 ? viewportHeight * 0.8 : viewportHeight * 0.85

  // Calculate optimal dimensions based on aspect ratio
  let containerWidth: number
  let containerHeight: number

  if (imageAspectRatio.value > 1) {
    // Landscape image - width is the limiting factor
    containerHeight = Math.min(maxHeight, availableWidth / imageAspectRatio.value)
    containerWidth = containerHeight * imageAspectRatio.value
  } else {
    // Portrait or square image - height is the limiting factor
    containerWidth = Math.min(availableWidth, maxHeight * imageAspectRatio.value)
    containerHeight = containerWidth / imageAspectRatio.value
  }

  // Ensure we don't exceed available space
  if (containerWidth > availableWidth) {
    containerWidth = availableWidth
    containerHeight = availableWidth / imageAspectRatio.value
  }
  if (containerHeight > maxHeight) {
    containerHeight = maxHeight
    containerWidth = maxHeight * imageAspectRatio.value
  }

  return {
    width: `${Math.min(containerWidth, availableWidth)}px`,
    height: `${Math.min(containerHeight, maxHeight)}px`,
    maxWidth: 'none'
  }
})

const handleKeydown = (event: KeyboardEvent) => {
  if (!props.isOpen) return
  
  switch (event.key) {
    case 'Escape':
      emit('close')
      break
    case 'ArrowLeft':
      if (props.showNavigation && props.currentIndex > 0) {
        emit('prev')
      }
      break
    case 'ArrowRight':
      if (props.showNavigation && props.currentIndex < props.totalImages - 1) {
        emit('next')
      }
      break
  }
}

// Force recalculation on window resize
const forceRecalculation = ref(0)
const handleResize = () => {
  forceRecalculation.value++
}

// Update container style when window resizes
watch(forceRecalculation, () => {
  // This will trigger containerStyle recalculation
})

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('resize', handleResize)
})
</script> 