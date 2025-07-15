<template>
  <section class="min-h-screen flex items-center justify-center bg-[var(--color-light)] w-full">
    <!-- Hero Image with Overlay -->
    <div class="relative w-full h-[100vh] overflow-hidden">
      <img 
        src="/src/assets/images/Klein-Barmen-farm-found-just-outside-of-Okahandja.jpg" 
        alt="Authentic photography" 
        class="h-full w-full object-cover object-center"
      />
      
      <!-- Text Overlay - Bottom Right -->
      <div class="absolute bottom-12 right-12 text-right">
        <h1 class="text-white font-montserrat font-medium text-3xl md:text-4xl lg:text-5xl xl:text-6xl leading-tight drop-shadow-2xl">
          Capturing Beauty in<br>Humble Places
        </h1>
        <button
          class="mt-6 px-8 py-3 text-lg font-semibold rounded shadow-lg bg-white text-[var(--color-text)] hover:bg-[var(--color-secondary)] hover:text-white transition border border-[var(--color-text)]"
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