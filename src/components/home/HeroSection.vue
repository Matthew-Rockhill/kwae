<template>
  <section class="min-h-screen flex items-center justify-center bg-[var(--color-light)] w-full">
    <!-- Hero Image with Overlay -->
    <div class="relative w-full h-[100vh] overflow-hidden">
      <img 
        src="/src/assets/images/Klein-Barmen-farm-found-just-outside-of-Okahandja.jpg" 
        alt="Authentic photography" 
        class="h-full w-full object-cover object-center"
      />
      
      <!-- Centered Content Overlay -->
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="text-center px-4 max-w-4xl mx-auto">
          <div>
            <BaseHeading :level="1" variant="hero" color="white" align="center" :shadow="true" :animate="true" class="mb-6" style="text-shadow: 2px 2px 4px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.5);">
              Capturing Beauty in <span class="font-cormorant italic font-light text-white" style="text-shadow: 2px 2px 4px rgba(0,0,0,0.8);">Humble Places</span>
            </BaseHeading>
            <BaseText size="xl" color="white" :opacity="100" align="center" class="animate-fade-in-up animation-delay-300 mb-8 font-light" style="text-shadow: 1px 1px 3px rgba(0,0,0,0.8);">
              Capturing beauty in humble places and telling stories that matter
            </BaseText>
            <div class="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-600">
              <button
                class="px-8 py-3 text-base font-medium rounded-lg shadow-2xl bg-white text-[var(--color-text)] hover:bg-gray-100 hover:scale-105 transition-all duration-300 border-2 border-white"
                @click="$emit('book-now')"
              >
                Book Your Session
              </button>
              <router-link to="/portfolio">
                <button class="px-8 py-3 text-base font-medium rounded-lg shadow-xl bg-transparent text-white border-2 border-white hover:bg-white hover:text-[var(--color-text)] hover:scale-105 transition-all duration-300 backdrop-blur-sm">
                  View Portfolio
                </button>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import BaseHeading from '@/components/ui/BaseHeading.vue'
import BaseText from '@/components/ui/BaseText.vue'
</script>