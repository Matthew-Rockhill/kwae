<template>
  <div v-if="isOpen" class="lightbox-container fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-2 sm:p-4 animate-fade-in" @contextmenu.prevent>
    <div class="relative mx-auto transition-all duration-500 ease-out animate-scale-in">
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

      <!-- Zoom Controls -->
      <div class="absolute top-4 left-4 z-20 flex flex-col gap-2">
        <button 
          @click="zoomIn"
          :disabled="zoomLevel >= maxZoom"
          class="p-2 text-white/80 hover:text-white transition-colors duration-200 bg-black/20 hover:bg-black/40 backdrop-blur-sm rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Zoom in"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
        <button 
          @click="zoomOut"
          :disabled="zoomLevel <= minZoom"
          class="p-2 text-white/80 hover:text-white transition-colors duration-200 bg-black/20 hover:bg-black/40 backdrop-blur-sm rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Zoom out"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M18 12H6" />
          </svg>
        </button>
        <button 
          v-if="zoomLevel > 1"
          @click="resetZoom"
          class="p-2 text-white/80 hover:text-white transition-colors duration-200 bg-black/20 hover:bg-black/40 backdrop-blur-sm rounded-lg"
          aria-label="Reset zoom"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
      
      <!-- Image Container -->
      <div 
        class="relative bg-white/5 rounded-lg overflow-hidden backdrop-blur-sm transition-all duration-300 ease-out touch-none"
        :style="containerStyle"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
        @touchend="handleTouchEnd"
      >
        <img 
          v-if="currentImage"
          ref="imageRef"
          :src="currentImage.src" 
          :alt="currentImage.alt || 'Gallery image'"
          class="w-full h-full mx-auto block object-contain select-none pointer-events-none transition-all duration-500 ease-out"
          :class="{ 
            'opacity-0 scale-95': !imageLoaded, 
            'opacity-100 scale-100': imageLoaded 
          }"
          :style="{
            transform: `scale(${zoomLevel}) translate(${panX}px, ${panY}px)`,
            cursor: zoomLevel > 1 ? 'grab' : 'default'
          }"
          @load="handleImageLoad"
          @contextmenu.prevent
          @dragstart.prevent
          draggable="false"
        />
        
        <!-- Protection overlay for lightbox -->
        <div class="absolute inset-0 select-none" style="background: transparent;"></div>
        
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

      <!-- Thumbnail Strip Navigation -->
      <div 
        v-if="showNavigation && allImages && allImages.length > 1" 
        class="absolute bottom-4 left-1/2 -translate-x-1/2 w-full max-w-md px-4"
      >
        <div class="thumbnail-strip flex gap-2 overflow-x-auto scrollbar-hide p-2 bg-black/40 backdrop-blur-sm rounded-lg">
          <button
            v-for="(image, index) in allImages"
            :key="index"
            @click="$emit('goto', index)"
            class="flex-shrink-0 w-12 h-12 rounded-md overflow-hidden border-2 transition-all duration-200"
            :class="[
              index === currentIndex 
                ? 'border-white shadow-lg' 
                : 'border-white/30 hover:border-white/60 opacity-70 hover:opacity-100'
            ]"
          >
            <img 
              :src="image.src" 
              :alt="image.alt || `Thumbnail ${index + 1}`"
              class="w-full h-full object-cover select-none pointer-events-none"
              @contextmenu.prevent
              @dragstart.prevent
              draggable="false"
            />
          </button>
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
  allImages?: LightboxImage[]
}

// Handle keyboard navigation, touch gestures and image loading
import { onMounted, onUnmounted, ref, computed, watch } from 'vue'

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  prev: []
  next: []
  goto: [index: number]
  'preload-adjacent': [index: number]
}>()

// Image loading and aspect ratio state
const imageRef = ref<HTMLImageElement>()
const imageLoaded = ref(false)
const imageAspectRatio = ref(1)
const imageNaturalWidth = ref(0)
const imageNaturalHeight = ref(0)

// Touch gesture state
const touchStartX = ref(0)
const touchStartY = ref(0)
const touchCurrentX = ref(0)
const touchCurrentY = ref(0)
const isSwiping = ref(false)
const minSwipeDistance = 50

// Zoom functionality
const zoomLevel = ref(1)
const isPanning = ref(false)
const panX = ref(0)
const panY = ref(0)
const maxZoom = 3
const minZoom = 1

