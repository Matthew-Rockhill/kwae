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
        :key="subcategory"
        :active="activeSubcategory === subcategory"
        @click="activeSubcategory = subcategory"
        class="capitalize"
      >
        {{ subcategory.replace('-', ' ') }}
      </FilterButton>
    </div>
    
    <!-- Portfolio Gallery -->
    <BaseSection v-else background="light" padding="lg">
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
          Load More ({{ visibleCount }}/{{ filteredPortfolio.length }})
        </BaseButton>
      </div>
      
      <!-- No Images State -->
      <div v-if="filteredPortfolio.length === 0" class="text-center py-12">
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
import BookingModal from '@/components/BookingModal.vue'

type CategoryId = 'family' | 'ngo' | 'lifestyle' | 'branding';
type LifestyleSubcategory = 'rockpooling' | 'events' | 'traditional-wedding';

const route = useRoute();
const activeCategory = ref((route.query.category as string) || 'family');
const activeSubcategory = ref<LifestyleSubcategory>('rockpooling');
const visibleCount = ref(12);
const loading = ref(false);
const error = ref('');

const brandingImages = ref<{ thumbnailUrl: string; fullUrl: string; alt: string }[]>([]);
const familyImages = ref<{ thumbnailUrl: string; fullUrl: string; alt: string }[]>([]);

async function fetchFamilyImages() {
  loading.value = true;
  error.value = '';
  try {
    const res = await fetch('/api/imagekit-family');
    if (!res.ok) throw new Error('Failed to fetch family images');
    const data = await res.json();
    familyImages.value = data.images;
  } catch (err: any) {
    error.value = err.message || 'Unknown error';
  } finally {
    loading.value = false;
  }
}

async function fetchBrandingImages() {
  loading.value = true;
  error.value = '';
  try {
    const res = await fetch('/api/imagekit-branding');
    if (!res.ok) throw new Error('Failed to fetch branding images');
    const data = await res.json();
    brandingImages.value = data.images;
  } catch (err: any) {
    error.value = err.message || 'Unknown error';
  } finally {
    loading.value = false;
  }
}

async function fetchNgoImages() {
  loading.value = true;
  error.value = '';
  try {
    const res = await fetch('/api/imagekit-ngo');
    if (!res.ok) throw new Error('Failed to fetch NGO images');
    const data = await res.json();
    ngoImages.value = data.images;
  } catch (err: any) {
    error.value = err.message || 'Unknown error';
  } finally {
    loading.value = false;
  }
}

async function fetchLifestyleImages(subcategory: LifestyleSubcategory) {
  loading.value = true;
  error.value = '';
  try {
    const res = await fetch(`/api/imagekit-lifestyle?subcategory=${subcategory}`);
    if (!res.ok) throw new Error(`Failed to fetch ${subcategory} images`);
    const data = await res.json();
    lifestyleImages.value[subcategory] = data.images;
  } catch (err: any) {
    error.value = err.message || 'Unknown error';
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  if (activeCategory.value === 'family') {
    fetchFamilyImages();
  } else if (activeCategory.value === 'branding') {
    fetchBrandingImages();
  } else if (activeCategory.value === 'ngo') {
    fetchNgoImages();
  } else if (activeCategory.value === 'lifestyle') {
    fetchLifestyleImages(activeSubcategory.value);
  }
});

watch(activeCategory, (newVal) => {
  if (newVal === 'family' && familyImages.value.length === 0) {
    fetchFamilyImages();
  } else if (newVal === 'branding' && brandingImages.value.length === 0) {
    fetchBrandingImages();
  } else if (newVal === 'ngo' && ngoImages.value.length === 0) {
    fetchNgoImages();
  } else if (newVal === 'lifestyle' && lifestyleImages.value[activeSubcategory.value].length === 0) {
    fetchLifestyleImages(activeSubcategory.value);
  }
});

watch(activeSubcategory, (newVal) => {
  if (activeCategory.value === 'lifestyle' && lifestyleImages.value[newVal].length === 0) {
    fetchLifestyleImages(newVal);
  }
});
const ngoImages = ref<{ thumbnailUrl: string; fullUrl: string; alt: string }[]>([]);
const lifestyleImages = ref<Record<LifestyleSubcategory, { thumbnailUrl: string; fullUrl: string; alt: string }[]>>({
  rockpooling: [],
  events: [],
  'traditional-wedding': []
});

const filteredPortfolio = computed(() => {
  if (activeCategory.value === 'branding') {
    return brandingImages.value.slice(0, visibleCount.value)
  }
  if (activeCategory.value === 'family') {
    return familyImages.value.slice(0, visibleCount.value)
  }
  if (activeCategory.value === 'lifestyle') {
    return lifestyleImages.value[activeSubcategory.value].slice(0, visibleCount.value)
  }
  if (activeCategory.value === 'ngo') {
    return ngoImages.value.slice(0, visibleCount.value)
  }
  return []
});
const hasMoreItems = computed(() => {
  if (activeCategory.value === 'branding') {
    return visibleCount.value < brandingImages.value.length
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
  return false
});

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

// Booking modal state
const showBookingModal = ref(false);
const openBookingModal = () => {
  showBookingModal.value = true;
};
const closeBookingModal = () => {
  showBookingModal.value = false;
};

const categories = [
  { id: 'family', name: 'Family' },
  { id: 'ngo', name: 'NGO Storytelling' },
  { id: 'lifestyle', name: 'Lifestyle' },
  { id: 'branding', name: 'Branding' }
];
const lifestyleSubcategories: LifestyleSubcategory[] = ['rockpooling', 'events', 'traditional-wedding'];

function setActiveCategory(categoryId: string) {
  activeCategory.value = categoryId as CategoryId;
  if (categoryId === 'lifestyle') {
    activeSubcategory.value = 'rockpooling';
  }
}
</script>