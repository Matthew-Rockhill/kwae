<template>
  <section class="min-h-screen flex items-center justify-center bg-[var(--color-light)] w-full">
    <!-- Hero Image with Overlay -->
    <div class="relative w-full h-[100vh] overflow-hidden">
      <img 
        src="/src/assets/images/Klein-Barmen-farm-found-just-outside-of-Okahandja.jpg" 
        alt="Authentic photography" 
        class="h-full w-full object-cover object-center"
      />
      
      <!-- Text Overlay - Mobile Optimized -->
      <div class="absolute bottom-8 right-4 left-4 md:left-auto md:right-12 md:bottom-12 text-center md:text-right">
        <BaseHeading :level="1" variant="hero" color="white" align="center" class="drop-shadow-2xl md:text-right">
          Capturing Beauty in<br>Humble Places
        </BaseHeading>
        <button
          class="mt-4 md:mt-6 px-6 py-2.5 md:px-8 md:py-3 text-base md:text-lg font-semibold rounded shadow-lg bg-white text-[var(--color-text)] hover:bg-[var(--color-secondary)] hover:text-white transition border border-[var(--color-text)] w-full sm:w-auto max-w-xs mx-auto md:mx-0"
          @click="$emit('book-now')"
        >
          Book Now
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import BaseHeading from '@/components/ui/BaseHeading.vue'
</script>