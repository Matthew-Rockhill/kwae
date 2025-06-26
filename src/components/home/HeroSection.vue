<template>
  <section class="relative h-screen min-h-[650px] max-h-[800px] overflow-hidden">
    <!-- Hero Background -->
    <div class="absolute inset-0">
      <!-- Full width image container -->
      <div class="absolute inset-0">
        <!-- Reduced overlay gradient -->
        <div class="absolute inset-0 bg-gradient-to-r from-black/30 via-black/15 to-transparent z-10"></div>
        <!-- Image -->
        <img 
          src="/src/assets/images/Klein-Barmen-farm-found-just-outside-of-Okahandja.jpg" 
          alt="Authentic photography" 
          class="h-full w-full object-cover object-center"
        />
      </div>
    </div>

    <!-- Hero Content -->
    <div class="relative h-full flex items-center z-20">
      <div class="container-custom">
        <div class="max-w-2xl mx-auto text-center px-4">
          <h1 class="text-white font-montserrat font-extralight leading-tight mb-8 text-4xl md:text-5xl lg:text-6xl" style="text-shadow: 2px 2px 4px rgba(0,0,0,0.7);">
            Capturing Beauty in <span class="font-cormorant italic font-normal text-[var(--color-orange)]">Humble Places</span>
          </h1>
          <p class="text-lg md:text-xl text-white font-light mb-10 max-w-lg mx-auto" style="text-shadow: 1px 1px 3px rgba(0,0,0,0.7);">
            I believe in finding the extraordinary in the ordinary. Whether it's a family milestone, 
            an intimate moment, or a purpose-driven cause, I'm here to tell your story through 
            authentic and meaningful photography.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <router-link to="/contact">
              <BaseButton variant="primary" size="lg">
                BOOK YOUR SESSION
              </BaseButton>
            </router-link>
            <router-link to="/portfolio">
              <BaseButton variant="white" size="lg">
                DISCOVER MY WORK
              </BaseButton>
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Decorative Element -->
    <div class="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10">
      <div class="h-px w-32 bg-[var(--color-orange)]"></div>
    </div>
  </section>
</template>

<script setup lang="ts">
import BaseButton from '@/components/ui/BaseButton.vue'
</script>