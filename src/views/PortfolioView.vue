<template>
  <div>
    <!-- Page Header with Integrated Navigation -->
    <BaseSection background="light" padding="lg" spacing="tight">
      <div class="section-header text-center max-w-6xl mx-auto">
        <!-- Main Heading -->
        <BaseHeading :level="1" align="center" :animate="true" decoration="underline" class="mb-6">
          Capturing Stories, <span class="font-cormorant italic font-normal text-[var(--color-secondary)]">One Frame at a Time</span>
        </BaseHeading>
        <BaseText size="xl" color="primary" :opacity="70" align="center" class="mb-12">
          Each story I capture is unique. Take a moment to explore the projects I've been honored to be
          a part of, from family sessions to NGO partnerships.
        </BaseText>
        
        <!-- Integrated Filter Bar -->
        <div class="mb-4">
          <div class="flex flex-wrap justify-center gap-4">
            <FilterButton
              v-for="category in categories" 
              :key="category.id"
              :active="activeCategory === category.id"
              @click="setActiveCategory(category.id)"
              class="group relative transition-all duration-300 hover:scale-105"
            >
              <span class="relative z-10 font-medium">{{ category.name }}</span>
              <span v-if="(category.imageCount || 0) > 0" class="ml-2 px-2.5 py-1 text-xs bg-[var(--color-accent)]/20 text-[var(--color-primary)]/70 rounded-full font-semibold">
                {{ category.imageCount || 0 }}
              </span>
              <div class="absolute inset-0 bg-gradient-to-r from-[var(--color-secondary)]/10 to-[var(--color-accent)]/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </FilterButton>
          </div>
        </div>
        
        <!-- Dynamic Subcategory selector -->
        <div v-if="hasSubfolders" class="flex justify-center items-center gap-3 mt-6">
          <FilterButton
            :active="activeSubcategory === ''"
            @click="setActiveSubcategory('')"
            class="capitalize"
          >
            All
          </FilterButton>
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
        
      </div>
    </BaseSection>
    
    <!-- Portfolio Gallery -->
    <BaseSection background="light" padding="none" spacing="tight" class="pt-0">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12 px-4 sm:px-6 lg:px-8">
        <BaseText size="lg" :opacity="70">Loading {{ currentCategoryName }}...</BaseText>
      </div>
      
      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12 px-4 sm:px-6 lg:px-8">
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
      <div v-if="!loading && !error && filteredPortfolio.length > 0" 
           class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          v-for="(item, index) in filteredPortfolio" 
          :key="`${activeCategory}-${activeSubcategory}-${index}`"
          class="group transform transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1"
          :style="{ animationDelay: `${index * 50}ms` }"
        >
          <PortfolioCard
            :image="item"
            :category="activeCategory"
            :subcategory="activeSubcategory"
            @click="openLightbox(index)"
            class="h-full shadow-lg hover:shadow-2xl transition-shadow duration-500"
          />
        </div>
      </div>
      
      <!-- No images message -->
      <div v-if="!loading && !error && filteredPortfolio.length === 0" class="text-center py-12 px-4 sm:px-6 lg:px-8">
        <BaseText size="lg" :opacity="70">No images found for this category.</BaseText>
      </div>
      
      
      <!-- Infinite Scroll Trigger -->
      <div ref="infiniteScrollTrigger" v-if="hasMoreItems" class="flex justify-center items-center py-8 px-4 sm:px-6 lg:px-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-secondary)]"></div>
        <span class="ml-3 text-[var(--color-text)]/60">Loading more images...</span>
      </div>
      
      <!-- End of gallery indicator -->
      <div v-if="!hasMoreItems && filteredPortfolio.length > 12" class="text-center py-8 px-4 sm:px-6 lg:px-8">
        <span class="text-[var(--color-text)]/60">You've seen all {{ filteredPortfolio.length }} images</span>
      </div>
      
    </BaseSection>
    
    <!-- Lightbox -->
    <ImageLightbox
      :is-open="lightboxOpen"
      :current-image="currentLightboxImage"
      :current-index="currentLightboxIndex"
      :total-images="totalLightboxImages"
      :all-images="allLightboxImages"
      :show-navigation="true"
      @close="closeLightbox"
      @prev="prevImage"
      @next="nextImage"
      @goto="gotoImage"
      @preload-adjacent="preloadAdjacentImages"
    />
    
    <!-- CTA Section -->
    <BaseSection background="alabaster" padding="xl" spacing="normal">
      <CallToActionSection
        custom-heading='Ready to <span class="font-cormorant italic font-normal text-[var(--color-secondary)]">Tell Your Story?</span>'
        :primary-action="{ text: 'Book Your Story', type: 'button' }"
        :show-voucher-action="true"
        @primary-click="openBookingModal"
        @voucher-click="openVoucherModal"
      />
    </BaseSection>
    
    <!-- Booking Modal -->
    <BookingModal
      :is-open="showBookingModal"
      @close="closeBookingModal"
    />
    
    <!-- Voucher Modal -->
    <VoucherModal
      :is-open="showVoucherModal"
            @close="closeVoucherModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import ImageLightbox from '@/components/ImageLightbox.vue'
