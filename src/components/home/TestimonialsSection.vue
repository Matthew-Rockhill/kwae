<template>
  <section class="bg-white overflow-hidden py-8 sm:py-12 lg:py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-8 sm:mb-12 lg:mb-16">
        <BaseHeading :level="2" :animate="true" align="center" class="mb-4 sm:mb-6">
          Stories From <span class="font-cormorant italic font-normal text-[var(--color-secondary)]">The Heart</span>
        </BaseHeading>
        <p class="text-[var(--color-text)] text-base sm:text-lg font-light leading-relaxed max-w-2xl mx-auto px-2">
          Every session tells a story. Here's what clients say about their experience.
        </p>
      </div>
        
      <!-- Modern Testimonial Card Layout -->
      <div class="relative">
        <!-- Main Testimonial Card -->
        <div 
          class="relative bg-gradient-to-br from-white via-white to-[var(--color-accent)]/30 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden transition-all duration-700 ease-in-out mx-2 sm:mx-0" 
          :key="currentSlide"
          @touchstart="handleTouchStart"
          @touchmove="handleTouchMove"
          @touchend="handleTouchEnd"
        >
          <div class="grid grid-cols-1 lg:grid-cols-12 min-h-[500px] sm:min-h-[550px] lg:min-h-[600px]">
            
            <!-- Image Section -->
            <div class="lg:col-span-7 relative overflow-hidden h-64 sm:h-80 lg:h-auto">
              <div class="absolute inset-0">
                <img 
                  :src="currentTestimonial.image.url" 
                  :alt="currentTestimonial.image.alt"
                  class="w-full h-full object-cover transition-all duration-1000 ease-in-out scale-105 hover:scale-100"
                />
                <div class="absolute inset-0 bg-gradient-to-b lg:bg-gradient-to-r from-black/30 via-black/10 to-transparent lg:from-black/20 lg:via-transparent lg:to-white/20"></div>
              </div>
              
              <!-- Session Type Badge -->
              <div class="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 lg:bottom-8 lg:left-8">
                <div class="bg-[var(--color-secondary)]/90 backdrop-blur-sm text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium">
                  {{ currentTestimonial.sessionType }}
                </div>
              </div>
            </div>
            
            <!-- Content Section -->
            <div class="lg:col-span-5 flex flex-col justify-center p-6 sm:p-8 lg:p-12 space-y-6 sm:space-y-8">
              <!-- Quote with Quote Icon -->
              <div class="relative">
                <!-- Quote Icon -->
                <div class="absolute -top-2 sm:-top-4 -left-2 sm:-left-4 w-8 h-8 sm:w-12 sm:h-12 bg-[var(--color-secondary)]/10 rounded-full flex items-center justify-center">
                  <svg class="w-4 h-4 sm:w-6 sm:h-6 text-[var(--color-secondary)]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z"/>
                  </svg>
                </div>
                
                <blockquote class="text-[var(--color-text)] text-lg sm:text-xl lg:text-2xl font-light leading-relaxed italic relative pl-2 sm:pl-4">
                  {{ currentTestimonial.quote }}
                </blockquote>
              </div>
              
              <!-- Client Info -->
              <div class="flex items-center">
                <div class="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-primary)] flex items-center justify-center mr-4 sm:mr-5 lg:mr-6 shadow-lg flex-shrink-0">
                  <span class="text-white font-bold text-sm sm:text-base lg:text-lg">{{ currentTestimonial.initial }}</span>
                </div>
                <div class="min-w-0 flex-1">
                  <BaseHeading :level="4" class="text-base sm:text-lg mb-1 truncate">{{ currentTestimonial.name }}</BaseHeading>
                  <BaseText size="sm" color="muted" class="font-medium text-xs sm:text-sm line-clamp-2">{{ currentTestimonial.role }}</BaseText>
                </div>
              </div>
              
              <!-- Navigation Dots with Swipe Hint -->
              <div class="flex flex-col items-center lg:items-start space-y-3">
                <div class="flex gap-2 sm:gap-3">
                  <button
                    v-for="(_, index) in testimonials"
                    :key="index"
                    @click="goToSlide(index)"
                    class="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300 touch-manipulation"
                    :class="index === currentSlide ? 'bg-[var(--color-secondary)] w-6 sm:w-8' : 'bg-[var(--color-text)]/20 hover:bg-[var(--color-text)]/40'"
                    :aria-label="`Go to testimonial ${index + 1}`"
                  ></button>
                </div>
                
                <!-- Swipe Hint for Mobile -->
                <div class="flex sm:hidden items-center text-xs text-[var(--color-text)]/50 space-x-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16l-4-4m0 0l4-4m-4 4h18"/>
                  </svg>
                  <span>Swipe to navigate</span>
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Background Decorative Elements -->
        <div class="absolute -top-10 sm:-top-20 -right-10 sm:-right-20 w-32 h-32 sm:w-40 sm:h-40 bg-[var(--color-secondary)]/5 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-10 sm:-bottom-20 -left-10 sm:-left-20 w-48 h-48 sm:w-60 sm:h-60 bg-[var(--color-accent)]/30 rounded-full blur-3xl opacity-60 sm:opacity-100"></div>
      </div>
      
      <!-- Extra padding to prevent cutoff -->
      <div class="h-4 sm:h-8"></div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import BaseHeading from '@/components/ui/BaseHeading.vue'
