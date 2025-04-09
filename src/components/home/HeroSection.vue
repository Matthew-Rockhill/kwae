<template>
  <section class="relative h-screen min-h-[650px] max-h-[800px] overflow-hidden">
    <!-- Hero Background -->
    <div class="absolute inset-0">
      <!-- Full width image container -->
      <div class="absolute inset-0">
        <!-- Overlay gradient -->
        <div class="absolute inset-0 bg-gradient-to-r from-[#33423C]/80 via-[#33423C]/40 to-transparent z-10"></div>
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
          <h1 class="text-[#F6F2ED] font-montserrat font-extralight leading-tight mb-8 text-4xl md:text-5xl lg:text-6xl">
            Capturing Beauty in <span class="font-cormorant italic font-normal text-[#DCCDC3]">Humble Places</span>
          </h1>
          <p class="text-lg md:text-xl text-[#F6F2ED] font-light mb-10 max-w-lg mx-auto">
            I believe in finding the extraordinary in the ordinary. Whether it's a family milestone, 
            an intimate moment, or a purpose-driven cause, I'm here to tell your story through 
            authentic and meaningful photography.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <router-link to="/contact">
              <button class="btn-primary w-full sm:w-auto bg-[#33423C] hover:bg-[#2A3630] text-[#F6F2ED] hover:border-[#DCCDC3] transition-all duration-300 px-8 py-3 rounded-none">
                BOOK YOUR SESSION
              </button>
            </router-link>
            <router-link to="/portfolio">
              <button class="btn-secondary w-full sm:w-auto bg-transparent hover:bg-[#33423C]/20 text-[#F6F2ED] border border-[#F6F2ED] hover:border-[#DCCDC3] transition-all duration-300 px-8 py-3 rounded-none">
                DISCOVER MY WORK
              </button>
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Decorative Element -->
    <div class="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10">
      <div class="h-px w-32 bg-[#DCCDC3]"></div>
    </div>
  </section>
</template>

<script setup lang="ts">
// No special logic needed
</script>