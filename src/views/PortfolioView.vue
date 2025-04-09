<template>
    <div>
      <!-- Page Header -->
      <section class="relative py-20 bg-[#F6F2ED]">
        <div class="container-custom text-center">
          <h1 class="font-montserrat font-extralight text-4xl md:text-5xl text-[#33423C] mb-4">Capturing Stories, One Frame at a Time</h1>
          <p class="text-lg text-[#6A7D72] max-w-3xl mx-auto">
            Each story I capture is unique. Take a moment to explore the projects I've been honored to be
            a part of, from family sessions to NGO partnerships. The images here showcase my commitment
            to telling authentic stories and finding beauty in the most humble places.
          </p>
        </div>
      </section>
      
      <!-- Portfolio Filters -->
      <section class="pt-12 pb-4 bg-white sticky top-0 z-10 shadow-sm">
        <div class="container-custom">
          <div class="flex flex-wrap justify-center gap-4">
            <button 
              v-for="category in categories" 
              :key="category.id"
              @click="activeCategory = category.id"
              class="px-5 py-2 transition-all duration-300 transform hover:scale-105"
              :class="activeCategory === category.id ? 
                'bg-[#33423C] text-[#F6F2ED]' : 
                'bg-[#F6F2ED] text-[#33423C] hover:bg-[#DCCDC3]/20'"
            >
              {{ category.name }}
            </button>
          </div>
        </div>
      </section>
      
      <!-- Portfolio Gallery -->
      <section class="py-12 bg-white">
        <div class="container-custom">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div 
              v-for="(item, index) in filteredPortfolio" 
              :key="index"
              class="group relative overflow-hidden rounded-lg bg-[#F6F2ED] transform transition-all duration-500 hover:scale-[1.02] hover:shadow-xl"
              @click="openLightbox(index)"
            >
              <!-- Image Container -->
              <div class="relative aspect-[4/3] overflow-hidden">
                <img 
                  :src="item.thumbnailUrl" 
                  :alt="item.title" 
                  class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                <!-- Overlay Gradient -->
                <div class="absolute inset-0 bg-gradient-to-t from-[#33423C]/90 via-[#33423C]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <!-- Content Overlay -->
                <div class="absolute inset-0 flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                  <span class="text-[#DCCDC3] text-sm uppercase tracking-wider mb-2">{{ item.category }}</span>
                  <h3 class="text-white text-xl font-light mb-2">{{ item.title }}</h3>
                  <p class="text-gray-200 text-sm line-clamp-2">{{ item.description }}</p>
                </div>
                
                <!-- Quick View Button -->
                <div class="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button class="bg-white/10 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm hover:bg-white/20 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
              
              <!-- Static Content -->
              <div class="p-4">
                <span class="text-[#6A7D72] text-sm uppercase tracking-wider">{{ item.category }}</span>
                <h3 class="text-[#33423C] text-lg font-light mt-1">{{ item.title }}</h3>
              </div>
            </div>
          </div>
          
          <!-- Show More Button -->
          <div class="text-center mt-12" v-if="hasMoreItems">
            <button 
              @click="loadMore" 
              class="btn-secondary transform transition-transform duration-300 hover:scale-105"
            >
              Load More Projects
            </button>
          </div>
        </div>
      </section>
      
      <!-- Lightbox -->
      <div v-if="lightboxOpen" class="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
        <div class="relative w-full max-w-6xl px-4">
          <!-- Close Button -->
          <button 
            @click="closeLightbox" 
            class="absolute top-4 right-4 text-white hover:text-[#DCCDC3] transition-colors z-10 transform hover:scale-110"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <!-- Navigation Buttons -->
          <button 
            @click="prevImage" 
            class="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-[#DCCDC3] transition-colors z-10 transform hover:scale-110"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button 
            @click="nextImage" 
            class="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-[#DCCDC3] transition-colors z-10 transform hover:scale-110"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          <!-- Image Container -->
          <div class="relative">
            <img 
              v-if="currentLightboxItem"
              :src="currentLightboxItem.fullUrl" 
              :alt="currentLightboxItem.title"
              class="max-h-[80vh] mx-auto rounded-lg shadow-2xl"
            />
            
            <!-- Image Caption -->
            <div class="text-center text-white mt-6">
              <h3 class="text-2xl font-light mb-2">{{ currentLightboxItem?.title }}</h3>
              <p class="text-gray-300 max-w-2xl mx-auto">{{ currentLightboxItem?.description }}</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- CTA Section -->
      <section class="py-16 md:py-20 bg-[#F6F2ED] text-[#33423C]">
        <div class="container-custom text-center">
          <h2 class="text-3xl md:text-4xl font-light mb-6">Ready to Tell Your Story?</h2>
          <p class="text-lg md:text-xl max-w-2xl mx-auto mb-10 text-[#6A7D72]">
            Let's work together to capture your authentic moments and create beautiful memories that last a lifetime.
          </p>
          <router-link 
            to="/contact" 
            class="btn-primary transform transition-transform duration-300 hover:scale-105"
          >
            Book Your Story
          </router-link>
        </div>
      </section>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import { portfolioService } from '@/services/supabase'
  
  // Portfolio state
  const portfolio = ref<any[]>([])
  const loadedItems = ref(9)
  const loading = ref(false)
  const activeCategory = ref('all')
  
  // Categories
  const categories = [
    { id: 'all', name: 'All Projects' },
    { id: 'family', name: 'Family Portraits' },
    { id: 'events', name: 'Event Coverage' },
    { id: 'ngo', name: 'NGO Storytelling' },
    { id: 'maternity', name: 'Maternity' },
    { id: 'newborn', name: 'Newborn' }
  ]
  
  // Lightbox state
  const lightboxOpen = ref(false)
  const currentLightboxIndex = ref(0)
  
  // Computed properties
  const filteredPortfolio = computed(() => {
    if (activeCategory.value === 'all') {
      return portfolio.value.slice(0, loadedItems.value)
    }
    return portfolio.value
      .filter(item => item.category === activeCategory.value)
      .slice(0, loadedItems.value)
  })
  
  const hasMoreItems = computed(() => {
    if (activeCategory.value === 'all') {
      return loadedItems.value < portfolio.value.length
    }
    return loadedItems.value < portfolio.value.filter(item => item.category === activeCategory.value).length
  })
  
  const currentLightboxItem = computed(() => {
    return portfolio.value[currentLightboxIndex.value]
  })
  
  // Methods
  const openLightbox = (index: number) => {
    currentLightboxIndex.value = index
    lightboxOpen.value = true
    document.body.style.overflow = 'hidden'
  }
  
  const closeLightbox = () => {
    lightboxOpen.value = false
    document.body.style.overflow = 'auto'
  }
  
  const prevImage = () => {
    currentLightboxIndex.value = (currentLightboxIndex.value - 1 + portfolio.value.length) % portfolio.value.length
  }
  
  const nextImage = () => {
    currentLightboxIndex.value = (currentLightboxIndex.value + 1) % portfolio.value.length
  }
  
  const loadMore = () => {
    loadedItems.value += 9
  }
  
  // Mock portfolio data (replace with API call to Supabase later)
  onMounted(async () => {
    loading.value = true
    
    // Try to fetch from Supabase first
    try {
      const items = await portfolioService.getPortfolioItems()
      if (items && items.length > 0) {
        portfolio.value = items
      } else {
        // Fallback to mock data
        setMockPortfolioData()
      }
    } catch (error) {
      console.error('Error fetching portfolio data:', error)
      // Fallback to mock data
      setMockPortfolioData()
    }
    
    loading.value = false
  })
  
  // Mock data function
  const setMockPortfolioData = () => {
    portfolio.value = [
      {
        id: 1,
        title: 'The Anderson Family',
        category: 'family',
        description: 'A beautiful autumn family session at Golden Hour.',
        thumbnailUrl: '/images/portfolio/family-1-thumb.jpg',
        fullUrl: '/images/portfolio/family-1-full.jpg',
      },
      {
        id: 2,
        title: 'Clean Water Initiative',
        category: 'ngo',
        description: 'Documenting the impact of clean water access in rural communities.',
        thumbnailUrl: '/images/portfolio/ngo-1-thumb.jpg',
        fullUrl: '/images/portfolio/ngo-1-full.jpg',
      },
      {
        id: 3,
        title: 'Sarah\'s Baby Shower',
        category: 'events',
        description: 'Capturing the joy and anticipation of a spring-themed baby shower.',
        thumbnailUrl: '/images/portfolio/event-1-thumb.jpg',
        fullUrl: '/images/portfolio/event-1-full.jpg',
      },
      {
        id: 4,
        title: 'Emma & John',
        category: 'maternity',
        description: 'A serene maternity session in a flowering meadow.',
        thumbnailUrl: '/images/portfolio/maternity-1-thumb.jpg',
        fullUrl: '/images/portfolio/maternity-1-full.jpg',
      },
      {
        id: 5,
        title: 'Little Noah',
        category: 'newborn',
        description: 'Welcoming a precious new life with a gentle newborn session.',
        thumbnailUrl: '/images/portfolio/newborn-1-thumb.jpg',
        fullUrl: '/images/portfolio/newborn-1-full.jpg',
      },
      {
        id: 6,
        title: 'Smith Family Reunion',
        category: 'family',
        description: 'Documenting three generations coming together to celebrate family bonds.',
        thumbnailUrl: '/images/portfolio/family-2-thumb.jpg',
        fullUrl: '/images/portfolio/family-2-full.jpg',
      },
      {
        id: 7,
        title: 'Women\'s Literacy Program',
        category: 'ngo',
        description: 'Highlighting the power of education in transforming rural communities.',
        thumbnailUrl: '/images/portfolio/ngo-2-thumb.jpg',
        fullUrl: '/images/portfolio/ngo-2-full.jpg',
      },
      {
        id: 8,
        title: 'Community Garden Opening',
        category: 'events',
        description: 'Celebrating the launch of a neighborhood sustainability initiative.',
        thumbnailUrl: '/images/portfolio/event-2-thumb.jpg',
        fullUrl: '/images/portfolio/event-2-full.jpg',
      },
      {
        id: 9,
        title: 'Lisa & Mark',
        category: 'maternity',
        description: 'An intimate maternity session at home, focusing on connection and love.',
        thumbnailUrl: '/images/portfolio/maternity-2-thumb.jpg',
        fullUrl: '/images/portfolio/maternity-2-full.jpg',
      },
      {
        id: 10,
        title: 'Baby Sophia',
        category: 'newborn',
        description: 'A delicate floral-themed newborn session for a spring baby.',
        thumbnailUrl: '/images/portfolio/newborn-2-thumb.jpg',
        fullUrl: '/images/portfolio/newborn-2-full.jpg',
      }
    ]
  }
  </script>