import BaseText from '@/components/ui/BaseText.vue'

interface Testimonial {
  quote: string
  name: string
  role: string
  sessionType: string
  initial: string
  image: {
    url: string
    alt: string
  }
}

// Testimonials data - each image is from the actual client's shoot
const testimonials = ref<Testimonial[]>([
  {
    quote: "Kristin with an eye doesn't simply take photographs. She tells stories that live and breathed through every frame. Her work is a compelling fusion of visual imagery and heartfelt narrative.",
    name: "Anton Cuyler",
    role: "CEO/Founder, The Sozo Foundation",
    sessionType: "NGO Storytelling",
    initial: "A",
    image: {
      url: new URL('@/assets/images/NGO-storytelling/Sozo Foundation Case Study Images106.jpg', import.meta.url).href,
      alt: 'Behind the scenes from The Sozo Foundation storytelling session'
    }
  },
  {
    quote: "We had a family photoshoot that was incredibly enjoyable in one of the most stunning parts of Cape Town during sunset. Her creativity shines through in every shot — she has a true gift for capturing beautiful, genuine moments.",
    name: "Denise Malan",
    role: "Family Session Client",
    sessionType: "Family Photography",
    initial: "D",
    image: {
      url: new URL('@/assets/images/family/malan-family-shoot-55.jpg', import.meta.url).href,
      alt: 'Beautiful moment from the Malan family sunset session in Cape Town'
    }
  },
  {
    quote: "From candid emotions to beautifully posed portraits, Kristin made sure no moment was missed. Looking at these photos, we are instantly transported back to the magic of our wedding day.",
    name: "Aurelie Bukongo",
    role: "Bride",
    sessionType: "Wedding Photography",
    initial: "A",
    image: {
      url: new URL('@/assets/images/lifestyle/traditional-wedding/Copy of DSC_0394.jpg', import.meta.url).href,
      alt: 'Magical moment from Aurelie and her partner\'s wedding celebration'
    }
  }
])

// Current states
const currentSlide = ref(0)
const totalSlides = computed(() => testimonials.value.length)

// Touch gesture state for mobile swipe navigation
const touchStartX = ref(0)
const touchEndX = ref(0)
const minSwipeDistance = 50

// Computed properties
const currentTestimonial = computed(() => testimonials.value[currentSlide.value])

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % totalSlides.value
}

const prevSlide = () => {
  currentSlide.value = currentSlide.value === 0 ? totalSlides.value - 1 : currentSlide.value - 1
}

const goToSlide = (index: number) => {
  currentSlide.value = index
  // Restart auto-advance when user manually navigates
  stopAutoAdvance()
  setTimeout(() => {
    startAutoAdvance()
  }, 8000) // Give user 8 seconds before resuming auto-advance
}

// Touch event handlers for mobile swipe navigation
const handleTouchStart = (event: TouchEvent) => {
  touchStartX.value = event.touches[0].clientX
}

const handleTouchMove = (event: TouchEvent) => {
  // Prevent default to avoid scrolling while swiping
  if (Math.abs(event.touches[0].clientX - touchStartX.value) > 10) {
    event.preventDefault()
  }
}

const handleTouchEnd = (event: TouchEvent) => {
  touchEndX.value = event.changedTouches[0].clientX
  handleSwipe()
}

const handleSwipe = () => {
  const swipeDistance = touchStartX.value - touchEndX.value
  const absSwipeDistance = Math.abs(swipeDistance)
  
  if (absSwipeDistance > minSwipeDistance) {
    if (swipeDistance > 0) {
      // Swiped left - next slide
      nextSlide()
    } else {
      // Swiped right - previous slide
      prevSlide()
    }
    
    // Restart auto-advance after manual swipe
    stopAutoAdvance()
    setTimeout(() => {
      startAutoAdvance()
    }, 8000)
  }
}

// Auto-advance functionality
let testimonialIntervalId: number | null = null

const startAutoAdvance = () => {
  // Auto-advance testimonials every 8 seconds (longer for better reading time)
  testimonialIntervalId = window.setInterval(() => {
    nextSlide()
  }, 8000)
}

const stopAutoAdvance = () => {
  if (testimonialIntervalId) {
    clearInterval(testimonialIntervalId)
    testimonialIntervalId = null
  }
}

onMounted(() => {
  startAutoAdvance()
})

onUnmounted(() => {
  stopAutoAdvance()
})
</script>