<template>
  <section class="min-h-screen flex items-center justify-center bg-[var(--color-light)] p-[5px]">
    <!-- Hero Image with Overlay -->
    <div class="relative w-full h-[calc(100vh-10px)] overflow-hidden rounded-2xl shadow-xl">
      <img 
        src="/src/assets/images/Klein-Barmen-farm-found-just-outside-of-Okahandja.jpg" 
        alt="Authentic photography" 
        class="h-full w-full object-cover object-center"
      />
      
      <!-- Text Overlay - Bottom Right -->
      <div class="absolute bottom-12 right-12 text-right">
        <h1 class="text-white font-montserrat font-medium text-3xl md:text-4xl lg:text-5xl xl:text-6xl leading-tight drop-shadow-2xl">
          Capturing beauty in<br>humble places
        </h1>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// No imports needed for this simplified version
</script>