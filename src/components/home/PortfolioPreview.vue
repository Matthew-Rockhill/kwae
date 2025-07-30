<template>
    <section class="bg-white">
      <div class="container-custom">
        <div class="text-center max-w-3xl mx-auto mb-16">
          <BaseHeading :level="2" class="mb-6">
            A Glimpse into <span class="font-cormorant italic font-normal text-[var(--color-text)]">My Work</span>
          </BaseHeading>
          <p class="text-[var(--color-text)]/70 text-lg font-light leading-relaxed">
            Explore some of my favorite stories captured through the lens. From intimate family moments 
            to long-term visual storytelling for organisations, I bring a sense of authenticity and beauty to 
            every project.
          </p>
        </div>
        
        <!-- Bento Grid -->
        <div class="grid gap-4 lg:grid-cols-3 lg:grid-rows-2">
          <!-- Large Featured Card (Family) -->
          <router-link to="/portfolio?category=family" class="relative lg:row-span-2 group">
            <div class="relative h-full overflow-hidden rounded-[calc(var(--radius-lg)+1px)] lg:rounded-l-[calc(2rem+1px)]">
              <img 
                src="@/assets/images/family-home-cover.jpg" 
                alt="Family Photography" 
                class="w-full h-full object-cover"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-[var(--color-text)]/80 via-[var(--color-text)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div class="absolute inset-0 flex flex-col justify-end p-8 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                <span class="text-[var(--color-accent)] text-sm uppercase tracking-wider mb-2">Family</span>
                <BaseHeading :level="3" color="white" variant="light">Capturing Family Moments</BaseHeading>
              </div>
            </div>
            <div class="pointer-events-none absolute inset-px rounded-lg ring-1 shadow-sm ring-[var(--color-text)]/5 lg:rounded-l-[2rem]" />
          </router-link>

          <!-- Square Card (NGO) -->
          <router-link to="/portfolio?category=ngo" class="relative max-lg:row-start-1 group">
            <div class="relative aspect-square overflow-hidden rounded-[calc(var(--radius-lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)]">
              <img 
                src="@/assets/images/ngo-home-cover.jpg" 
                alt="NGO Storytelling" 
                class="w-full h-full object-cover"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-[var(--color-text)]/80 via-[var(--color-text)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div class="absolute inset-0 flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                <span class="text-[var(--color-accent)] text-sm uppercase tracking-wider mb-2">NGO Storytelling</span>
                <BaseHeading :level="3" color="white" variant="light">Documenting Impact</BaseHeading>
              </div>
            </div>
            <div class="pointer-events-none absolute inset-px rounded-lg ring-1 shadow-sm ring-[#33423C]/5 max-lg:rounded-t-[2rem]" />
          </router-link>

          <!-- Vertical Card (Branding) -->
          <router-link to="/portfolio?category=branding" class="relative max-lg:row-start-3 lg:col-start-2 lg:row-start-2 group">
            <div class="relative h-full overflow-hidden rounded-[calc(var(--radius-lg)+1px)]">
              <img 
                src="@/assets/images/branding-home-cover.jpg" 
                alt="Branding Photography" 
                class="w-full h-full object-cover"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-[var(--color-text)]/80 via-[var(--color-text)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div class="absolute inset-0 flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                <span class="text-[var(--color-accent)] text-sm uppercase tracking-wider mb-2">Branding</span>
                <BaseHeading :level="3" color="white" variant="light">Visual Identity</BaseHeading>
          </div>
                </div>
            <div class="pointer-events-none absolute inset-px rounded-lg ring-1 shadow-sm ring-[#33423C]/5" />
          </router-link>

          <!-- Large Card (Lifestyle) -->
          <router-link to="/portfolio?category=lifestyle" class="relative lg:row-span-2 group">
            <div class="relative h-full overflow-hidden rounded-[calc(var(--radius-lg)+1px)] max-lg:rounded-b-[calc(2rem+1px)] lg:rounded-r-[calc(2rem+1px)]">
              <img 
                src="@/assets/images/lifestyle-home-cover.jpg" 
                alt="Lifestyle Photography" 
                class="w-full h-full object-cover"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-[var(--color-text)]/80 via-[var(--color-text)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div class="absolute inset-0 flex flex-col justify-end p-8 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                <span class="text-[var(--color-accent)] text-sm uppercase tracking-wider mb-2">Lifestyle</span>
                <BaseHeading :level="3" color="white" variant="light">Everyday Stories</BaseHeading>
              </div>
            </div>
            <div class="pointer-events-none absolute inset-px rounded-lg ring-1 shadow-sm ring-[#33423C]/5 max-lg:rounded-b-[2rem] lg:rounded-r-[2rem]" />
          </router-link>
        </div>
        
        <!-- CTA Button -->
        <div class="text-center mt-12">
          <router-link to="/portfolio">
            <BaseButton variant="primary">
              SEE MORE WORK
            </BaseButton>
          </router-link>
        </div>
      </div>
    </section>
  </template>
  
  <script setup lang="ts">
  import BaseButton from '@/components/ui/BaseButton.vue'
  import BaseHeading from '@/components/ui/BaseHeading.vue'
  </script>