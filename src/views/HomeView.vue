<template>
  <div>
    <HeroSection />
    <AboutSection />
    <PortfolioPreview />
    <PackagesPreview />
    
    <!-- Modern Testimonials Section -->
    <section class="py-24 md:py-32 bg-gradient-to-br from-white via-[#FDFBF8] to-[#F6F2ED]">
      <div class="container-custom">
        <div class="text-center max-w-3xl mx-auto mb-20">
          <h2 class="text-4xl md:text-5xl font-extralight text-[#33423C] mb-6">
            Stories From <span class="font-cormorant italic font-normal text-[#6A7D72]">The Heart</span>
          </h2>
          <p class="text-[#6A7D72] text-xl font-light leading-relaxed">
            Every session tells a story. Here's what clients say about their experience.
          </p>
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
                    <div class="text-[#DCCDC3] mb-8 flex justify-center">
                      <svg class="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z"/>
                      </svg>
                    </div>
                    <p class="text-[#33423C] text-xl md:text-2xl font-light leading-relaxed mb-8 italic max-w-4xl mx-auto">
                      "Kristin with an eye doesn't simply take photographs. She tells stories that live and breathe through every frame. Her work is a compelling fusion of visual imagery and heartfelt narrative."
                    </p>
                    <div class="flex items-center justify-center">
                      <div class="w-16 h-16 rounded-full bg-gradient-to-br from-[#DCCDC3] to-[#6A7D72] flex items-center justify-center mr-4">
                        <span class="text-white font-bold text-xl">A</span>
                      </div>
                      <div class="text-left">
                        <h4 class="font-semibold text-[#33423C] text-lg">Anton Cuyler</h4>
                        <p class="text-[#6A7D72] text-sm">CEO/Founder, The Sozo Foundation</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Testimonial Slide 2 - Denise Malan -->
                <div class="w-full flex-shrink-0">
                  <div class="p-8 md:p-16 text-center">
                    <div class="text-[#DCCDC3] mb-8 flex justify-center">
                      <svg class="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z"/>
                      </svg>
                    </div>
                    <p class="text-[#33423C] text-xl md:text-2xl font-light leading-relaxed mb-8 italic max-w-4xl mx-auto">
                      "We had a family photoshoot that was incredibly enjoyable in one of the most stunning parts of Cape Town during sunset. Her creativity shines through in every shot — she has a true gift for capturing beautiful, genuine moments."
                    </p>
                    <div class="flex items-center justify-center">
                      <div class="w-16 h-16 rounded-full bg-gradient-to-br from-[#DCCDC3] to-[#6A7D72] flex items-center justify-center mr-4">
                        <span class="text-white font-bold text-xl">D</span>
                      </div>
                      <div class="text-left">
                        <h4 class="font-semibold text-[#33423C] text-lg">Denise Malan</h4>
                        <p class="text-[#6A7D72] text-sm">Family Session</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Testimonial Slide 3 - Aurelie Bukongo -->
                <div class="w-full flex-shrink-0">
                  <div class="p-8 md:p-16 text-center">
                    <div class="text-[#DCCDC3] mb-8 flex justify-center">
                      <svg class="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z"/>
                      </svg>
                    </div>
                    <p class="text-[#33423C] text-xl md:text-2xl font-light leading-relaxed mb-8 italic max-w-4xl mx-auto">
                      "From candid emotions to beautifully posed portraits, Kristin made sure no moment was missed. Looking at these photos, we are instantly transported back to the magic of our wedding day."
                    </p>
                    <div class="flex items-center justify-center">
                      <div class="w-16 h-16 rounded-full bg-gradient-to-br from-[#DCCDC3] to-[#6A7D72] flex items-center justify-center mr-4">
                        <span class="text-white font-bold text-xl">A</span>
                      </div>
                      <div class="text-left">
                        <h4 class="font-semibold text-[#33423C] text-lg">Aurelie Bukongo</h4>
                        <p class="text-[#6A7D72] text-sm">Wedding Photography</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Carousel Navigation - Bottom Center -->
            <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center space-x-4">
              <!-- Previous Button -->
              <button 
                @click="prevSlide" 
                class="w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
              >
                <svg class="w-5 h-5 text-[#33423C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                </svg>
              </button>

              <!-- Carousel Indicators -->
              <div class="flex space-x-2">
                <button 
                  v-for="(slide, index) in 3" 
                  :key="index"
                  @click="currentSlide = index"
                  class="w-3 h-3 rounded-full transition-all duration-200"
                  :class="currentSlide === index ? 'bg-[#33423C]' : 'bg-white/50 hover:bg-white/80'"
                ></button>
              </div>

              <!-- Next Button -->
              <button 
                @click="nextSlide" 
                class="w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
              >
                <svg class="w-5 h-5 text-[#33423C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
    
    <!-- Contact CTA Section -->
    <section class="py-16 md:py-24 bg-[#F6F2ED] text-[#33423C]">
      <div class="container-custom text-center">
        <h2 class="text-3xl md:text-4xl font-extralight mb-8">
          Ready to <span class="font-cormorant italic font-normal text-[#6A7D72]">Tell Your Story?</span>
        </h2>
        <p class="text-lg max-w-2xl mx-auto mb-10 text-[#6A7D72] font-light">
          Let's work together to capture your authentic moments and create beautiful memories that last a lifetime.
        </p>
        <router-link to="/contact">
          <button class="bg-[#33423C] hover:bg-[#6A7D72] text-[#F6F2ED] font-medium py-3 px-8 transition duration-300 uppercase tracking-wider">
            Book Your Session Today
          </button>
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import HeroSection from '@/components/home/HeroSection.vue'
import AboutSection from '@/components/home/AboutSection.vue'
import PortfolioPreview from '@/components/home/PortfolioPreview.vue'
import PackagesPreview from '@/components/home/PackagesPreview.vue'

// Carousel functionality
const currentSlide = ref(0)
const totalSlides = 3

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % totalSlides
}

const prevSlide = () => {
  currentSlide.value = currentSlide.value === 0 ? totalSlides - 1 : currentSlide.value - 1
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