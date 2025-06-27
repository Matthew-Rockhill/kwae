<template>
  <div>
    <HeroSection />
    <AboutSection />
    <PortfolioPreview />
    <PackagesPreview />
    
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
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          <!-- Left Column: Testimonials -->
          <div class="space-y-8">
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
            
            <!-- Testimonial Dots -->
            <div class="flex justify-center space-x-3">
              <button 
                v-for="(_, index) in testimonials" 
                :key="index"
                @click="currentSlide = index"
                :class="`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentSlide === index 
                    ? 'bg-[var(--color-secondary)] scale-110' 
                    : 'bg-[var(--color-secondary)]/30 hover:bg-[var(--color-secondary)]/50'
                }`"
              ></button>
            </div>
          </div>

          <!-- Right Column: Dynamic Image Masonry -->
          <div class="relative h-[500px] lg:h-[600px] overflow-hidden rounded-2xl">
            <!-- Masonry Grid Container -->
            <div class="absolute inset-0 grid grid-cols-3 gap-2 p-2">
              
              <!-- Large image (spans 2 columns, 2 rows) -->
              <div class="col-span-2 row-span-2 relative overflow-hidden rounded-xl">
                <img 
                  :src="currentMasonryImages[0]?.url" 
                  :alt="currentMasonryImages[0]?.alt"
                  class="w-full h-full object-cover transition-all duration-1000 ease-in-out"
                  :class="{ 'opacity-100': currentMasonryImages[0], 'opacity-0': !currentMasonryImages[0] }"
                />
              </div>
              
              <!-- Small image (top right) -->
              <div class="col-span-1 row-span-1 relative overflow-hidden rounded-xl">
                <img 
                  :src="currentMasonryImages[1]?.url" 
                  :alt="currentMasonryImages[1]?.alt"
                  class="w-full h-full object-cover transition-all duration-1000 ease-in-out"
                  :class="{ 'opacity-100': currentMasonryImages[1], 'opacity-0': !currentMasonryImages[1] }"
                />
              </div>
              
              <!-- Small image (middle right) -->
              <div class="col-span-1 row-span-1 relative overflow-hidden rounded-xl">
                <img 
                  :src="currentMasonryImages[2]?.url" 
                  :alt="currentMasonryImages[2]?.alt"
                  class="w-full h-full object-cover transition-all duration-1000 ease-in-out"
                  :class="{ 'opacity-100': currentMasonryImages[2], 'opacity-0': !currentMasonryImages[2] }"
                />
              </div>
              
              <!-- Medium image (bottom, spans 2 columns) -->
              <div class="col-span-2 row-span-1 relative overflow-hidden rounded-xl">
                <img 
                  :src="currentMasonryImages[3]?.url" 
                  :alt="currentMasonryImages[3]?.alt"
                  class="w-full h-full object-cover transition-all duration-1000 ease-in-out"
                  :class="{ 'opacity-100': currentMasonryImages[3], 'opacity-0': !currentMasonryImages[3] }"
                />
              </div>
              
              <!-- Small image (bottom right) -->
              <div class="col-span-1 row-span-1 relative overflow-hidden rounded-xl">
                <img 
                  :src="currentMasonryImages[4]?.url" 
                  :alt="currentMasonryImages[4]?.alt"
                  class="w-full h-full object-cover transition-all duration-1000 ease-in-out"
                  :class="{ 'opacity-100': currentMasonryImages[4], 'opacity-0': !currentMasonryImages[4] }"
                />
              </div>
              
            </div>
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
        <router-link to="/contact">
          <BaseButton variant="primary">
            Book Your Session Today
          </BaseButton>
        </router-link>
      </div>
    </BaseSection>
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

// Testimonials data
const testimonials = ref([
  {
    quote: "Kristin with an eye doesn't simply take photographs. She tells stories that live and breathed through every frame. Her work is a compelling fusion of visual imagery and heartfelt narrative.",
    name: "Anton Cuyler",
    role: "CEO/Founder, The Sozo Foundation",
    initial: "A"
  },
  {
    quote: "We had a family photoshoot that was incredibly enjoyable in one of the most stunning parts of Cape Town during sunset. Her creativity shines through in every shot — she has a true gift for capturing beautiful, genuine moments.",
    name: "Denise Malan",
    role: "Family Session",
    initial: "D"
  },
  {
    quote: "From candid emotions to beautifully posed portraits, Kristin made sure no moment was missed. Looking at these photos, we are instantly transported back to the magic of our wedding day.",
    name: "Aurelie Bukongo",
    role: "Wedding Photography",
    initial: "A"
  }
])

// Masonry images data
const masonryImages = ref([
  // Family images
  { url: new URL('@/assets/images/family/dsc-0006.jpg', import.meta.url).href, alt: 'Family moment' },
  { url: new URL('@/assets/images/family/dsc-0011.jpg', import.meta.url).href, alt: 'Family portrait' },
  { url: new URL('@/assets/images/family/dsc-0038.jpg', import.meta.url).href, alt: 'Family connection' },
  { url: new URL('@/assets/images/family/dsc-0056.jpg', import.meta.url).href, alt: 'Family joy' },
  { url: new URL('@/assets/images/family/dsc-0059.jpg', import.meta.url).href, alt: 'Family love' },
  { url: new URL('@/assets/images/family/dsc-0066.jpg', import.meta.url).href, alt: 'Family bond' },
  { url: new URL('@/assets/images/family/dsc-0077.jpg', import.meta.url).href, alt: 'Family laughter' },
  { url: new URL('@/assets/images/family/dsc-0087.jpg', import.meta.url).href, alt: 'Family warmth' },
  { url: new URL('@/assets/images/family/dsc-0099.jpg', import.meta.url).href, alt: 'Family togetherness' },
  { url: new URL('@/assets/images/family/dsc-0100.jpg', import.meta.url).href, alt: 'Family embrace' },
  // Branding images
  { url: new URL('@/assets/images/branding/ray-branding-shoot-1.jpg', import.meta.url).href, alt: 'Professional branding' },
  { url: new URL('@/assets/images/branding/ray-branding-shoot-25.jpg', import.meta.url).href, alt: 'Brand storytelling' },
  { url: new URL('@/assets/images/branding/ray-branding-shoot-39.jpg', import.meta.url).href, alt: 'Business portrait' },
  { url: new URL('@/assets/images/branding/ray-branding-shoot-40.jpg', import.meta.url).href, alt: 'Professional image' },
  // NGO images
  { url: new URL('@/assets/images/NGO-storytelling/Sozo Foundation Case Study Images103.jpg', import.meta.url).href, alt: 'NGO impact story' },
  { url: new URL('@/assets/images/NGO-storytelling/Sozo Foundation Case Study Images106.jpg', import.meta.url).href, alt: 'Community story' },
  { url: new URL('@/assets/images/NGO-storytelling/Sozo Foundation Case Study Images20.jpg', import.meta.url).href, alt: 'Social impact' },
  { url: new URL('@/assets/images/NGO-storytelling/Sozo Foundation Case Study Images23.jpg', import.meta.url).href, alt: 'Change story' },
])

// Current states
const currentSlide = ref(0)
const currentMasonrySet = ref(0)
const totalSlides = computed(() => testimonials.value.length)

// Computed properties
const currentTestimonial = computed(() => testimonials.value[currentSlide.value])

const currentMasonryImages = computed(() => {
  const startIndex = (currentMasonrySet.value * 5) % masonryImages.value.length
  const images = []
  for (let i = 0; i < 5; i++) {
    const index = (startIndex + i) % masonryImages.value.length
    images.push(masonryImages.value[index])
  }
  return images
})

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % totalSlides.value
}

const nextMasonrySet = () => {
  currentMasonrySet.value = (currentMasonrySet.value + 1) % Math.ceil(masonryImages.value.length / 5)
}

// Auto-advance functionality
let testimonialIntervalId: number | null = null
let masonryIntervalId: number | null = null

const startAutoAdvance = () => {
  // Auto-advance testimonials every 6 seconds
  testimonialIntervalId = window.setInterval(() => {
    nextSlide()
  }, 6000)
  
  // Auto-advance masonry images every 3 seconds
  masonryIntervalId = window.setInterval(() => {
    nextMasonrySet()
  }, 3000)
}

const stopAutoAdvance = () => {
  if (testimonialIntervalId) {
    clearInterval(testimonialIntervalId)
    testimonialIntervalId = null
  }
  if (masonryIntervalId) {
    clearInterval(masonryIntervalId)
    masonryIntervalId = null
  }
}

onMounted(() => {
  startAutoAdvance()
})

onUnmounted(() => {
  stopAutoAdvance()
})

</script>