<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
    <div class="relative w-full max-w-6xl mx-auto">
      <!-- Close Button - positioned within the container -->
      <button 
        @click="$emit('close')"
        class="absolute top-0 right-0 z-20 p-3 text-white/80 hover:text-white transition-colors duration-200 bg-black/20 hover:bg-black/40 backdrop-blur-sm rounded-bl-lg"
        aria-label="Close lightbox"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      
      <!-- Navigation Buttons - positioned within the container -->
      <button 
        v-if="showNavigation && currentIndex > 0"
        @click="$emit('prev')"
        class="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-3 text-white/80 hover:text-white transition-colors duration-200 bg-black/20 hover:bg-black/40 backdrop-blur-sm rounded-r-lg"
        aria-label="Previous image"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button 
        v-if="showNavigation && currentIndex < totalImages - 1"
        @click="$emit('next')"
        class="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-3 text-white/80 hover:text-white transition-colors duration-200 bg-black/20 hover:bg-black/40 backdrop-blur-sm rounded-l-lg"
        aria-label="Next image"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
      
      <!-- Image Container -->
      <div class="relative bg-white/5 rounded-lg overflow-hidden backdrop-blur-sm">
        <img 
          v-if="currentImage"
          :src="currentImage.src" 
          :alt="currentImage.alt || 'Gallery image'"
          class="max-h-[85vh] max-w-full mx-auto block object-contain"
          @click.stop
        />
        
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

// Handle keyboard navigation
import { onMounted, onUnmounted } from 'vue'

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  prev: []
  next: []
}>()

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

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script> 