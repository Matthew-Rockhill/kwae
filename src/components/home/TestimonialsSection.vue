<template>
  <section class="bg-white overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-16">
        <BaseHeading :level="2" :animate="true" align="center" class="mb-6">
          Stories From <span class="font-cormorant italic font-normal text-[var(--color-secondary)]">The Heart</span>
        </BaseHeading>
        <p class="text-[var(--color-text)] text-lg font-light leading-relaxed max-w-2xl mx-auto">
          Every session tells a story. Here's what clients say about their experience.
        </p>
      </div>
        
      <!-- Modern Testimonial Card Layout -->
      <div class="relative">
        <!-- Main Testimonial Card -->
        <div 
          class="relative bg-gradient-to-br from-white via-white to-[var(--color-accent)]/30 rounded-3xl shadow-2xl overflow-hidden transition-all duration-700 ease-in-out" 
          :key="currentSlide"
        >
          <div class="grid grid-cols-1 lg:grid-cols-12 min-h-[600px]">
            
            <!-- Image Section -->
            <div class="lg:col-span-7 relative overflow-hidden">
              <div class="absolute inset-0">
                <img 
                  :src="currentTestimonial.image.url" 
                  :alt="currentTestimonial.image.alt"
                  class="w-full h-full object-cover transition-all duration-1000 ease-in-out scale-105 hover:scale-100"
                />
                <div class="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-white/20"></div>
              </div>
              
              <!-- Session Type Badge -->
              <div class="absolute bottom-8 left-8">
                <div class="bg-[var(--color-secondary)]/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
                  {{ currentTestimonial.sessionType }}
                </div>
              </div>
            </div>
            
            <!-- Content Section -->
            <div class="lg:col-span-5 flex flex-col justify-center p-8 lg:p-12">
              <!-- Quote with Quote Icon -->
              <div class="relative">
                <!-- Quote Icon -->
                <div class="absolute -top-4 -left-4 w-12 h-12 bg-[var(--color-secondary)]/10 rounded-full flex items-center justify-center">
                  <svg class="w-6 h-6 text-[var(--color-secondary)]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z"/>
                  </svg>
                </div>
                
                <blockquote class="text-[var(--color-text)] text-xl lg:text-2xl font-light leading-relaxed mb-8 italic relative pl-4">
                  {{ currentTestimonial.quote }}
                </blockquote>
              </div>
              
              <!-- Client Info -->
              <div class="flex items-center mb-8">
                <div class="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-primary)] flex items-center justify-center mr-6 shadow-lg">
                  <span class="text-white font-bold text-lg">{{ currentTestimonial.initial }}</span>
                </div>
                <div>
                  <BaseHeading :level="4" class="text-lg mb-1">{{ currentTestimonial.name }}</BaseHeading>
                  <BaseText size="sm" color="muted" class="font-medium">{{ currentTestimonial.role }}</BaseText>
                </div>
              </div>
              
              <!-- Navigation Dots -->
              <div class="flex gap-3">
                <button
                  v-for="(testimonial, index) in testimonials"
                  :key="index"
                  @click="goToSlide(index)"
                  class="w-3 h-3 rounded-full transition-all duration-300"
                  :class="index === currentSlide ? 'bg-[var(--color-secondary)] w-8' : 'bg-[var(--color-text)]/20 hover:bg-[var(--color-text)]/40'"
                ></button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Background Decorative Elements -->
        <div class="absolute -top-20 -right-20 w-40 h-40 bg-[var(--color-secondary)]/5 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-20 -left-20 w-60 h-60 bg-[var(--color-accent)]/30 rounded-full blur-3xl"></div>
      </div>
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

// Computed properties
const currentTestimonial = computed(() => testimonials.value[currentSlide.value])

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % totalSlides.value
}

const goToSlide = (index: number) => {
  currentSlide.value = index
  // Restart auto-advance when user manually navigates
  stopAutoAdvance()
  setTimeout(() => {
    startAutoAdvance()
  }, 8000) // Give user 8 seconds before resuming auto-advance
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