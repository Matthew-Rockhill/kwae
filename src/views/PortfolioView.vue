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
        @click="setActiveCategory(category.id)"
      >
        {{ category.name }}
      </FilterButton>
    </StickyFilterBar>
    
    <!-- Subcategory selector for lifestyle -->
    <div v-if="activeCategory === 'lifestyle'" class="flex justify-center items-center space-x-4 mb-4 mt-4 min-h-[60px]">
      <FilterButton
        v-for="subcategory in lifestyleSubcategories"
        :key="subcategory.id"
        :active="activeSubcategory === subcategory.id"
        @click="setActiveSubcategory(subcategory.id)"
        class="capitalize"
      >
        {{ subcategory.name }}
      </FilterButton>
    </div>
    
    <!-- Loading State -->
    <BaseSection v-if="loading" background="light" padding="lg">
      <div class="text-center">
        <BaseText>Loading images...</BaseText>
      </div>
    </BaseSection>
    
    <!-- Error State -->
    <BaseSection v-else-if="error" background="light" padding="lg">
      <div class="text-center">
        <BaseText color="muted">{{ error }}</BaseText>
      </div>
    </BaseSection>
    
    <!-- Portfolio Gallery -->
    <BaseSection v-else background="light" padding="lg">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <PortfolioCard
          v-for="(item, index) in filteredPortfolio" 
          :key="item.id"
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
          Load More ({{ visibleCount }}/{{ totalItems }})
        </BaseButton>
      </div>
      
      <!-- No Images State -->
      <div v-if="!loading && images.length === 0" class="text-center py-12">
        <BaseText size="lg" :opacity="70">No images found for this category.</BaseText>
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
        <BaseButton 
          variant="primary"
          class="transform transition-transform duration-300 hover:scale-105"
          @click="openBookingModal"
        >
          Book Your Story
        </BaseButton>
      </div>
    </BaseSection>
    
    <!-- Booking Modal -->
    <BookingModal
      :is-open="showBookingModal"
      @close="closeBookingModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ImageLightbox from '@/components/ImageLightbox.vue'
import BaseSection from '@/components/ui/BaseSection.vue'
import BaseHeading from '@/components/ui/BaseHeading.vue'
import BaseText from '@/components/ui/BaseText.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import FilterButton from '@/components/ui/FilterButton.vue'
import PortfolioCard from '@/components/ui/PortfolioCard.vue'
import StickyFilterBar from '@/components/ui/StickyFilterBar.vue'
import BookingModal from '@/components/BookingModal.vue'

// Types
type CategoryId = 'family' | 'ngo' | 'lifestyle' | 'branding'
type LifestyleSubcategoryId = 'rockpooling' | 'events' | 'traditional-wedding'

interface PortfolioImage {
  id: string
  thumbnailUrl: string
  fullUrl: string
  alt: string
  title?: string
  description?: string
}

interface Category {
  id: CategoryId
  name: string
}

interface LifestyleSubcategory {
  id: LifestyleSubcategoryId
  name: string
}

// Router
const route = useRoute()
const router = useRouter()

// State
const activeCategory = ref<CategoryId>((route.query.category as CategoryId) || 'family')
const activeSubcategory = ref<LifestyleSubcategoryId>('rockpooling')
const visibleCount = ref(12)
const images = ref<PortfolioImage[]>([])
const loading = ref(false)
const error = ref('')

// Lightbox state
const lightboxOpen = ref(false)
const currentLightboxIndex = ref(0)

// Booking modal state
const showBookingModal = ref(false)

// Categories configuration
const categories: Category[] = [
  { id: 'family', name: 'Family' },
  { id: 'ngo', name: 'NGO Storytelling' },
  { id: 'lifestyle', name: 'Lifestyle' },
  { id: 'branding', name: 'Branding' }
]

const lifestyleSubcategories: LifestyleSubcategory[] = [
  { id: 'rockpooling', name: 'Rockpooling' },
  { id: 'events', name: 'Events' },
  { id: 'traditional-wedding', name: 'Traditional Wedding' }
]

