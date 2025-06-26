<template>
  <div>
    <HeroSection />
    <AboutSection />
    <PortfolioPreview />
    <PackagesPreview />
    
    <!-- Modern Testimonials Section -->
    <BaseSection background="accent" padding="xl">
      <div class="container-custom">
        <div class="text-center max-w-3xl mx-auto mb-20">
          <BaseHeading :level="2" align="center" class="mb-6">
            Stories From <span class="font-cormorant italic font-normal text-[var(--color-text)]">The Heart</span>
          </BaseHeading>
          <BaseText size="xl" color="primary" :opacity="70" weight="light" leading="relaxed" align="center">
            Every session tells a story. Here's what clients say about their experience.
          </BaseText>
        </div>
        
        <!-- Testimonials Carousel -->
        <div class="mb-20">
          <div class="max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden relative">
            <!-- Carousel Container -->
            <div class="overflow-hidden">
              <div class="flex transition-transform duration-500 ease-in-out" :style="`transform: translateX(-${currentSlide * 100}%)`">
                <!-- Testimonial Slide 1 - Anton Cuyler -->
                <div class="w-full flex-shrink-0">
                  <div class="p-8 md:p-16 text-center">
                    <div class="text-[var(--color-orange)] mb-8 flex justify-center">
                      <svg class="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z"/>
                      </svg>
                    </div>
                    <p class="text-[var(--color-text)] text-xl md:text-2xl font-light leading-relaxed mb-8 italic max-w-4xl mx-auto">
                      "Kristin with an eye doesn't simply take photographs. She tells stories that live and breathed through every frame. Her work is a compelling fusion of visual imagery and heartfelt narrative."
                    </p>
                    <div class="flex items-center justify-center">
                      <div class="w-16 h-16 rounded-full bg-[var(--color-secondary)] flex items-center justify-center mr-4">
                        <span class="text-white font-bold text-xl">A</span>
                      </div>
                      <div class="text-left">
                        <h4 class="font-semibold text-[var(--color-text)] text-lg">Anton Cuyler</h4>
                        <p class="text-[var(--color-text)]/70 text-sm">CEO/Founder, The Sozo Foundation</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Testimonial Slide 2 - Denise Malan -->
                <div class="w-full flex-shrink-0">
                  <div class="p-8 md:p-16 text-center">
                    <div class="text-[var(--color-orange)] mb-8 flex justify-center">
                      <svg class="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z"/>
                      </svg>
                    </div>
                    <p class="text-[var(--color-text)] text-xl md:text-2xl font-light leading-relaxed mb-8 italic max-w-4xl mx-auto">
                      "We had a family photoshoot that was incredibly enjoyable in one of the most stunning parts of Cape Town during sunset. Her creativity shines through in every shot — she has a true gift for capturing beautiful, genuine moments."
                    </p>
                    <div class="flex items-center justify-center">
                      <div class="w-16 h-16 rounded-full bg-[var(--color-secondary)] flex items-center justify-center mr-4">
                        <span class="text-white font-bold text-xl">D</span>
                      </div>
                      <div class="text-left">
                        <h4 class="font-semibold text-[var(--color-text)] text-lg">Denise Malan</h4>
                        <p class="text-[var(--color-text)]/70 text-sm">Family Session</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Testimonial Slide 3 - Aurelie Bukongo -->
                <div class="w-full flex-shrink-0">
                  <div class="p-8 md:p-16 text-center">
                    <div class="text-[var(--color-orange)] mb-8 flex justify-center">
                      <svg class="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z"/>
                      </svg>
                    </div>
                    <p class="text-[var(--color-text)] text-xl md:text-2xl font-light leading-relaxed mb-8 italic max-w-4xl mx-auto">
                      "From candid emotions to beautifully posed portraits, Kristin made sure no moment was missed. Looking at these photos, we are instantly transported back to the magic of our wedding day."
                    </p>
                    <div class="flex items-center justify-center">
                      <div class="w-16 h-16 rounded-full bg-[var(--color-secondary)] flex items-center justify-center mr-4">
                        <span class="text-white font-bold text-xl">A</span>
                      </div>
                      <div class="text-left">
                        <h4 class="font-semibold text-[var(--color-text)] text-lg">Aurelie Bukongo</h4>
                        <p class="text-[var(--color-text)]/70 text-sm">Wedding Photography</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>


          </div>
        </div>

      </div>
    </BaseSection>
    
    <!-- Contact CTA Section -->
    <BaseSection background="light" padding="lg">
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
import { ref, onMounted, onUnmounted } from 'vue'
import HeroSection from '@/components/home/HeroSection.vue'
import AboutSection from '@/components/home/AboutSection.vue'
import PortfolioPreview from '@/components/home/PortfolioPreview.vue'
import PackagesPreview from '@/components/home/PackagesPreview.vue'
import BaseSection from '@/components/ui/BaseSection.vue'
import BaseHeading from '@/components/ui/BaseHeading.vue'
import BaseText from '@/components/ui/BaseText.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

// Carousel functionality
const currentSlide = ref(0)
const totalSlides = 3

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % totalSlides
}

// Auto-advance carousel
let intervalId: number | null = null

const startAutoAdvance = () => {
  intervalId = window.setInterval(() => {
    nextSlide()
  }, 5000) // Change slide every 5 seconds
}

const stopAutoAdvance = () => {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
}

onMounted(() => {
  startAutoAdvance()
})

onUnmounted(() => {
  stopAutoAdvance()
})


</script>