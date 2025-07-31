<template>
    <section class="bg-white overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="text-center mb-12">
          <BaseHeading :level="2" :animate="true" align="center" class="mb-6">
            A Glimpse into <span class="font-cormorant italic font-normal text-[var(--color-secondary)]">My Work</span>
          </BaseHeading>
          <p class="text-[var(--color-text)] text-lg font-light leading-relaxed max-w-2xl mx-auto">
            Stories worth telling, moments worth remembering
          </p>
        </div>
        
        <!-- Instagram-Style Portfolio Ticker -->
        <div class="relative overflow-hidden">
          <!-- Scrolling Container -->
          <div class="flex gap-4 animate-scroll">
            <!-- Family Stories -->
            <router-link to="/portfolio?category=family" class="group flex-shrink-0 w-[280px] h-[500px] relative overflow-hidden rounded-3xl shadow-xl">
              <img 
                src="@/assets/images/family-home-cover.jpg" 
                alt="Family Photography" 
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
              <div class="absolute top-4 left-4 right-4">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                    <div class="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <span class="text-white text-sm font-medium">Family</span>
                </div>
              </div>
              <div class="absolute bottom-4 left-4 right-4">
                <h3 class="text-white font-medium text-xl mb-2">Family Stories</h3>
                <p class="text-white/80 text-sm">Authentic connections & precious moments captured with love</p>
              </div>
            </router-link>
            
            <!-- NGO Impact -->
            <router-link to="/portfolio?category=ngo" class="group flex-shrink-0 w-[280px] h-[500px] relative overflow-hidden rounded-3xl shadow-xl">
              <img 
                src="@/assets/images/ngo-home-cover.jpg" 
                alt="NGO Storytelling" 
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
              <div class="absolute top-4 left-4 right-4">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                    <div class="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <span class="text-white text-sm font-medium">NGO Stories</span>
                </div>
              </div>
              <div class="absolute bottom-4 left-4 right-4">
                <h3 class="text-white font-medium text-xl mb-2">Impact Stories</h3>
                <p class="text-white/80 text-sm">Documenting change, hope & meaningful work</p>
              </div>
            </router-link>
            
            <!-- Lifestyle Events -->
            <router-link to="/portfolio?category=lifestyle" class="group flex-shrink-0 w-[280px] h-[500px] relative overflow-hidden rounded-3xl shadow-xl">
              <img 
                src="@/assets/images/lifestyle-home-cover.jpg" 
                alt="Lifestyle Photography" 
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
              <div class="absolute top-4 left-4 right-4">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                    <div class="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <span class="text-white text-sm font-medium">Lifestyle</span>
                </div>
              </div>
              <div class="absolute bottom-4 left-4 right-4">
                <h3 class="text-white font-medium text-xl mb-2">Life Celebrations</h3>
                <p class="text-white/80 text-sm">Weddings, events & life's special milestones</p>
              </div>
            </router-link>
            
            <!-- Branding -->
            <router-link to="/portfolio?category=branding" class="group flex-shrink-0 w-[280px] h-[500px] relative overflow-hidden rounded-3xl shadow-xl">
              <img 
                src="@/assets/images/branding-home-cover.jpg" 
                alt="Branding Photography" 
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
              <div class="absolute top-4 left-4 right-4">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                    <div class="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <span class="text-white text-sm font-medium">Branding</span>
                </div>
              </div>
              <div class="absolute bottom-4 left-4 right-4">
                <h3 class="text-white font-medium text-xl mb-2">Brand Identity</h3>
                <p class="text-white/80 text-sm">Visual storytelling for businesses & entrepreneurs</p>
              </div>
            </router-link>
            
            <!-- Duplicate items for seamless scroll -->
            <!-- Family Stories (duplicate) -->
            <router-link to="/portfolio?category=family" class="group flex-shrink-0 w-[280px] h-[500px] relative overflow-hidden rounded-3xl shadow-xl">
              <img 
                src="@/assets/images/family-home-cover.jpg" 
                alt="Family Photography" 
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
              <div class="absolute top-4 left-4 right-4">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                    <div class="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <span class="text-white text-sm font-medium">Family</span>
                </div>
              </div>
              <div class="absolute bottom-4 left-4 right-4">
                <h3 class="text-white font-medium text-xl mb-2">Family Stories</h3>
                <p class="text-white/80 text-sm">Authentic connections & precious moments captured with love</p>
              </div>
            </router-link>
            
            <!-- NGO Impact (duplicate) -->
            <router-link to="/portfolio?category=ngo" class="group flex-shrink-0 w-[280px] h-[500px] relative overflow-hidden rounded-3xl shadow-xl">
              <img 
                src="@/assets/images/ngo-home-cover.jpg" 
                alt="NGO Storytelling" 
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
              <div class="absolute top-4 left-4 right-4">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                    <div class="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <span class="text-white text-sm font-medium">NGO Stories</span>
                </div>
              </div>
              <div class="absolute bottom-4 left-4 right-4">
                <h3 class="text-white font-medium text-xl mb-2">Impact Stories</h3>
                <p class="text-white/80 text-sm">Documenting change, hope & meaningful work</p>
              </div>
            </router-link>
            
            <!-- Lifestyle Events (duplicate) -->
            <router-link to="/portfolio?category=lifestyle" class="group flex-shrink-0 w-[280px] h-[500px] relative overflow-hidden rounded-3xl shadow-xl">
              <img 
                src="@/assets/images/lifestyle-home-cover.jpg" 
                alt="Lifestyle Photography" 
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
              <div class="absolute top-4 left-4 right-4">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                    <div class="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <span class="text-white text-sm font-medium">Lifestyle</span>
                </div>
              </div>
              <div class="absolute bottom-4 left-4 right-4">
                <h3 class="text-white font-medium text-xl mb-2">Life Celebrations</h3>
                <p class="text-white/80 text-sm">Weddings, events & life's special milestones</p>
              </div>
            </router-link>
            
            <!-- Branding (duplicate) -->
            <router-link to="/portfolio?category=branding" class="group flex-shrink-0 w-[280px] h-[500px] relative overflow-hidden rounded-3xl shadow-xl">
              <img 
                src="@/assets/images/branding-home-cover.jpg" 
                alt="Branding Photography" 
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
              <div class="absolute top-4 left-4 right-4">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                    <div class="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <span class="text-white text-sm font-medium">Branding</span>
                </div>
              </div>
              <div class="absolute bottom-4 left-4 right-4">
                <h3 class="text-white font-medium text-xl mb-2">Brand Identity</h3>
                <p class="text-white/80 text-sm">Visual storytelling for businesses & entrepreneurs</p>
              </div>
            </router-link>
          </div>
        </div>
        
        <!-- View Portfolio Button -->
        <div class="text-center mt-12">
          <router-link to="/portfolio">
            <BaseButton variant="primary" size="lg">
              View Portfolio
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
  
  <style scoped>
  @keyframes scroll {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-50%);
    }
  }
  
  .animate-scroll {
    animation: scroll 20s linear infinite;
    width: 200%;
  }
  
  .animate-scroll:hover {
    animation-play-state: paused;
  }
  </style>