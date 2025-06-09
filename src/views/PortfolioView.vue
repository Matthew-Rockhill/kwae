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
      
      <!-- Add subcategory selector for lifestyle -->
      <div v-if="activeCategory === 'lifestyle'" class="flex justify-center items-center space-x-4 mb-4 mt-4 min-h-[60px]">
        <button
          v-for="subcategory in (['rockpooling', 'events', 'traditional-wedding'] as LifestyleSubcategory[])"
          :key="subcategory"
          @click="activeSubcategory = subcategory"
          :class="[
            'px-4 py-2 rounded-full transition-all duration-300 capitalize',
            activeSubcategory === subcategory
              ? 'bg-[#6A7D72] text-white'
              : 'bg-white/10 text-[#6A7D72] hover:bg-white/20'
          ]"
        >
          {{ subcategory.replace('-', ' ') }}
        </button>
      </div>
      
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
                <!-- Overlay Gradient and Content for non-branding and non-family only -->
                <template v-if="activeCategory !== 'branding' && activeCategory !== 'family'">
                  <div class="absolute inset-0 bg-gradient-to-t from-[#33423C]/90 via-[#33423C]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div class="absolute inset-0 flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                    <span class="text-[#DCCDC3] text-sm uppercase tracking-wider mb-2">{{ item.category }}</span>
                    <h3 class="text-white text-xl font-light mb-2">{{ item.title }}</h3>
                    <p class="text-gray-200 text-sm line-clamp-2">{{ item.description }}</p>
                  </div>
                  <div class="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button class="bg-white/10 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm hover:bg-white/20 transition-colors">
                      View Details
                    </button>
                </div>
                </template>
              </div>
              <!-- Static Content for non-branding and non-family only -->
              <template v-if="activeCategory !== 'branding' && activeCategory !== 'family'">
                <div class="p-4">
                  <span class="text-[#6A7D72] text-sm uppercase tracking-wider">{{ item.category }}</span>
                  <h3 class="text-[#33423C] text-lg font-light mt-1">{{ item.title }}</h3>
                </div>
              </template>
            </div>
          </div>
          
          <!-- Show More Button -->
          <div class="text-center mt-12" v-if="hasMoreItems">
            <button 
              @click="loadMore" 
              class="btn-secondary transform transition-transform duration-300 hover:scale-105"
            >
              Load More
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
              <template v-if="activeCategory !== 'branding' && activeCategory !== 'family'">
                <h3 class="text-2xl font-light mb-2">{{ currentLightboxItem?.title }}</h3>
                <p class="text-gray-300 max-w-2xl mx-auto">{{ currentLightboxItem?.description }}</p>
              </template>
              <template v-else>
                <!-- No description for branding and family -->
              </template>
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
  import { useRoute } from 'vue-router'
  
  const route = useRoute()
  const activeCategory = ref(route.params.category || 'branding')
  const activeSubcategory = ref<LifestyleSubcategory>('rockpooling') // Default subcategory for lifestyle
  const showLightbox = ref(false)
  const currentImageIndex = ref(0)
  const visibleCount = ref(12) // Number of images to show initially
  const totalItems = ref(0) // Total number of items available
  
  // Portfolio state
  const portfolio = ref<any[]>([])
  const loadedItems = ref(9)
  const loading = ref(false)
  
  // Categories
  const categories = [
    { id: 'family', name: 'Family' },
    { id: 'ngo', name: 'NGO Storytelling' },
    { id: 'lifestyle', name: 'Lifestyle' },
    { id: 'branding', name: 'Branding' }
  ]
  
  // Lightbox state
  const lightboxOpen = ref(false)
  const currentLightboxIndex = ref(0)
  
  // Branding images data
  const brandingImages = [
      {
        id: 1,
      title: 'Ray Branding Shoot',
      category: 'branding',
      description: 'Professional branding photography session capturing the essence of Ray\'s personal brand.',
      thumbnailUrl: new URL('@/assets/images/branding/ray-branding-shoot-1.jpg', import.meta.url).href,
      fullUrl: new URL('@/assets/images/branding/ray-branding-shoot-1.jpg', import.meta.url).href
      },
      {
        id: 2,
      title: 'Ray Branding Shoot',
      category: 'branding',
      description: 'Professional branding photography session capturing the essence of Ray\'s personal brand.',
      thumbnailUrl: new URL('@/assets/images/branding/ray-branding-shoot-25.jpg', import.meta.url).href,
      fullUrl: new URL('@/assets/images/branding/ray-branding-shoot-25.jpg', import.meta.url).href
      },
      {
        id: 3,
      title: 'Ray Branding Shoot',
      category: 'branding',
      description: 'Professional branding photography session capturing the essence of Ray\'s personal brand.',
      thumbnailUrl: new URL('@/assets/images/branding/ray-branding-shoot-39.jpg', import.meta.url).href,
      fullUrl: new URL('@/assets/images/branding/ray-branding-shoot-39.jpg', import.meta.url).href
      },
      {
        id: 4,
      title: 'Ray Branding Shoot',
      category: 'branding',
      description: 'Professional branding photography session capturing the essence of Ray\'s personal brand.',
      thumbnailUrl: new URL('@/assets/images/branding/ray-branding-shoot-40.jpg', import.meta.url).href,
      fullUrl: new URL('@/assets/images/branding/ray-branding-shoot-40.jpg', import.meta.url).href
      },
      {
        id: 5,
      title: 'Ray Branding Shoot',
      category: 'branding',
      description: 'Professional branding photography session capturing the essence of Ray\'s personal brand.',
      thumbnailUrl: new URL('@/assets/images/branding/ray-branding-shoot-51.jpg', import.meta.url).href,
      fullUrl: new URL('@/assets/images/branding/ray-branding-shoot-51.jpg', import.meta.url).href
      },
      {
        id: 6,
      title: 'Ray Branding Shoot',
      category: 'branding',
      description: 'Professional branding photography session capturing the essence of Ray\'s personal brand.',
      thumbnailUrl: new URL('@/assets/images/branding/ray-branding-shoot-54.jpg', import.meta.url).href,
      fullUrl: new URL('@/assets/images/branding/ray-branding-shoot-54.jpg', import.meta.url).href
      },
      {
        id: 7,
      title: 'Ray Branding Shoot',
      category: 'branding',
      description: 'Professional branding photography session capturing the essence of Ray\'s personal brand.',
      thumbnailUrl: new URL('@/assets/images/branding/ray-branding-shoot-59.jpg', import.meta.url).href,
      fullUrl: new URL('@/assets/images/branding/ray-branding-shoot-59.jpg', import.meta.url).href
      },
      {
        id: 8,
      title: 'Ray Branding Shoot',
      category: 'branding',
      description: 'Professional branding photography session capturing the essence of Ray\'s personal brand.',
      thumbnailUrl: new URL('@/assets/images/branding/ray-branding-shoot-62.jpg', import.meta.url).href,
      fullUrl: new URL('@/assets/images/branding/ray-branding-shoot-62.jpg', import.meta.url).href
      },
      {
        id: 9,
      title: 'Malan Family Shoot',
      category: 'branding',
      description: 'Family branding session capturing the Malan family\'s unique story and personality.',
      thumbnailUrl: new URL('@/assets/images/branding/malan-family-shoot-96.jpg', import.meta.url).href,
      fullUrl: new URL('@/assets/images/branding/malan-family-shoot-96.jpg', import.meta.url).href
      },
      {
        id: 10,
      title: 'Malan Family Shoot',
      category: 'branding',
      description: 'Family branding session capturing the Malan family\'s unique story and personality.',
      thumbnailUrl: new URL('@/assets/images/branding/malan-family-shoot-97.jpg', import.meta.url).href,
      fullUrl: new URL('@/assets/images/branding/malan-family-shoot-97.jpg', import.meta.url).href
      },
      {
        id: 11,
      title: 'Branding Home Cover',
      category: 'branding',
      description: 'Branding home cover image.',
      thumbnailUrl: new URL('@/assets/images/branding/branding-home-cover.jpg', import.meta.url).href,
      fullUrl: new URL('@/assets/images/branding/branding-home-cover.jpg', import.meta.url).href
    }
  ]
  
  // Family images data
  const familyImages = ref([
    { src: new URL('@/assets/images/family/malan-family-shoot-91.jpg', import.meta.url).href },
    { src: new URL('@/assets/images/family/dsc-0077.jpg', import.meta.url).href },
    { src: new URL('@/assets/images/family/dsc-0066.jpg', import.meta.url).href },
    { src: new URL('@/assets/images/family/malan-family-shoot-83.jpg', import.meta.url).href },
    { src: new URL('@/assets/images/family/malan-family-shoot-120.jpg', import.meta.url).href },
    { src: new URL('@/assets/images/family/dsc-0100.jpg', import.meta.url).href },
    { src: new URL('@/assets/images/family/malan-family-shoot--107.jpg', import.meta.url).href },
    { src: new URL('@/assets/images/family/dsc-0056.jpg', import.meta.url).href },
    { src: new URL('@/assets/images/family/malan-family-shoot-55.jpg', import.meta.url).href },
    { src: new URL('@/assets/images/family/dsc-0178.jpg', import.meta.url).href },
    { src: new URL('@/assets/images/family/dsc-0122.jpg', import.meta.url).href },
    { src: new URL('@/assets/images/family/dsc-0247.jpg', import.meta.url).href },
    { src: new URL('@/assets/images/family/dsc-0059.jpg', import.meta.url).href },
    { src: new URL('@/assets/images/family/dsc-0099.jpg', import.meta.url).href },
    { src: new URL('@/assets/images/family/malan-family-shoot-71.jpg', import.meta.url).href },
    { src: new URL('@/assets/images/family/dsc-0087.jpg', import.meta.url).href },
    { src: new URL('@/assets/images/family/malan-family-shoot-62.jpg', import.meta.url).href },
    { src: new URL('@/assets/images/family/dsc-0175.jpg', import.meta.url).href },
    { src: new URL('@/assets/images/family/dsc-0109.jpg', import.meta.url).href },
    { src: new URL('@/assets/images/family/dsc-0128.jpg', import.meta.url).href },
    { src: new URL('@/assets/images/family/dsc-0198.jpg', import.meta.url).href },
    { src: new URL('@/assets/images/family/dsc-0222.jpg', import.meta.url).href },
    { src: new URL('@/assets/images/family/dsc-0149.jpg', import.meta.url).href },
    { src: new URL('@/assets/images/family/dsc-0207.jpg', import.meta.url).href },
    { src: new URL('@/assets/images/family/dsc-0148.jpg', import.meta.url).href },
    { src: new URL('@/assets/images/family/dsc-0038.jpg', import.meta.url).href },
    { src: new URL('@/assets/images/family/dsc-0210.jpg', import.meta.url).href },
    { src: new URL('@/assets/images/family/malan-family-shoot-67.jpg', import.meta.url).href },
    { src: new URL('@/assets/images/family/dsc-0117.jpg', import.meta.url).href },
    { src: new URL('@/assets/images/family/dsc-0006.jpg', import.meta.url).href },
    { src: new URL('@/assets/images/family/malan-family-shoot-122.jpg', import.meta.url).href },
    { src: new URL('@/assets/images/family/malan-family-shoot-112.jpg', import.meta.url).href },
    { src: new URL('@/assets/images/family/malan-family-shoot-92.jpg', import.meta.url).href },
    { src: new URL('@/assets/images/family/dsc-0212.jpg', import.meta.url).href },
    { src: new URL('@/assets/images/family/dsc-0208.jpg', import.meta.url).href },
    { src: new URL('@/assets/images/family/dsc-0170.jpg', import.meta.url).href },
    { src: new URL('@/assets/images/family/dsc-0167.jpg', import.meta.url).href },
    { src: new URL('@/assets/images/family/dsc-0137.jpg', import.meta.url).href },
    { src: new URL('@/assets/images/family/dsc-0011.jpg', import.meta.url).href },
  ])
  
  // NGO images data
  const ngoImages = ref([
    { src: new URL('@/assets/images/NGO-storytelling/Sozo Foundation Case Study Images106.jpg', import.meta.url).href },
    { src: new URL('@/assets/images/NGO-storytelling/Sozo Foundation Case Study Images63.jpg', import.meta.url).href },
    { src: new URL('@/assets/images/NGO-storytelling/Sozo Foundation Case Study Images40.jpg', import.meta.url).href },
    { src: new URL('@/assets/images/NGO-storytelling/Sozo Foundation Case Study Images23.jpg', import.meta.url).href },
    { src: new URL('@/assets/images/NGO-storytelling/Sozo Foundation Case Study Images54.jpg', import.meta.url).href },
    { src: new URL('@/assets/images/NGO-storytelling/Sozo Foundation Case Study Images77.jpg', import.meta.url).href },
    { src: new URL('@/assets/images/NGO-storytelling/Sozo Foundation Case Study Images90.jpg', import.meta.url).href },
    { src: new URL('@/assets/images/NGO-storytelling/Sozo Foundation Case Study Images103.jpg', import.meta.url).href },
    { src: new URL('@/assets/images/NGO-storytelling/Sozo Foundation Case Study Images24.jpg', import.meta.url).href },
    { src: new URL('@/assets/images/NGO-storytelling/Sozo Foundation Case Study Images60.jpg', import.meta.url).href },
    { src: new URL('@/assets/images/NGO-storytelling/Sozo Foundation Case Study Images84.jpg', import.meta.url).href },
    { src: new URL('@/assets/images/NGO-storytelling/Sozo Foundation Case Study Images20.jpg', import.meta.url).href },
    { src: new URL('@/assets/images/NGO-storytelling/Sozo Foundation Case Study Images89.jpg', import.meta.url).href },
    { src: new URL('@/assets/images/NGO-storytelling/Sozo Foundation Case Study Images3.jpg', import.meta.url).href },
    { src: new URL('@/assets/images/NGO-storytelling/Sozo Foundation Case Study Images43.jpg', import.meta.url).href },
    { src: new URL('@/assets/images/NGO-storytelling/Sozo Foundation Case Study Images97.jpg', import.meta.url).href },
    { src: new URL('@/assets/images/NGO-storytelling/Sozo Foundation Case Study Images56.jpg', import.meta.url).href },
    { src: new URL('@/assets/images/NGO-storytelling/Sozo Foundation Case Study Images55.jpg', import.meta.url).href },
    { src: new URL('@/assets/images/NGO-storytelling/Sozo Foundation Case Study Images30.jpg', import.meta.url).href },
    { src: new URL('@/assets/images/NGO-storytelling/Sozo Foundation Case Study Images26.jpg', import.meta.url).href },
    { src: new URL('@/assets/images/NGO-storytelling/Sozo Foundation Case Study Images73.jpg', import.meta.url).href },
    { src: new URL('@/assets/images/NGO-storytelling/Sozo Foundation Case Study Images65.jpg', import.meta.url).href },
    { src: new URL('@/assets/images/NGO-storytelling/Sozo Foundation Case Study Images48.jpg', import.meta.url).href },
    { src: new URL('@/assets/images/NGO-storytelling/Sozo Foundation Case Study Images88.jpg', import.meta.url).href },
    { src: new URL('@/assets/images/NGO-storytelling/Sozo Foundation Case Study Images35.jpg', import.meta.url).href }
  ])
  
  // Add type definitions
  type LifestyleSubcategory = 'rockpooling' | 'events' | 'traditional-wedding'
  type LifestyleImages = {
    [key in LifestyleSubcategory]: { src: string }[]
  }
  
  // Update lifestyle images data with proper typing
  const lifestyleImages = ref<LifestyleImages>({
    rockpooling: [
      { src: new URL('@/assets/images/lifestyle/rockpooling/Copy of DSC_0051.jpg', import.meta.url).href },
      { src: new URL('@/assets/images/lifestyle/rockpooling/Copy of DSC_0027.jpg', import.meta.url).href },
      { src: new URL('@/assets/images/lifestyle/rockpooling/Copy of DSC_0066.jpg', import.meta.url).href },
      { src: new URL('@/assets/images/lifestyle/rockpooling/Copy of DSC_0045.jpg', import.meta.url).href },
      { src: new URL('@/assets/images/lifestyle/rockpooling/Copy of DSC_0096.jpg', import.meta.url).href },
      { src: new URL('@/assets/images/lifestyle/rockpooling/Copy of DSC_0042.jpg', import.meta.url).href },
      { src: new URL('@/assets/images/lifestyle/rockpooling/Copy of DSC_0018.jpg', import.meta.url).href },
      { src: new URL('@/assets/images/lifestyle/rockpooling/Copy of DSC_0081.jpg', import.meta.url).href },
      { src: new URL('@/assets/images/lifestyle/rockpooling/Copy of DSC_0039.jpg', import.meta.url).href },
      { src: new URL('@/assets/images/lifestyle/rockpooling/Copy of DSC_0078.jpg', import.meta.url).href },
      { src: new URL('@/assets/images/lifestyle/rockpooling/Copy of DSC_0046.jpg', import.meta.url).href },
      { src: new URL('@/assets/images/lifestyle/rockpooling/Copy of DSC_0010.jpg', import.meta.url).href },
      { src: new URL('@/assets/images/lifestyle/rockpooling/Copy of DSC_0091.jpg', import.meta.url).href },
      { src: new URL('@/assets/images/lifestyle/rockpooling/Copy of DSC_0004.jpg', import.meta.url).href },
      { src: new URL('@/assets/images/lifestyle/rockpooling/Copy of DSC_0064.jpg', import.meta.url).href },
      { src: new URL('@/assets/images/lifestyle/rockpooling/Copy of DSC_0080.jpg', import.meta.url).href },
      { src: new URL('@/assets/images/lifestyle/rockpooling/Copy of DSC_0088.jpg', import.meta.url).href }
    ],
    events: [
      { src: new URL('@/assets/images/lifestyle/events/Bay Nourish Ladies Tea63.jpg', import.meta.url).href },
      { src: new URL('@/assets/images/lifestyle/events/Bay Nourish Ladies Tea57.jpg', import.meta.url).href },
      { src: new URL('@/assets/images/lifestyle/events/Bay Nourish Ladies Tea51.jpg', import.meta.url).href },
      { src: new URL('@/assets/images/lifestyle/events/Bay Nourish Ladies Tea38.jpg', import.meta.url).href },
      { src: new URL('@/assets/images/lifestyle/events/Bay Nourish Ladies Tea26.jpg', import.meta.url).href },
      { src: new URL('@/assets/images/lifestyle/events/Bay Nourish Ladies Tea20.jpg', import.meta.url).href },
      { src: new URL('@/assets/images/lifestyle/events/Bay Nourish Ladies Tea7.jpg', import.meta.url).href },
      { src: new URL('@/assets/images/lifestyle/events/Bay Nourish Ladies Tea6.jpg', import.meta.url).href },
      { src: new URL('@/assets/images/lifestyle/events/Bay Nourish Ladies Tea2.jpg', import.meta.url).href },
      { src: new URL('@/assets/images/lifestyle/events/Bay Nourish Ladies Tea36.jpg', import.meta.url).href }
    ],
    'traditional-wedding': [
      { src: new URL('@/assets/images/lifestyle/traditional-wedding/Copy of DSC_0465.jpg', import.meta.url).href },
      { src: new URL('@/assets/images/lifestyle/traditional-wedding/Copy of DSC_0412.jpg', import.meta.url).href },
      { src: new URL('@/assets/images/lifestyle/traditional-wedding/Copy of DSC_0410.jpg', import.meta.url).href },
      { src: new URL('@/assets/images/lifestyle/traditional-wedding/Copy of DSC_0394.jpg', import.meta.url).href },
      { src: new URL('@/assets/images/lifestyle/traditional-wedding/Copy of DSC_0017.jpg', import.meta.url).href },
      { src: new URL('@/assets/images/lifestyle/traditional-wedding/Copy of DSC_0447.jpg', import.meta.url).href },
      { src: new URL('@/assets/images/lifestyle/traditional-wedding/Copy of DSC_0434.jpg', import.meta.url).href },
      { src: new URL('@/assets/images/lifestyle/traditional-wedding/Copy of DSC_0360.jpg', import.meta.url).href },
      { src: new URL('@/assets/images/lifestyle/traditional-wedding/Copy of DSC_0352.jpg', import.meta.url).href },
      { src: new URL('@/assets/images/lifestyle/traditional-wedding/Copy of DSC_0337.jpg', import.meta.url).href },
      { src: new URL('@/assets/images/lifestyle/traditional-wedding/Copy of DSC_0319.jpg', import.meta.url).href },
      { src: new URL('@/assets/images/lifestyle/traditional-wedding/Copy of DSC_0305.jpg', import.meta.url).href },
      { src: new URL('@/assets/images/lifestyle/traditional-wedding/Copy of DSC_0036.jpg', import.meta.url).href },
      { src: new URL('@/assets/images/lifestyle/traditional-wedding/Copy of DSC_0027.jpg', import.meta.url).href },
      { src: new URL('@/assets/images/lifestyle/traditional-wedding/Copy of DSC_0403.jpg', import.meta.url).href },
      { src: new URL('@/assets/images/lifestyle/traditional-wedding/Copy of DSC_0133.jpg', import.meta.url).href },
      { src: new URL('@/assets/images/lifestyle/traditional-wedding/Copy of DSC_0035.jpg', import.meta.url).href },
      { src: new URL('@/assets/images/lifestyle/traditional-wedding/Copy of DSC_0032.jpg', import.meta.url).href }
    ]
  })
  
  // Computed properties
  const filteredPortfolio = computed(() => {
    if (activeCategory.value === 'branding') {
      return brandingImages.slice(0, visibleCount.value)
    }
    if (activeCategory.value === 'family') {
      return familyImages.value.slice(0, visibleCount.value).map(img => ({
        thumbnailUrl: img.src,
        fullUrl: img.src
      }))
    }
    if (activeCategory.value === 'lifestyle') {
      return lifestyleImages.value[activeSubcategory.value].slice(0, visibleCount.value).map(img => ({
        thumbnailUrl: img.src,
        fullUrl: img.src
      }))
    }
    if (activeCategory.value === 'ngo') {
      return ngoImages.value.slice(0, visibleCount.value).map(img => ({
        thumbnailUrl: img.src,
        fullUrl: img.src
      }))
    }
    return portfolio.value.filter(item => item.category === activeCategory.value)
  })
  
  const hasMoreItems = computed(() => {
    if (activeCategory.value === 'branding') {
      return visibleCount.value < brandingImages.length
    }
    if (activeCategory.value === 'family') {
      return visibleCount.value < familyImages.value.length
    }
    if (activeCategory.value === 'lifestyle') {
      return visibleCount.value < lifestyleImages.value[activeSubcategory.value].length
    }
    if (activeCategory.value === 'ngo') {
      return visibleCount.value < ngoImages.value.length
    }
    return portfolio.value.filter(item => item.category === activeCategory.value).length < totalItems.value
  })
  
  const currentLightboxItem = computed(() => {
      return filteredPortfolio.value[currentLightboxIndex.value]
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
    let totalImages: number
    if (activeCategory.value === 'branding') {
      totalImages = brandingImages.length
    } else if (activeCategory.value === 'family') {
      totalImages = familyImages.value.length
    } else if (activeCategory.value === 'lifestyle') {
      totalImages = lifestyleImages.value[activeSubcategory.value].length
    } else if (activeCategory.value === 'ngo') {
      totalImages = ngoImages.value.length
    } else {
      totalImages = portfolio.value.filter(item => item.category === activeCategory.value).length
    }
    currentLightboxIndex.value = (currentLightboxIndex.value - 1 + totalImages) % totalImages
  }
  
  const nextImage = () => {
    let totalImages: number
    if (activeCategory.value === 'branding') {
      totalImages = brandingImages.length
    } else if (activeCategory.value === 'family') {
      totalImages = familyImages.value.length
    } else if (activeCategory.value === 'lifestyle') {
      totalImages = lifestyleImages.value[activeSubcategory.value].length
    } else if (activeCategory.value === 'ngo') {
      totalImages = ngoImages.value.length
    } else {
      totalImages = portfolio.value.filter(item => item.category === activeCategory.value).length
    }
    currentLightboxIndex.value = (currentLightboxIndex.value + 1) % totalImages
  }
  
  const loadMore = () => {
    if (activeCategory.value === 'family' || activeCategory.value === 'lifestyle' || activeCategory.value === 'ngo') {
      visibleCount.value += 12
    } else {
      // Existing branding load more logic
      const currentCount = portfolio.value.filter(item => item.category === activeCategory.value).length
      const newCount = currentCount + 12
      loadPortfolioItems(activeCategory.value, newCount)
    }
  }
  
  const loadPortfolioItems = async (category: string | string[], count: number) => {
    try {
      loading.value = true
      // For now, we'll just update the total count
      // In a real implementation, this would fetch from an API
      totalItems.value = count
    } catch (error) {
      console.error('Error loading portfolio items:', error)
    } finally {
      loading.value = false
    }
  }
  
  onMounted(async () => {
    try {
      const category = route.query.category as string || route.params.category as string
      if (category && portfolios[category]) {
        portfolioData.value = portfolios[category]
      } else {
        // Default to showing all categories or first category
        portfolioData.value = {
          title: 'Portfolio',
          description: 'Browse through my photography work.',
          images: Object.values(portfolios).flatMap(portfolio => portfolio.images)
        }
      }
    } catch (err) {
      error.value = 'Failed to load portfolio data'
    } finally {
      loading.value = false
    }
  })
  </script>