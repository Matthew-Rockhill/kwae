<template>
    <section id="about" class="py-24 md:py-32 bg-[var(--color-background)]">
      <div class="container-custom">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <!-- Left Column: Content -->
          <div class="order-2 lg:order-1">
            <h2 class="text-2xl md:text-3xl font-extralight text-[var(--color-text)] mb-6 whitespace-nowrap">
              The Heart Behind <span class="font-cormorant italic font-normal text-[var(--color-text)]">Kristin With An Eye</span>
            </h2>
            
            <div class="mt-10 space-y-6">
              <p class="text-[var(--color-text)] text-lg font-light leading-relaxed">
                As a photographer and storyteller, my mission is simple: to capture authentic moments, 
                to find beauty in humble places, and to share stories that connect us all.
              </p>
              
              <div class="pl-6 border-l-2 border-[var(--color-accent)] py-2">
                <p class="font-cormorant text-xl italic text-[var(--color-secondary)]">
                  "I aim to help individuals, families, and organisations expand their reach and make 
                  an impact through visual storytelling."
                </p>
              </div>
              
              <p class="text-[var(--color-text)] text-lg font-light leading-relaxed">
                My approach is earthy, natural, and raw. I want you to feel comfortable, seen, and heard. 
                Whether you're booking a personal photography session or seeking to share the heart of your 
                business or NGO, I am committed to showcasing your unique story in a way that resonates with 
                your audience.
              </p>
              
              <div class="mt-10">
                <router-link to="/about">
                  <BaseButton variant="primary">
                    DISCOVER MY APPROACH
                  </BaseButton>
                </router-link>
              </div>
            </div>
          </div>
          
          <!-- Right Column: Images -->
          <div class="order-1 lg:order-2 relative">
            <div class="grid grid-cols-2 gap-4">
              <!-- First Image -->
              <div class="relative overflow-hidden rounded-lg shadow-xl">
                <img 
                  src="@/assets/images/about-1.jpg" 
                  alt="Family photography session" 
                  class="w-full h-[500px] object-cover object-center transform hover:scale-105 transition-transform duration-500"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              
              <!-- Second Image -->
              <div class="relative overflow-hidden rounded-lg shadow-xl">
                <img 
                  src="@/assets/images/about-2.jpg" 
                  alt="Nature photography" 
                  class="w-full h-[500px] object-cover object-center transform hover:scale-105 transition-transform duration-500"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </template>
  
  <script setup lang="ts">
  import BaseButton from '@/components/ui/BaseButton.vue'
  </script>