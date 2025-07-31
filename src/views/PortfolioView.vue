<template>
  <div>
    <!-- Page Header -->
    <BaseSection background="light" padding="2xl" spacing="normal">
      <div class="section-header text-center max-w-4xl mx-auto">
        <BaseHeading :level="1" align="center" :animate="true" decoration="underline">
          Capturing Stories, <span class="font-cormorant italic font-normal text-[var(--color-secondary)]">One Frame at a Time</span>
        </BaseHeading>
        <BaseText size="xl" color="primary" :opacity="70" align="center">
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
    
    <!-- Dynamic Subcategory selector -->
    <div v-if="hasSubfolders" class="flex justify-center items-center space-x-4 mb-4 mt-4 min-h-[60px]">
      <FilterButton
        v-for="subfolder in subfolders"
        :key="subfolder.id"
        :active="activeSubcategory === subfolder.id"
        @click="setActiveSubcategory(subfolder.id)"
        class="capitalize"
      >
        {{ subfolder.name }}
      </FilterButton>
    </div>
    
    <!-- Portfolio Gallery -->
    <BaseSection background="light" padding="xl" spacing="normal">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <BaseText size="lg" :opacity="70">Loading {{ currentCategoryName }}...</BaseText>
      </div>
      
      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <div class="max-w-md mx-auto">
          <BaseText size="lg" color="primary" class="text-red-600 mb-4">
            Unable to load portfolio images
          </BaseText>
          <BaseText size="lg" :opacity="70" class="mb-4">
            The portfolio images could not be fetched at this time. Please check your connection and try again.
          </BaseText>
          <BaseText size="sm" :opacity="60" class="mb-6 font-mono bg-gray-100 p-2 rounded text-left">
            Error: {{ error }}
          </BaseText>
          <BaseButton variant="secondary" @click="activeCategory ? fetchCategoryImages(activeCategory) : fetchCategories()">
            Try Again
          </BaseButton>
        </div>
      </div>
      
      <!-- Gallery Grid -->
      <div v-if="!loading && !error && filteredPortfolio.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <PortfolioCard
          v-for="(item, index) in filteredPortfolio" 
          :key="`${activeCategory}-${activeSubcategory}-${index}`"
          :image="item"
          :category="activeCategory"
          :subcategory="activeSubcategory"
          :show-overlay="activeCategory === 'ngo'"
          :show-static-content="activeCategory === 'ngo'"
          @click="openLightbox(index)"
        />
      </div>
      
      <!-- No images message -->
      <div v-if="!loading && !error && filteredPortfolio.length === 0" class="text-center py-12">
        <BaseText size="lg" :opacity="70">No images found for this category.</BaseText>
      </div>
      
      
      <!-- Show More Button -->
      <div class="text-center mt-12" v-if="hasMoreItems">
        <BaseButton 
          variant="secondary"
          @click="loadMore"
          class="transform transition-transform duration-300 hover:scale-105"
        >
          Load More ({{ visibleCount }}/{{ filteredPortfolio.length }})
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
    <BaseSection background="alabaster" padding="xl" spacing="normal">
      <CallToActionSection
        custom-heading='Ready to <span class="font-cormorant italic font-normal text-[var(--color-secondary)]">Tell Your Story?</span>'
        :primary-action="{ text: 'Book Your Story', type: 'button' }"
        @primary-click="openBookingModal"
      />
    </BaseSection>
    
    <!-- Booking Modal -->
    <BookingModal
      :is-open="showBookingModal"
      @close="closeBookingModal"
    />
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
import CallToActionSection from '@/components/ui/CallToActionSection.vue'
import FilterButton from '@/components/ui/FilterButton.vue'
import PortfolioCard from '@/components/ui/PortfolioCard.vue'
import StickyFilterBar from '@/components/ui/StickyFilterBar.vue'
import BookingModal from '@/components/BookingModal.vue'

interface PortfolioImage {
  thumbnailUrl: string;
  fullUrl: string;
  alt: string;
  fileName: string;
  filePath: string;
}

interface PortfolioCategory {
  id: string;
  name: string;
  path: string;
  folderName: string;
  imageCount?: number;
  featuredImage?: string;
}

interface PortfolioSubfolder {
  id: string;
  name: string;
  path: string;
}

const route = useRoute();
const activeCategory = ref((route.query.category as string) || '');
const activeSubcategory = ref('');
const visibleCount = ref(12);
const loading = ref(false);
const error = ref('');

// Dynamic data
const categories = ref<PortfolioCategory[]>([]);
const images = ref<PortfolioImage[]>([]);
const subfolders = ref<PortfolioSubfolder[]>([]);

// Fetch available portfolio categories from database
async function fetchCategories() {
  loading.value = true;
  error.value = '';
  console.log('🔍 Fetching portfolio categories from database...');
  try {
    const res = await fetch('/api/portfolio?action=categories');
    console.log('📡 Categories API response status:', res.status);
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('❌ Categories API error:', errorText);
      throw new Error(`Failed to fetch portfolio categories: ${res.status} ${errorText}`);
    }
    
    const data = await res.json();
    console.log('✅ Categories data received:', data);
    categories.value = data.categories || [];
    
    // Set first category with images as active if none selected
    if (!activeCategory.value && categories.value.length > 0) {
      // Find the first category that has images
      const categoryWithImages = categories.value.find(cat => (cat.imageCount || 0) > 0);
      activeCategory.value = categoryWithImages ? categoryWithImages.id : categories.value[0].id;
      console.log('🎯 Set active category to:', activeCategory.value);
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to load portfolio categories';
    console.error('❌ Portfolio categories error:', err);
  } finally {
    loading.value = false;
  }
}