import BaseSection from '@/components/ui/BaseSection.vue'
import BaseHeading from '@/components/ui/BaseHeading.vue'
import BaseText from '@/components/ui/BaseText.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import CallToActionSection from '@/components/ui/CallToActionSection.vue'
import FilterButton from '@/components/ui/FilterButton.vue'
import PortfolioCard from '@/components/ui/PortfolioCard.vue'
import BookingModal from '@/components/BookingModal.vue'
import VoucherModal from '@/components/VoucherModal.vue'

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
const infiniteScrollTrigger = ref<HTMLElement>();
const isLoadingMore = ref(false);

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
      url += `&subcategory=${encodeURIComponent(subcategory)}`;
    }
    // Add pagination parameters
    url += `&limit=50&offset=0`;
    
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
  
  // Setup infinite scroll after initial data is loaded
  setTimeout(() => {
    setupInfiniteScroll();
  }, 100);
});

onUnmounted(() => {
  cleanupInfiniteScroll();
});

// Watch for category changes
watch(activeCategory, async (newCategory, oldCategory) => {
  console.log(`🔄 Category changed from "${oldCategory}" to "${newCategory}"`);
  if (newCategory) {
    activeSubcategory.value = ''; // Reset subcategory
    cleanupInfiniteScroll(); // Clean up old observer
    console.log(`🎯 Fetching images for category: ${newCategory}`);
    await fetchCategoryImages(newCategory);
    // Reset infinite scroll for new category
    setTimeout(() => {
      setupInfiniteScroll();
    }, 100);
  } else {
    console.log('⚠️ New category is empty/null');
  }
});

// Watch for subcategory changes
watch(activeSubcategory, async (newSubcategory) => {
  if (activeCategory.value) {
    cleanupInfiniteScroll(); // Clean up old observer
    await fetchCategoryImages(activeCategory.value, newSubcategory);
    // Reset infinite scroll for new subcategory
    setTimeout(() => {
      setupInfiniteScroll();
    }, 100);
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
const totalLightboxImages = computed(() => filteredPortfolio.value.length)
const allLightboxImages = computed(() => {
  return filteredPortfolio.value.map(item => ({
    src: item.thumbnailUrl || item.fullUrl,
    alt: item.alt || 'Gallery image'
  }))
});

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

const gotoImage = (index: number) => {
  currentLightboxIndex.value = index;
};

// Image preloading for better UX
const preloadedImages = new Set<string>();

const preloadImage = (src: string) => {
  if (!src || preloadedImages.has(src)) return;
  
  const img = new Image();
  img.src = src;
  preloadedImages.add(src);
};

const preloadAdjacentImages = (currentIndex: number) => {
  const portfolio = filteredPortfolio.value;
  
  // Preload previous image
  if (currentIndex > 0) {
    const prevItem = portfolio[currentIndex - 1];
    if (prevItem?.fullUrl) {
      preloadImage(prevItem.fullUrl);
    }
  }
  
  // Preload next image
  if (currentIndex < portfolio.length - 1) {
    const nextItem = portfolio[currentIndex + 1];
    if (nextItem?.fullUrl) {
      preloadImage(nextItem.fullUrl);
    }
  }
};

// Infinite scroll functionality
const loadMore = () => {
  if (!isLoadingMore.value && hasMoreItems.value) {
    isLoadingMore.value = true;
    // Add a small delay to show loading state
    setTimeout(() => {
      visibleCount.value += 12;
      isLoadingMore.value = false;
    }, 300);
  }
};

// Intersection Observer for infinite scroll
let intersectionObserver: IntersectionObserver | null = null;

const setupInfiniteScroll = () => {
  if (!infiniteScrollTrigger.value) return;
  
  intersectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && hasMoreItems.value && !isLoadingMore.value) {
          loadMore();
        }
      });
    },
    {
      rootMargin: '100px', // Start loading 100px before the trigger comes into view
      threshold: 0.1
    }
  );
  
  intersectionObserver.observe(infiniteScrollTrigger.value);
};

const cleanupInfiniteScroll = () => {
  if (intersectionObserver) {
    intersectionObserver.disconnect();
    intersectionObserver = null;
  }
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

// Voucher modal state
const showVoucherModal = ref(false);

const openVoucherModal = () => {
  showVoucherModal.value = true;
};

const closeVoucherModal = () => {
  showVoucherModal.value = false;
};
</script>