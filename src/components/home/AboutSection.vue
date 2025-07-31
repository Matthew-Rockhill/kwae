<template>
    <section id="about" class="bg-[var(--color-background)]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          <!-- Left Column: Content -->
          <div class="lg:col-span-7 order-2 lg:order-1">
            <!-- Heading with better line control -->
            <div class="mb-8">
              <BaseHeading :level="2" :animate="true" class="text-balance leading-tight">
                <span class="block sm:inline">The Heart Behind</span>
                <span class="block sm:inline font-cormorant italic font-normal text-[var(--color-secondary)]"> Kristin With An Eye</span>
              </BaseHeading>
            </div>
            
            <!-- Content with better spacing -->
            <div class="space-y-8">
              <div class="space-y-6">
                <p class="text-[var(--color-text)] text-lg font-light leading-relaxed">
                  As a photographer and storyteller, my mission is simple: to capture authentic moments, find beauty in humble places, and share stories that connect us all.
                </p>
                
                <div class="relative pl-8 py-4">
                  <div class="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-[var(--color-secondary)] to-[var(--color-accent)] rounded-full"></div>
                  <p class="font-cormorant text-xl italic text-[var(--color-secondary)] leading-relaxed">
                    "I help individuals, families, and organisations expand their reach and make an impact through intentional, visual storytelling."
                  </p>
                </div>
                
                <p class="text-[var(--color-text)] text-lg font-light leading-relaxed">
                  With a background in Print Journalism, Media and Social Anthropology, and over a decade of experience working across the NGO and EdTech sectors, I bring both heart and strategy to every story I tell.
                </p>
                
                <p class="text-[var(--color-text)] text-lg font-light leading-relaxed">
                  My approach is earthy, natural, and raw. I want you to feel comfortable, seen, and heard. Whether you're booking a personal session or seeking to share the heart of your business or NGO, I am committed to showcasing your story in a way that truly resonates.
                </p>
              </div>
              
              <div class="pt-4">
                <router-link to="/about">
                  <BaseButton variant="primary" size="lg">
                    DISCOVER MY APPROACH
                  </BaseButton>
                </router-link>
              </div>
            </div>
          </div>
          
          <!-- Right Column: Image -->
          <div class="lg:col-span-5 order-1 lg:order-2">
            <div class="relative overflow-hidden rounded-2xl shadow-xl">
              <img 
                src="@/assets/images/about-1.jpg" 
                alt="Kristin, photographer and storyteller" 
                class="w-full h-[400px] sm:h-[500px] lg:h-[600px] object-cover object-center"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </template>
  
  <script setup lang="ts">
  import BaseButton from '@/components/ui/BaseButton.vue'
  import BaseHeading from '@/components/ui/BaseHeading.vue'
  </script>