// Fetch images for a specific category from database
async function fetchCategoryImages(categoryId: string, subcategory?: string) {
  if (!categoryId) return;
  
  loading.value = true;
  error.value = '';
  console.log(`🖼️ Fetching images from database for category: ${categoryId}`, subcategory ? `subcategory: ${subcategory}` : '');
  try {
    let url = `/api/portfolio?category=${categoryId}`;
    if (subcategory) {
      url += `&subcategory=${subcategory}`;
    }
    // Add pagination parameters
    url += `&limit=50&offset=0`;
    console.log('📡 Images API URL:', url);
    
    const res = await fetch(url);
    console.log('📡 Images API response status:', res.status);
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error(`❌ Images API error for ${categoryId}:`, errorText);
      throw new Error(`Failed to fetch ${categoryId} images: ${res.status} ${errorText}`);
    }
    
    const data = await res.json();
    console.log(`✅ Images data received for ${categoryId}:`, data);
    
    images.value = data.images || [];
    subfolders.value = data.subfolders || [];
    
    console.log(`📊 Found ${images.value.length} images and ${subfolders.value.length} subfolders`);
    
    // Reset visible count when switching categories
    visibleCount.value = 12;
  } catch (err: any) {
    error.value = err.message || `Failed to load ${categoryId} images`;
    console.error('❌ Portfolio images error:', err);
    images.value = [];
    subfolders.value = [];
  } finally {
    loading.value = false;
  }
}

// Initialize portfolio
onMounted(async () => {
  console.log('🚀 Portfolio component mounted, initializing...');
  await fetchCategories();
  console.log('📊 After fetching categories, activeCategory is:', activeCategory.value);
  if (activeCategory.value) {
    console.log('🎯 Fetching images for initial category:', activeCategory.value);
    await fetchCategoryImages(activeCategory.value);
  } else {
    console.log('⚠️ No active category set after fetching categories');
  }
});

// Watch for category changes
watch(activeCategory, async (newCategory, oldCategory) => {
  console.log(`🔄 Category changed from "${oldCategory}" to "${newCategory}"`);
  if (newCategory) {
    activeSubcategory.value = ''; // Reset subcategory
    console.log(`🎯 Fetching images for category: ${newCategory}`);
    await fetchCategoryImages(newCategory);
  } else {
    console.log('⚠️ New category is empty/null');
  }
});

// Watch for subcategory changes
watch(activeSubcategory, async (newSubcategory) => {
  if (activeCategory.value) {
    await fetchCategoryImages(activeCategory.value, newSubcategory);
  }
});

// Computed properties
const filteredPortfolio = computed(() => {
  return images.value.slice(0, visibleCount.value);
});

const hasMoreItems = computed(() => {
  return visibleCount.value < images.value.length;
});

const currentCategoryName = computed(() => {
  const category = categories.value.find(cat => cat.id === activeCategory.value);
  return category?.name || '';
});

const hasSubfolders = computed(() => {
  return subfolders.value && subfolders.value.length > 0;
});

// Lightbox functionality
const lightboxOpen = ref(false);
const currentLightboxIndex = ref(0);
const currentLightboxItem = computed(() => filteredPortfolio.value[currentLightboxIndex.value]);
const currentLightboxImage = computed(() => {
  const item = currentLightboxItem.value;
  if (!item) return undefined;
  return {
    src: item.fullUrl || item.thumbnailUrl,
    alt: 'Gallery image',
  };
});
const totalLightboxImages = computed(() => filteredPortfolio.value.length);

const openLightbox = (index: number) => {
  currentLightboxIndex.value = index;
  lightboxOpen.value = true;
  document.body.style.overflow = 'hidden';
};

const closeLightbox = () => {
  lightboxOpen.value = false;
  document.body.style.overflow = 'auto';
};

const prevImage = () => {
  currentLightboxIndex.value = (currentLightboxIndex.value - 1 + filteredPortfolio.value.length) % filteredPortfolio.value.length;
};

const nextImage = () => {
  currentLightboxIndex.value = (currentLightboxIndex.value + 1) % filteredPortfolio.value.length;
};

const loadMore = () => {
  visibleCount.value += 12;
};

// Category/subcategory selection
function setActiveCategory(categoryId: string) {
  activeCategory.value = categoryId;
  activeSubcategory.value = ''; // Reset subcategory when changing main category
}

function setActiveSubcategory(subcategoryId: string) {
  activeSubcategory.value = subcategoryId;
}

// Booking modal state
const showBookingModal = ref(false);
const openBookingModal = () => {
  showBookingModal.value = true;
};
const closeBookingModal = () => {
  showBookingModal.value = false;
};
</script>