// Cloudinary folder mapping
const cloudinaryFolders = {
  branding: 'branding',
  family: 'family',
  ngo: 'NGO-storytelling',
  lifestyle: {
    rockpooling: 'lifestyle/rockpooling',
    events: 'lifestyle/events',
    'traditional-wedding': 'lifestyle/traditional-wedding'
  }
}

// Computed properties
const filteredPortfolio = computed(() => images.value.slice(0, visibleCount.value))
const hasMoreItems = computed(() => visibleCount.value < images.value.length)
const totalItems = computed(() => images.value.length)

const currentLightboxImage = computed(() => {
  const item = filteredPortfolio.value[currentLightboxIndex.value]
  if (!item) return undefined
  
  return {
    src: item.fullUrl || item.thumbnailUrl,
    alt: item.alt || 'Gallery image',
    title: item.title,
    description: item.description
  }
})

const totalLightboxImages = computed(() => images.value.length)

// Methods
async function fetchImages() {
  loading.value = true
  error.value = ''
  
  try {
    // Determine folder based on category and subcategory
    let folder = ''
    if (activeCategory.value === 'lifestyle') {
      folder = cloudinaryFolders.lifestyle[activeSubcategory.value]
    } else {
      folder = cloudinaryFolders[activeCategory.value]
    }
    
    console.log(`Fetching images from folder: ${folder}`)
    
    // For now, use placeholder images to test the interface
    const placeholderImages = Array.from({ length: 12 }, (_, index) => ({
      id: `${folder}-${index}`,
      thumbnailUrl: `https://picsum.photos/800/600?random=${Date.now()}-${index}`,
      fullUrl: `https://picsum.photos/1200/900?random=${Date.now()}-${index}`,
      alt: `${activeCategory.value} image ${index + 1}`,
      title: `${folder} - Image ${index + 1}`
    }))
    
    images.value = placeholderImages
    visibleCount.value = 12
    
    console.log(`Loaded ${images.value.length} placeholder images`)
    
  } catch (err) {
    console.error('Error generating images:', err)
    error.value = err instanceof Error ? err.message : 'Failed to load images'
    images.value = []
  } finally {
    loading.value = false
  }
}

function setActiveCategory(categoryId: CategoryId) {
  activeCategory.value = categoryId
  
  // Update URL query parameter
  router.push({
    query: { ...route.query, category: categoryId }
  })
  
  // Reset subcategory to default when changing categories
  if (categoryId === 'lifestyle') {
    activeSubcategory.value = 'rockpooling'
  }
}

function setActiveSubcategory(subcategoryId: LifestyleSubcategoryId) {
  activeSubcategory.value = subcategoryId
}

function loadMore() {
  visibleCount.value += 12
}

// Lightbox methods
function openLightbox(index: number) {
  currentLightboxIndex.value = index
  lightboxOpen.value = true
  document.body.style.overflow = 'hidden'
}

function closeLightbox() {
  lightboxOpen.value = false
  document.body.style.overflow = 'auto'
}

function prevImage() {
  if (images.value.length === 0) return
  currentLightboxIndex.value = (currentLightboxIndex.value - 1 + images.value.length) % images.value.length
}

function nextImage() {
  if (images.value.length === 0) return
  currentLightboxIndex.value = (currentLightboxIndex.value + 1) % images.value.length
}

// Booking modal methods
function openBookingModal() {
  showBookingModal.value = true
}

function closeBookingModal() {
  showBookingModal.value = false
}

// Watchers
watch([activeCategory, activeSubcategory], fetchImages, { immediate: false })

watch(
  () => route.query.category,
  (newCategory) => {
    if (newCategory && typeof newCategory === 'string' && categories.some(cat => cat.id === newCategory)) {
      activeCategory.value = newCategory as CategoryId
    }
  }
)

// Lifecycle
onMounted(() => {
  fetchImages()
})
</script>