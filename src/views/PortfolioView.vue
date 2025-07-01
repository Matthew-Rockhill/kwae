<template>
    <div>
      <!-- Page Header -->
      <BaseSection background="light" padding="xl">
        <div class="text-center">
          <BaseHeading :level="1" align="center" class="mb-4">
            Capturing Stories, <span class="font-cormorant italic font-normal text-[var(--color-text)]">One Frame at a Time</span>
          </BaseHeading>
          <BaseText size="lg" color="primary" :opacity="70" class="max-w-3xl mx-auto" align="center">
            Each story I capture is unique. Take a moment to explore the projects I've been honored to be
            a part of, from family sessions to NGO partnerships. The images here showcase my commitment
            to telling authentic stories and finding beauty in the most humble places.
          </BaseText>
        </div>
      </BaseSection>
      
      <!-- Portfolio Filters -->
      <StickyFilterBar>
        <FilterButton
          v-for="category in categories" 
          :key="category.id"
          :active="activeCategory === category.id"
          @click="activeCategory = category.id"
        >
          {{ category.name }}
        </FilterButton>
      </StickyFilterBar>
      
      <!-- Add subcategory selector for lifestyle -->
      <div v-if="activeCategory === 'lifestyle'" class="flex justify-center items-center space-x-4 mb-4 mt-4 min-h-[60px]">
        <FilterButton
          v-for="subcategory in (['rockpooling', 'events', 'traditional-wedding'] as LifestyleSubcategory[])"
          :key="subcategory"
          :active="activeSubcategory === subcategory"
          @click="activeSubcategory = subcategory"
          class="capitalize"
        >
          {{ subcategory.replace('-', ' ') }}
        </FilterButton>
      </div>
      
      <!-- Portfolio Gallery -->
      <BaseSection background="light" padding="lg">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <PortfolioCard
            v-for="(item, index) in filteredPortfolio" 
            :key="index"
            :image="item"
            :category="activeCategory"
            :subcategory="activeSubcategory"
            :show-overlay="activeCategory === 'ngo'"
            :show-static-content="activeCategory === 'ngo'"
            @click="openLightbox(index)"
          />
        </div>
        
        <!-- Show More Button -->
        <div class="text-center mt-12" v-if="hasMoreItems">
          <BaseButton 
            variant="secondary"
            @click="loadMore"
            class="transform transition-transform duration-300 hover:scale-105"
          >
            Load More
          </BaseButton>
        </div>
      </BaseSection>
      
      <!-- Lightbox -->
      <ImageLightbox
        :is-open="lightboxOpen"
        :current-image="currentLightboxImage"
        :current-index="currentLightboxIndex"
        :total-images="totalLightboxImages"
        :show-navigation="true"
        @close="closeLightbox"
        @prev="prevImage"
        @next="nextImage"
      />
      
      <!-- CTA Section -->
      <BaseSection background="alabaster" padding="lg">
        <div class="text-center">
          <BaseHeading :level="2" align="center" class="mb-6">
            Ready to <span class="font-cormorant italic font-normal text-[var(--color-text)]">Tell Your Story?</span>
          </BaseHeading>
          <BaseText size="lg" color="primary" :opacity="70" class="max-w-2xl mx-auto mb-10" align="center">
            Let's work together to capture your authentic moments and create beautiful memories that last a lifetime.
          </BaseText>
          <router-link to="/contact">
            <BaseButton 
              variant="primary"
              class="transform transition-transform duration-300 hover:scale-105"
            >
              Book Your Story
            </BaseButton>
          </router-link>
        </div>
      </BaseSection>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import ImageLightbox from '@/components/ImageLightbox.vue'
  import BaseSection from '@/components/ui/BaseSection.vue'
  import BaseHeading from '@/components/ui/BaseHeading.vue'
  import BaseText from '@/components/ui/BaseText.vue'
  import BaseButton from '@/components/ui/BaseButton.vue'
  import FilterButton from '@/components/ui/FilterButton.vue'
  import PortfolioCard from '@/components/ui/PortfolioCard.vue'
  import StickyFilterBar from '@/components/ui/StickyFilterBar.vue'
  
  const route = useRoute()
  const activeCategory = ref((route.query.category as string) || 'family')
  const activeSubcategory = ref<LifestyleSubcategory>('rockpooling') // Default subcategory for lifestyle
  const visibleCount = ref(12) // Number of images to show initially
  const totalItems = ref(0) // Total number of items available
  
  // Portfolio state
  const portfolio = ref<any[]>([])
  const loading = ref(false)
  const error = ref('')
  
  // Categories
  const categories = [
    { id: 'family', name: 'Family' },
    { id: 'ngo', name: 'NGO Storytelling' },
    { id: 'lifestyle', name: 'Lifestyle' },
    { id: 'branding', name: 'Branding' }
  ]

  // Watch for route changes to update category
  watch(
    () => route.query.category,
    (newCategory) => {
      if (newCategory && typeof newCategory === 'string') {
        activeCategory.value = newCategory
      }
    }
  )
  
  // Lightbox state
  const lightboxOpen = ref(false)
  const currentLightboxIndex = ref(0)
  
  // Data for different categories
  interface PortfolioImage {
    id: number
    url: string
    alt: string
  }

  interface PortfolioCategory {
    title: string
    description: string
    images: PortfolioImage[]
  }

  interface PortfolioData {
    [key: string]: PortfolioCategory
  }

  const portfolios: PortfolioData = {
    'family': {
      title: 'Family Photography',
      description: 'Capturing intimate moments and personal stories.',
      images: [
        { id: 1, url: '/images/portfolio/family/1.jpg', alt: 'Family photo 1' },
        { id: 2, url: '/images/portfolio/family/2.jpg', alt: 'Family photo 2' }
      ]
    },
    'lifestyle': {
      title: 'Lifestyle Photography',
      description: 'Documenting authentic moments and special occasions.',
      images: [
        { id: 1, url: '/images/portfolio/lifestyle/1.jpg', alt: 'Lifestyle photo 1' },
        { id: 2, url: '/images/portfolio/lifestyle/2.jpg', alt: 'Lifestyle photo 2' }
      ]
    },
    'ngo': {
      title: 'NGO Storytelling',
      description: 'Telling stories of impact and mission.',
      images: [
        { id: 1, url: '/images/portfolio/ngo/1.jpg', alt: 'NGO photo 1' },
        { id: 2, url: '/images/portfolio/ngo/2.jpg', alt: 'NGO photo 2' }
      ]
    },
    'branding': {
      title: 'Branding Photography',
      description: 'Visual identity and brand storytelling.',
      images: [
        { id: 1, url: '/images/portfolio/branding/1.jpg', alt: 'Branding photo 1' },
        { id: 2, url: '/images/portfolio/branding/2.jpg', alt: 'Branding photo 2' }
      ]
    }
  }

  const portfolioData = ref<PortfolioCategory | null>(null)
  
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

  const currentLightboxImage = computed(() => {
    const item = currentLightboxItem.value
    if (!item) return undefined
    
    return {
      src: item.fullUrl || item.thumbnailUrl,
      alt: item.title || 'Gallery image',
      title: (activeCategory.value !== 'branding' && activeCategory.value !== 'family') ? item.title : undefined,
      description: (activeCategory.value !== 'branding' && activeCategory.value !== 'family') ? item.description : undefined
    }
  })

  const totalLightboxImages = computed(() => {
    if (activeCategory.value === 'branding') {
      return brandingImages.length
    } else if (activeCategory.value === 'family') {
      return familyImages.value.length
    } else if (activeCategory.value === 'lifestyle') {
      return lifestyleImages.value[activeSubcategory.value].length
    } else if (activeCategory.value === 'ngo') {
      return ngoImages.value.length
    } else {
      return portfolio.value.filter(item => item.category === activeCategory.value).length
    }
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
      loadPortfolioItems(newCount)
    }
  }
  
  const loadPortfolioItems = async (count: number) => {
    try {
      loading.value = true
      // For now, we'll just update the total count
      // In a real implementation, this would fetch from an API
      totalItems.value = count
    } catch (err) {
      console.error('Error loading portfolio items:', err)
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