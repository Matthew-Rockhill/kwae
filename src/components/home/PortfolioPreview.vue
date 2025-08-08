<template>
    <section class="bg-white overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="text-center mb-8 sm:mb-12">
          <BaseHeading :level="2" :animate="true" align="center" class="mb-4 sm:mb-6">
            A Glimpse into <span class="font-cormorant italic font-normal text-[var(--color-secondary)]">My Work</span>
          </BaseHeading>
          <p class="text-[var(--color-text)] text-base sm:text-lg font-light leading-relaxed max-w-2xl mx-auto px-2 sm:px-0">
            Stories worth telling, moments worth remembering
          </p>
        </div>
        
        <!-- Mobile Reel / Desktop Ticker -->
        <div class="relative overflow-hidden">
          <!-- Mobile Navigation Hint -->
          <div class="flex sm:hidden items-center justify-center mb-4 text-xs text-[var(--color-text)]/50 space-x-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16l-4-4m0 0l4-4m-4 4h18"/>
            </svg>
            <span>Swipe to explore</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </div>
          
          <!-- Portfolio Container -->
          <div 
            class="flex gap-2 sm:gap-4 mobile-reel desktop-ticker"
            :class="{ 'animate-scroll': !isMobile }"
            ref="portfolioContainer"
            @touchstart="handleTouchStart"
            @touchmove="handleTouchMove"
            @touchend="handleTouchEnd"
          >
            <!-- Family Stories -->
            <router-link to="/portfolio?category=family" class="group flex-shrink-0 relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-xl portfolio-card">
              <img 
                src="@/assets/images/family-home-cover.jpg" 
                alt="Family Photography" 
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
              <div class="absolute top-3 sm:top-4 left-3 sm:left-4 right-3 sm:right-4">
                <div class="flex items-center gap-2">
                  <div class="w-6 h-6 sm:w-8 sm:h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                    <div class="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
                  </div>
                  <span class="text-white text-xs sm:text-sm font-medium">Family</span>
                </div>
              </div>
              <div class="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4">
                <h3 class="text-white font-medium text-lg sm:text-xl mb-1 sm:mb-2">Family Stories</h3>
                <p class="text-white/80 text-xs sm:text-sm leading-relaxed">Authentic connections & precious moments captured with love</p>
              </div>
            </router-link>
            
            <!-- NGO Impact -->
            <router-link to="/portfolio?category=ngo" class="group flex-shrink-0 relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-xl portfolio-card">
              <img 
                src="@/assets/images/ngo-home-cover.jpg" 
                alt="NGO Storytelling" 
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
              <div class="absolute top-3 sm:top-4 left-3 sm:left-4 right-3 sm:right-4">
                <div class="flex items-center gap-2">
                  <div class="w-6 h-6 sm:w-8 sm:h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                    <div class="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
                  </div>
                  <span class="text-white text-xs sm:text-sm font-medium">NGO Stories</span>
                </div>
              </div>
              <div class="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4">
                <h3 class="text-white font-medium text-lg sm:text-xl mb-1 sm:mb-2">Impact Stories</h3>
                <p class="text-white/80 text-xs sm:text-sm leading-relaxed">Documenting change, hope & meaningful work</p>
              </div>
            </router-link>
            
            <!-- Lifestyle Events -->
            <router-link to="/portfolio?category=lifestyle" class="group flex-shrink-0 relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-xl portfolio-card">
              <img 
                src="@/assets/images/lifestyle-home-cover.jpg" 
                alt="Lifestyle Photography" 
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
              <div class="absolute top-3 sm:top-4 left-3 sm:left-4 right-3 sm:right-4">
                <div class="flex items-center gap-2">
                  <div class="w-6 h-6 sm:w-8 sm:h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                    <div class="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
                  </div>
                  <span class="text-white text-xs sm:text-sm font-medium">Lifestyle</span>
                </div>
              </div>
              <div class="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4">
                <h3 class="text-white font-medium text-lg sm:text-xl mb-1 sm:mb-2">Life Celebrations</h3>
                <p class="text-white/80 text-xs sm:text-sm leading-relaxed">Weddings, events & life's special milestones</p>
              </div>
            </router-link>
            
            <!-- Branding -->
            <router-link to="/portfolio?category=branding" class="group flex-shrink-0 relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-xl portfolio-card">
              <img 
                src="@/assets/images/branding-home-cover.jpg" 
                alt="Branding Photography" 
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
              <div class="absolute top-3 sm:top-4 left-3 sm:left-4 right-3 sm:right-4">
                <div class="flex items-center gap-2">
                  <div class="w-6 h-6 sm:w-8 sm:h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                    <div class="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
                  </div>
                  <span class="text-white text-xs sm:text-sm font-medium">Branding</span>
                </div>
              </div>
              <div class="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4">
                <h3 class="text-white font-medium text-lg sm:text-xl mb-1 sm:mb-2">Brand Identity</h3>
                <p class="text-white/80 text-xs sm:text-sm leading-relaxed">Visual storytelling for businesses & entrepreneurs</p>
              </div>
            </router-link>
            
            <!-- Desktop Duplicates (hidden on mobile) -->
            <!-- Family Stories (duplicate) -->
            <router-link to="/portfolio?category=family" class="group flex-shrink-0 relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-xl portfolio-card desktop-only">
              <img 
                src="@/assets/images/family-home-cover.jpg" 
                alt="Family Photography" 
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
              <div class="absolute top-3 sm:top-4 left-3 sm:left-4 right-3 sm:right-4">
                <div class="flex items-center gap-2">
                  <div class="w-6 h-6 sm:w-8 sm:h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                    <div class="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
                  </div>
                  <span class="text-white text-xs sm:text-sm font-medium">Family</span>
                </div>
              </div>
              <div class="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4">
                <h3 class="text-white font-medium text-lg sm:text-xl mb-1 sm:mb-2">Family Stories</h3>
                <p class="text-white/80 text-xs sm:text-sm leading-relaxed">Authentic connections & precious moments captured with love</p>
              </div>
            </router-link>
            
            <!-- NGO Impact (duplicate) -->
            <router-link to="/portfolio?category=ngo" class="group flex-shrink-0 relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-xl portfolio-card desktop-only">
              <img 
                src="@/assets/images/ngo-home-cover.jpg" 
                alt="NGO Storytelling" 
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
              <div class="absolute top-3 sm:top-4 left-3 sm:left-4 right-3 sm:right-4">
                <div class="flex items-center gap-2">
                  <div class="w-6 h-6 sm:w-8 sm:h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                    <div class="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
                  </div>
                  <span class="text-white text-xs sm:text-sm font-medium">NGO Stories</span>
                </div>
              </div>
              <div class="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4">
                <h3 class="text-white font-medium text-lg sm:text-xl mb-1 sm:mb-2">Impact Stories</h3>
                <p class="text-white/80 text-xs sm:text-sm leading-relaxed">Documenting change, hope & meaningful work</p>
              </div>
            </router-link>
            
            <!-- Lifestyle Events (duplicate) -->
            <router-link to="/portfolio?category=lifestyle" class="group flex-shrink-0 relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-xl portfolio-card desktop-only">
              <img 
                src="@/assets/images/lifestyle-home-cover.jpg" 
                alt="Lifestyle Photography" 
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
              <div class="absolute top-3 sm:top-4 left-3 sm:left-4 right-3 sm:right-4">
                <div class="flex items-center gap-2">
                  <div class="w-6 h-6 sm:w-8 sm:h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                    <div class="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
                  </div>
                  <span class="text-white text-xs sm:text-sm font-medium">Lifestyle</span>
                </div>
              </div>
              <div class="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4">
                <h3 class="text-white font-medium text-lg sm:text-xl mb-1 sm:mb-2">Life Celebrations</h3>
                <p class="text-white/80 text-xs sm:text-sm leading-relaxed">Weddings, events & life's special milestones</p>
              </div>
            </router-link>
            
            <!-- Branding (duplicate) -->
            <router-link to="/portfolio?category=branding" class="group flex-shrink-0 relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-xl portfolio-card desktop-only">
              <img 
                src="@/assets/images/branding-home-cover.jpg" 
                alt="Branding Photography" 
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
              <div class="absolute top-3 sm:top-4 left-3 sm:left-4 right-3 sm:right-4">
                <div class="flex items-center gap-2">
                  <div class="w-6 h-6 sm:w-8 sm:h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                    <div class="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
                  </div>
                  <span class="text-white text-xs sm:text-sm font-medium">Branding</span>
                </div>
              </div>
              <div class="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4">
                <h3 class="text-white font-medium text-lg sm:text-xl mb-1 sm:mb-2">Brand Identity</h3>
                <p class="text-white/80 text-xs sm:text-sm leading-relaxed">Visual storytelling for businesses & entrepreneurs</p>
              </div>
            </router-link>
          </div>
          
          <!-- Mobile Progress Indicator -->
          <div class="flex sm:hidden justify-center mt-6 space-x-2">
            <div 
              v-for="(_, index) in 4" 
              :key="index"
              class="w-2 h-2 rounded-full transition-all duration-300"
              :class="index === currentSlide ? 'bg-[var(--color-secondary)] w-6' : 'bg-[var(--color-text)]/20'"
            ></div>
          </div>
        </div>
        
        <!-- View Portfolio Button -->
        <div class="text-center mt-8 sm:mt-12">
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
  import { ref, onMounted, onUnmounted } from 'vue'
  import BaseButton from '@/components/ui/BaseButton.vue'
  import BaseHeading from '@/components/ui/BaseHeading.vue'

  // Mobile touch state
  const portfolioContainer = ref<HTMLElement>()
  const touchStartX = ref(0)
  const touchCurrentX = ref(0)
  const isMobile = ref(false)
  const currentSlide = ref(0)
  const totalSlides = 4
  const isScrolling = ref(false)

  // Check if device is mobile
  const checkIsMobile = () => {
    isMobile.value = window.innerWidth < 640
  }

  // Touch event handlers for mobile reel navigation
  const handleTouchStart = (event: TouchEvent) => {
    if (!isMobile.value || !portfolioContainer.value) return
    
    touchStartX.value = event.touches[0].clientX
    touchCurrentX.value = event.touches[0].clientX
    isScrolling.value = false
  }

  const handleTouchMove = (event: TouchEvent) => {
    if (!isMobile.value || !portfolioContainer.value) return
    
    touchCurrentX.value = event.touches[0].clientX
    const deltaX = Math.abs(touchCurrentX.value - touchStartX.value)
    
    // Prevent vertical scrolling if horizontal swipe detected
    if (deltaX > 10) {
      event.preventDefault()
      isScrolling.value = true
    }
  }

  const handleTouchEnd = () => {
    if (!isMobile.value || !portfolioContainer.value || !isScrolling.value) return
    
    const deltaX = touchStartX.value - touchCurrentX.value
    const minSwipeDistance = 50
    
    if (Math.abs(deltaX) > minSwipeDistance) {
      if (deltaX > 0 && currentSlide.value < totalSlides - 1) {
        // Swipe left - next slide
        currentSlide.value++
      } else if (deltaX < 0 && currentSlide.value > 0) {
        // Swipe right - previous slide  
        currentSlide.value--
      }
      
      // Scroll to current slide
      scrollToSlide()
    }
    
    isScrolling.value = false
  }

  // Scroll to specific slide for mobile
  const scrollToSlide = () => {
    if (!isMobile.value || !portfolioContainer.value) return
    
    const cardWidth = window.innerWidth * 0.9 + 8 // 90% width + gap
    const scrollPosition = currentSlide.value * cardWidth
    
    portfolioContainer.value.scrollTo({
      left: scrollPosition,
      behavior: 'smooth'
    })
  }

  // Handle window resize
  const handleResize = () => {
    checkIsMobile()
    if (isMobile.value) {
      // Reset scroll position when switching to mobile
      setTimeout(scrollToSlide, 100)
    }
  }

  onMounted(() => {
    checkIsMobile()
    window.addEventListener('resize', handleResize)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
  })
  </script>
  
  <style scoped>
  /* Desktop animation */
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

  /* Mobile reel styles */
  .mobile-reel {
    scroll-behavior: smooth;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .mobile-reel::-webkit-scrollbar {
    display: none;
  }

  /* Portfolio card responsive sizing */
  .portfolio-card {
    /* Mobile: 90% width, full height */
    width: 90vw;
    height: 70vh;
    min-height: 500px;
    scroll-snap-align: center;
  }

  /* Tablet styles */
  @media (min-width: 640px) {
    .portfolio-card {
      width: 60vw;
      max-width: 400px;
      height: 550px;
    }
  }

  /* Desktop styles */
  @media (min-width: 1024px) {
    .portfolio-card {
      width: 280px;
      height: 500px;
    }
    
    .desktop-ticker {
      animation: none; /* Will be added back via animate-scroll class */
    }
  }

  /* Hide desktop duplicates on mobile */
  @media (max-width: 639px) {
    .desktop-only {
      display: none;
    }
    
    .mobile-reel {
      overflow-x: auto;
      overflow-y: hidden;
    }
    
    .desktop-ticker {
      width: auto;
    }
  }

  /* Enhanced mobile touch experience */
  @media (max-width: 639px) {
    .portfolio-card {
      touch-action: pan-x;
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      user-select: none;
    }
  }

  /* Smooth transitions for all interactive elements */
  .portfolio-card img {
    transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .portfolio-card:hover img {
    transform: scale(1.05);
  }

  /* Mobile progress indicators */
  @media (max-width: 639px) {
    .portfolio-card:hover img {
      transform: scale(1.02); /* Subtle scale on mobile */
    }
  }
  </style>