// Handle image load to get natural dimensions
const handleImageLoad = (event: Event) => {
  const img = event.target as HTMLImageElement
  imageNaturalWidth.value = img.naturalWidth
  imageNaturalHeight.value = img.naturalHeight
  imageAspectRatio.value = img.naturalWidth / img.naturalHeight
  imageLoaded.value = true
}


// Reset image state when image changes and preload adjacent images
watch(() => props.currentImage?.src, (newSrc) => {
  imageLoaded.value = false
  imageAspectRatio.value = 1
  
  // Reset zoom when image changes
  zoomLevel.value = 1
  panX.value = 0
  panY.value = 0
  
  // Preload next and previous images if navigation is enabled
  if (props.showNavigation && newSrc) {
    // This would need access to the full image array to preload
    // For now, we'll implement a basic preloading system
    emit('preload-adjacent', props.currentIndex)
  }
}, { immediate: true })

// Zoom functions
const zoomIn = () => {
  if (zoomLevel.value < maxZoom) {
    zoomLevel.value = Math.min(zoomLevel.value + 0.5, maxZoom)
  }
}

const zoomOut = () => {
  if (zoomLevel.value > minZoom) {
    zoomLevel.value = Math.max(zoomLevel.value - 0.5, minZoom)
    // Reset pan when zooming out to 1x
    if (zoomLevel.value === 1) {
      panX.value = 0
      panY.value = 0
    }
  }
}

const resetZoom = () => {
  zoomLevel.value = 1
  panX.value = 0
  panY.value = 0
}

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

// Touch event handlers
const handleTouchStart = (event: TouchEvent) => {
  if (!props.showNavigation) return
  
  const touch = event.touches[0]
  touchStartX.value = touch.clientX
  touchStartY.value = touch.clientY
  touchCurrentX.value = touch.clientX
  touchCurrentY.value = touch.clientY
  isSwiping.value = false
}

const handleTouchMove = (event: TouchEvent) => {
  if (!props.showNavigation) return
  
  const touch = event.touches[0]
  touchCurrentX.value = touch.clientX
  touchCurrentY.value = touch.clientY
  
  const deltaX = Math.abs(touchCurrentX.value - touchStartX.value)
  const deltaY = Math.abs(touchCurrentY.value - touchStartY.value)
  
  // Prevent default scrolling if horizontal swipe is detected
  if (deltaX > deltaY && deltaX > 10) {
    event.preventDefault()
    isSwiping.value = true
  }
}

const handleTouchEnd = () => {
  if (!props.showNavigation || !isSwiping.value) return
  
  const deltaX = touchCurrentX.value - touchStartX.value
  const deltaY = Math.abs(touchCurrentY.value - touchStartY.value)
  
  // Only trigger swipe if horizontal movement is greater than vertical
  if (Math.abs(deltaX) > minSwipeDistance && Math.abs(deltaX) > deltaY) {
    if (deltaX > 0 && props.currentIndex > 0) {
      // Swipe right - go to previous image
      emit('prev')
    } else if (deltaX < 0 && props.currentIndex < props.totalImages - 1) {
      // Swipe left - go to next image
      emit('next')
    }
  }
  
  // Reset touch state
  isSwiping.value = false
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
  
  // Disable context menu and text selection on the entire lightbox
  if (props.isOpen) {
    document.body.style.userSelect = 'none'
    document.body.style.webkitUserSelect = 'none'
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('resize', handleResize)
  
  // Restore text selection
  document.body.style.userSelect = ''
  document.body.style.webkitUserSelect = ''
})

// Watch for lightbox open/close to control body text selection
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    document.body.style.userSelect = 'none'
    document.body.style.webkitUserSelect = 'none'
  } else {
    document.body.style.userSelect = ''
    document.body.style.webkitUserSelect = ''
  }
})
</script>

<style scoped>
/* Additional protection styles */
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
  pointer-events: none;
}

/* Disable text selection on lightbox */
.lightbox-container {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* Prevent right-click and drag on entire lightbox */
.lightbox-container * {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* Smooth animations */
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}

.animate-scale-in {
  animation: scale-in 0.4s ease-out;
}

/* Smooth navigation button hover effects */
button {
  transition: all 0.2s ease-out;
}

button:hover {
  transform: scale(1.05);
}

/* Smooth image container transitions */
.image-container {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Hide scrollbar for thumbnail strip */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Smooth thumbnail transitions */
.thumbnail-strip button {
  transition: all 0.2s ease-out;
}

.thumbnail-strip button:hover {
  transform: scale(1.05);
}
</style>