<template>
  <section class="min-h-screen flex flex-col">
    <!-- Hero Text Section -->
    <div class="bg-[var(--color-accent)] pt-16 md:pt-24 lg:pt-32 pb-8 md:pb-12 flex-shrink-0">
      <div class="container-custom">
        <div class="max-w-4xl mx-auto text-center px-4">
          <h1 class="text-[var(--color-text)] font-montserrat font-extralight leading-tight mb-8 text-4xl md:text-5xl lg:text-6xl">
            Capturing Beauty in<br>
            <span class="font-cormorant italic font-normal text-[var(--color-secondary)]">Humble Places</span>
          </h1>
          <p class="text-lg md:text-xl text-[var(--color-text)]/80 font-light mb-10 max-w-3xl mx-auto leading-relaxed">
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
              <BaseButton variant="secondary" size="lg">
                DISCOVER MY WORK
              </BaseButton>
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Hero Image Section -->
    <div class="flex-1 bg-[var(--color-accent)] pt-8 md:pt-12 pb-16 md:pb-24">
      <div class="container-custom">
        <div class="relative min-h-[400px] lg:min-h-[500px] overflow-hidden rounded-2xl shadow-xl">
          <img 
            src="/src/assets/images/Klein-Barmen-farm-found-just-outside-of-Okahandja.jpg" 
            alt="Authentic photography" 
            class="h-full w-full object-cover object-center"
          />
          
          <!-- Decorative Element -->
          <div class="absolute top-10 left-1/2 transform -translate-x-1/2">
            <div class="h-px w-32 bg-[var(--color-accent)] opacity-80"></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import BaseButton from '@/components/ui/BaseButton.vue'
</script>