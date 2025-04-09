<template>
    <section class="py-24 md:py-32 bg-white">
      <div class="container-custom">
        <div class="text-center max-w-3xl mx-auto mb-16">
          <h2 class="text-3xl md:text-4xl font-extralight text-[#33423C] mb-6">
            A Glimpse into <span class="font-cormorant italic font-normal text-[#6A7D72]">My Work</span>
          </h2>
          <p class="text-[#6A7D72] text-lg font-light leading-relaxed">
            Explore some of my favorite stories captured through the lens. From intimate family moments 
            to long-term visual storytelling for organisations, I bring a sense of authenticity and beauty to 
            every project.
          </p>
        </div>
        
        <!-- Bento Grid -->
        <div class="grid gap-4 lg:grid-cols-3 lg:grid-rows-2">
          <!-- Large Featured Card -->
          <div class="relative lg:row-span-2">
            <div class="absolute inset-px rounded-lg bg-[#F6F2ED] lg:rounded-l-[2rem]" />
            <div class="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] lg:rounded-l-[calc(2rem+1px)]">
              <div class="px-8 pt-8 pb-3 sm:px-10 sm:pt-10 sm:pb-0">
                <span class="text-[#6A7D72] text-sm uppercase tracking-wider">{{ featuredItem.category }}</span>
                <h3 class="mt-2 text-xl font-light tracking-tight text-[#33423C] max-lg:text-center">{{ featuredItem.title }}</h3>
                <p class="mt-4 text-base font-light text-[#6A7D72] max-lg:text-center">
                  A heartwarming family session capturing the genuine connections and joyful moments 
                  that make this family unique. Through natural interactions and candid shots, we 
                  created timeless memories that tell their story with authenticity and warmth.
                </p>
              </div>
              <div class="relative min-h-[30rem] w-full grow max-lg:mx-auto max-lg:max-w-sm">
                <div class="absolute inset-x-10 top-10 bottom-0 overflow-hidden rounded-t-[12cqw] border-x-[3cqw] border-t-[3cqw] border-[#33423C]/20 bg-[#F6F2ED] shadow-2xl">
                  <img 
                    v-if="imageExists(featuredItem.image)"
                    :src="featuredItem.image" 
                    :alt="featuredItem.title" 
                    class="size-full object-cover object-center"
                  />
                  <div v-else class="absolute inset-0 flex flex-col items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-[#DCCDC3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <div class="pointer-events-none absolute inset-px rounded-lg ring-1 shadow-sm ring-[#33423C]/5 lg:rounded-l-[2rem]" />
          </div>

          <!-- Square Card -->
          <div class="relative max-lg:row-start-1">
            <div class="absolute inset-px rounded-lg bg-[#F6F2ED] max-lg:rounded-t-[2rem]" />
            <div class="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)]">
              <div class="px-8 pt-8 sm:px-10 sm:pt-10">
                <span class="text-[#6A7D72] text-sm uppercase tracking-wider">{{ secondaryItems[0].category }}</span>
                <h3 class="mt-2 text-lg font-light tracking-tight text-[#33423C] max-lg:text-center">{{ secondaryItems[0].title }}</h3>
                <p class="mt-2 text-sm font-light text-[#6A7D72] max-lg:text-center">
                  Capturing the essence of community impact through powerful visual storytelling.
                </p>
              </div>
              <div class="flex flex-1 items-center justify-center px-8 max-lg:pt-10 max-lg:pb-12 sm:px-10 lg:pb-2">
                <div class="relative aspect-square w-full max-lg:max-w-xs overflow-hidden rounded-lg">
                  <img 
                    v-if="imageExists(secondaryItems[0].image)"
                    :src="secondaryItems[0].image" 
                    :alt="secondaryItems[0].title" 
                    class="size-full object-cover"
                  />
                  <div v-else class="absolute inset-0 flex flex-col items-center justify-center bg-[#E6DFD7]">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-[#DCCDC3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <div class="pointer-events-none absolute inset-px rounded-lg ring-1 shadow-sm ring-[#33423C]/5 max-lg:rounded-t-[2rem]" />
          </div>

          <!-- Vertical Card -->
          <div class="relative max-lg:row-start-3 lg:col-start-2 lg:row-start-2">
            <div class="absolute inset-px rounded-lg bg-[#F6F2ED]" />
            <div class="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)]">
              <div class="px-8 pt-8 sm:px-10 sm:pt-10">
                <span class="text-[#6A7D72] text-sm uppercase tracking-wider">{{ secondaryItems[1].category }}</span>
                <h3 class="mt-2 text-lg font-light tracking-tight text-[#33423C] max-lg:text-center">{{ secondaryItems[1].title }}</h3>
                <p class="mt-2 text-sm font-light text-[#6A7D72] max-lg:text-center">
                  Celebrating the beauty of new beginnings with intimate maternity photography.
                </p>
              </div>
              <div class="@container flex flex-1 items-center max-lg:py-6 lg:pb-2">
                <div class="relative h-[min(152px,40cqw)] w-full overflow-hidden rounded-lg">
                  <img 
                    v-if="imageExists(secondaryItems[1].image)"
                    :src="secondaryItems[1].image" 
                    :alt="secondaryItems[1].title" 
                    class="size-full object-cover"
                  />
                  <div v-else class="absolute inset-0 flex flex-col items-center justify-center bg-[#E6DFD7]">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-[#DCCDC3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <div class="pointer-events-none absolute inset-px rounded-lg ring-1 shadow-sm ring-[#33423C]/5" />
          </div>

          <!-- Code Preview Card -->
          <div class="relative lg:row-span-2">
            <div class="absolute inset-px rounded-lg bg-[#F6F2ED] max-lg:rounded-b-[2rem] lg:rounded-r-[2rem]" />
            <div class="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] max-lg:rounded-b-[calc(2rem+1px)] lg:rounded-r-[calc(2rem+1px)]">
              <div class="px-8 pt-8 pb-3 sm:px-10 sm:pt-10 sm:pb-0">
                <span class="text-[#6A7D72] text-sm uppercase tracking-wider">Behind the Scenes</span>
                <h3 class="mt-2 text-lg font-light tracking-tight text-[#33423C] max-lg:text-center">The Creative Process</h3>
                <p class="mt-2 text-sm font-light text-[#6A7D72] max-lg:text-center">
                  A glimpse into the technical and artistic decisions that shape each photograph.
                </p>
              </div>
              <div class="relative min-h-[30rem] w-full grow">
                <div class="absolute top-10 right-0 bottom-0 left-10 overflow-hidden rounded-tl-xl bg-[#33423C] shadow-2xl">
                  <div class="flex bg-[#33423C]/40 ring-1 ring-white/5">
                    <div class="-mb-px flex text-sm/6 font-light text-[#DCCDC3]">
                      <div class="border-r border-b border-r-white/10 border-b-white/20 bg-white/5 px-4 py-2 text-white">Camera Settings</div>
                      <div class="border-r border-[#33423C]/10 px-4 py-2">Lighting Setup</div>
                    </div>
                  </div>
                  <div class="px-6 pt-6 pb-14">
                    <div class="space-y-4">
                      <div class="flex items-center space-x-4">
                        <span class="text-[#DCCDC3] text-sm">Aperture:</span>
                        <span class="text-white text-sm">f/2.8</span>
                      </div>
                      <div class="flex items-center space-x-4">
                        <span class="text-[#DCCDC3] text-sm">Shutter Speed:</span>
                        <span class="text-white text-sm">1/250s</span>
                      </div>
                      <div class="flex items-center space-x-4">
                        <span class="text-[#DCCDC3] text-sm">ISO:</span>
                        <span class="text-white text-sm">400</span>
                      </div>
                      <div class="flex items-center space-x-4">
                        <span class="text-[#DCCDC3] text-sm">Lens:</span>
                        <span class="text-white text-sm">85mm f/1.4</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="pointer-events-none absolute inset-px rounded-lg ring-1 shadow-sm ring-[#33423C]/5 max-lg:rounded-b-[2rem] lg:rounded-r-[2rem]" />
          </div>
        </div>
        
        <!-- CTA Button -->
        <div class="text-center mt-12">
          <router-link to="/portfolio">
            <button class="btn-primary">
              SEE MORE WORK
            </button>
          </router-link>
        </div>
      </div>
    </section>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  
  // Sample portfolio items (replace with real data later)
  const portfolioItems = ref([
    {
      title: 'The Smith Family',
      category: 'Family',
      image: '/images/portfolio-1.jpg'
    },
    {
      title: 'Clean Water Initiative',
      category: 'NGO Storytelling',
      image: '/images/portfolio-2.jpg'
    },
    {
      title: 'Emma & John',
      category: 'Maternity',
      image: '/images/portfolio-3.jpg'
    }
  ])
  
  // Split items into featured and secondary
  const featuredItem = ref(portfolioItems.value[0])
  const secondaryItems = ref(portfolioItems.value.slice(1))
  
  // This is a simple function to simulate checking if an image exists
  // In a real implementation, you might want to use more sophisticated methods
  const imageExists = (imagePath: string) => {
    // For development purposes, we'll assume images don't exist
    // In a real environment, you'd want to actually check if the image exists
    return false
  }
  </script>