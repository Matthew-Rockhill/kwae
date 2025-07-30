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
        <h1 class="text-white font-montserrat font-medium text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl leading-tight drop-shadow-2xl">
          Capturing Beauty in<br>Humble Places
        </h1>
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
// No imports needed for this simplified version
</script>