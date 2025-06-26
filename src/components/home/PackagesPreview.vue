<template>
    <section class="py-24 md:py-32 bg-[#E6DFD7]">
      <div class="container-custom">
        <div class="text-center max-w-3xl mx-auto mb-16">
          <h2 class="text-3xl md:text-4xl font-extralight text-[#33423C] mb-6">
            Photography Packages & <span class="font-cormorant italic font-normal text-[#6A7D72]">Visual Storytelling</span>
          </h2>
          <p class="text-[#6A7D72] text-lg font-light leading-relaxed">
            Whether you're seeking timeless family portraits, a special event captured, or a storytelling
            project to amplify your business's mission, my packages are designed to meet your needs with
            creativity, care, and quality.
          </p>
        </div>
        
        <!-- Packages Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Portrait & Family Sessions -->
          <div class="bg-white rounded-lg p-8 text-center elegant-shadow hover:-translate-y-2 transition-transform duration-300">
            <div class="text-4xl mb-4">🧡</div>
            <h3 class="text-xl font-light text-[#33423C] mb-4">Portrait & Family Sessions</h3>
            <p class="text-[#6A7D72] font-light leading-relaxed mb-6">
              Earthy, natural photos that celebrate connection and the beauty of the everyday.
            </p>
            <router-link to="/packages" class="inline-block">
              <button class="text-[#6A7D72] hover:text-[#33423C] font-light transition-colors duration-300">
                Explore Family Packages →
              </button>
            </router-link>
          </div>

          <!-- Events & Weddings -->
          <div class="bg-white rounded-lg p-8 text-center elegant-shadow hover:-translate-y-2 transition-transform duration-300">
            <div class="text-4xl mb-4">🎉</div>
            <h3 class="text-xl font-light text-[#33423C] mb-4">Events & Weddings</h3>
            <p class="text-[#6A7D72] font-light leading-relaxed mb-6">
              Candid, heartfelt coverage of milestones, celebrations, and soulful unions.
            </p>
            <router-link to="/packages" class="inline-block">
              <button class="text-[#6A7D72] hover:text-[#33423C] font-light transition-colors duration-300">
                View Event & Wedding Options →
              </button>
            </router-link>
          </div>

          <!-- Organisational Storytelling -->
          <div class="bg-white rounded-lg p-8 text-center elegant-shadow hover:-translate-y-2 transition-transform duration-300">
            <div class="text-4xl mb-4">🌍</div>
            <h3 class="text-xl font-light text-[#33423C] mb-4">Organisational Storytelling</h3>
            <p class="text-[#6A7D72] font-light leading-relaxed mb-6">
              Long-form storytelling for NGOs and changemakers — crafted with care.
            </p>
            <router-link to="/packages" class="inline-block">
              <button class="text-[#6A7D72] hover:text-[#33423C] font-light transition-colors duration-300">
                Discover the Impact Box →
              </button>
            </router-link>
          </div>
        </div>
        
        <!-- CTA Button -->
        <div class="text-center mt-12">
          <router-link to="/packages">
            <button class="btn-primary">
              View Packages
            </button>
          </router-link>
        </div>
      </div>
    </section>
  </template>
  
  <script setup lang="ts">
  // No additional script logic needed for the simplified static packages
  </script>