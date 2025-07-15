<template>
  <div>
    <HeroSection @book-now="openBookingModal" />
    <BaseSection background="transparent" padding="xl">
      <AboutSection />
    </BaseSection>
    <BaseSection background="light" padding="xl">
      <PortfolioPreview />
    </BaseSection>
    <BaseSection background="accent" padding="xl">
      <PackagesPreview />
    </BaseSection>
    
    <!-- Modern Testimonials Section -->
    <BaseSection background="light" padding="xl">
      <div class="container-custom">
        <div class="text-center max-w-3xl mx-auto mb-16">
          <BaseHeading :level="2" align="center" class="mb-6">
            Stories From <span class="font-cormorant italic font-normal text-[var(--color-text)]">The Heart</span>
          </BaseHeading>
          <BaseText size="xl" color="primary" :opacity="70" weight="light" leading="relaxed" align="center">
            Every session tells a story. Here's what clients say about their experience.
          </BaseText>
        </div>
        
        <!-- Two Column Layout -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-stretch">
          
          <!-- Left Column: Testimonials -->
          <div class="flex flex-col justify-center h-full">
            <!-- Current Testimonial -->
            <div class="bg-[var(--color-accent)] rounded-2xl p-8 lg:p-10 shadow-xl transition-all duration-700 ease-in-out" :key="currentSlide">
              <div class="text-[var(--color-primary)] mb-6">
                <svg class="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z"/>
                </svg>
              </div>
              
              <p class="text-[var(--color-text)] text-lg lg:text-xl font-light leading-relaxed mb-8 italic">
                {{ currentTestimonial.quote }}
              </p>
              
              <div class="flex items-center">
                <div class="w-12 h-12 rounded-full bg-[var(--color-secondary)] flex items-center justify-center mr-4">
                  <span class="text-white font-bold">{{ currentTestimonial.initial }}</span>
                </div>
                <div>
                  <h4 class="font-semibold text-[var(--color-text)]">{{ currentTestimonial.name }}</h4>
                  <p class="text-[var(--color-text)]/70 text-sm">{{ currentTestimonial.role }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column: Single Image -->
          <div class="relative h-full overflow-hidden rounded-2xl">
            <img 
              :src="currentTestimonial.image.url" 
              :alt="currentTestimonial.image.alt"
              class="w-full h-full object-cover transition-all duration-1000 ease-in-out"
              :class="{ 'opacity-100': currentTestimonial.image, 'opacity-0': !currentTestimonial.image }"
            />
          </div>
          
        </div>
      </div>
    </BaseSection>
    
    <!-- Contact CTA Section -->
    <BaseSection background="alabaster" padding="lg">
      <div class="container-custom text-center">
        <BaseHeading :level="2" align="center" class="mb-8">
          Ready to <span class="font-cormorant italic font-normal text-[var(--color-text)]">Tell Your Story?</span>
        </BaseHeading>
        <BaseText size="lg" color="primary" :opacity="70" weight="light" class="max-w-2xl mx-auto mb-10" align="center">
          Let's work together to capture your authentic moments and create beautiful memories that last a lifetime.
        </BaseText>
        <BaseButton variant="primary" @click="openBookingModal">
          Book Your Session Today
        </BaseButton>
      </div>
    </BaseSection>
    <BookingModal
      :is-open="showBookingModal"
      @close="closeBookingModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import HeroSection from '@/components/home/HeroSection.vue'
import AboutSection from '@/components/home/AboutSection.vue'
import PortfolioPreview from '@/components/home/PortfolioPreview.vue'
import PackagesPreview from '@/components/home/PackagesPreview.vue'
import BaseSection from '@/components/ui/BaseSection.vue'
import BaseHeading from '@/components/ui/BaseHeading.vue'
import BaseText from '@/components/ui/BaseText.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BookingModal from '@/components/BookingModal.vue'

// Testimonials data
const testimonials = ref([
  {
    quote: "Kristin with an eye doesn't simply take photographs. She tells stories that live and breathed through every frame. Her work is a compelling fusion of visual imagery and heartfelt narrative.",
    name: "Anton Cuyler",
    role: "CEO/Founder, The Sozo Foundation",
    initial: "A",
    image: {
      url: new URL('@/assets/images/NGO-storytelling/Sozo Foundation Case Study Images106.jpg', import.meta.url).href,
      alt: 'Anton Cuyler, The Sozo Foundation'
    }
  },
  {
    quote: "We had a family photoshoot that was incredibly enjoyable in one of the most stunning parts of Cape Town during sunset. Her creativity shines through in every shot — she has a true gift for capturing beautiful, genuine moments.",
    name: "Denise Malan",
    role: "Family Session",
    initial: "D",
    image: {
      url: new URL('@/assets/images/family/malan-family-shoot-55.jpg', import.meta.url).href,
      alt: 'Denise Malan, Family Session'
    }
  },
  {
    quote: "From candid emotions to beautifully posed portraits, Kristin made sure no moment was missed. Looking at these photos, we are instantly transported back to the magic of our wedding day.",
    name: "Aurelie Bukongo",
    role: "Wedding Photography",
    initial: "A",
    image: {
      url: new URL('@/assets/images/lifestyle/traditional-wedding/Copy of DSC_0394.jpg', import.meta.url).href,
      alt: 'Aurelie Bukongo, Wedding Photography'
    }
  }
])

// Remove all other images from the testimonial section and tie each testimonial to its image
// Remove masonryImages and related logic

// Current states
const currentSlide = ref(0)
const totalSlides = computed(() => testimonials.value.length)

// Computed properties
const currentTestimonial = computed(() => testimonials.value[currentSlide.value])

// Remove currentMasonryImages and masonry logic

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % totalSlides.value
}

// Auto-advance functionality
let testimonialIntervalId: number | null = null

const startAutoAdvance = () => {
  // Auto-advance testimonials every 6 seconds
  testimonialIntervalId = window.setInterval(() => {
    nextSlide()
  }, 6000)
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

const showBookingModal = ref(false)
const openBookingModal = () => {
  showBookingModal.value = true
}
const closeBookingModal = () => {
  showBookingModal.value = false
}

</script>