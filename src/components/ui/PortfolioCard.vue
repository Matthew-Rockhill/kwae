<template>
  <div 
    class="group relative overflow-hidden rounded-lg bg-[var(--color-light)] transform transition-all duration-500 hover:scale-[1.02] hover:shadow-xl cursor-pointer"
    @click="$emit('click')"
  >
    <!-- Image Container -->
    <div class="relative aspect-[4/3] overflow-hidden">
      <img 
        :src="image.thumbnailUrl || image.src" 
        :alt="image.alt || image.title || 'Portfolio image'" 
        class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        :class="imageClasses"
      />
      
      <!-- Overlay for NGO category -->
      <template v-if="showOverlay">
        <div class="absolute inset-0 bg-gradient-to-t from-[var(--color-text)]/90 via-[var(--color-text)]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div class="absolute inset-0 flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
          <BaseText v-if="image.category" tag="span" size="sm" color="primary" :opacity="80" class="uppercase tracking-wider mb-2">
            {{ image.category }}
          </BaseText>
          <BaseHeading v-if="image.title" :level="3" color="primary" class="mb-2 text-white">
            {{ image.title }}
          </BaseHeading>
          <BaseText v-if="image.description" size="sm" color="white" class="line-clamp-2" :opacity="80">
            {{ image.description }}
          </BaseText>
        </div>
        <div class="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <BaseButton variant="ghost" size="sm" class="bg-white/10 backdrop-blur-sm text-white hover:bg-white/20">
            View Details
          </BaseButton>
        </div>
      </template>
    </div>
    
    <!-- Static Content for NGO category -->
    <template v-if="showStaticContent">
      <div class="p-4">
        <BaseText v-if="image.category" tag="span" size="sm" color="primary" :opacity="70" class="uppercase tracking-wider">
          {{ image.category }}
        </BaseText>
        <BaseHeading v-if="image.title" :level="3" class="mt-1">
          {{ image.title }}
        </BaseHeading>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BaseText from './BaseText.vue'
import BaseHeading from './BaseHeading.vue'
import BaseButton from './BaseButton.vue'

interface PortfolioImage {
  src?: string
  thumbnailUrl?: string
  fullUrl?: string
  alt?: string
  title?: string
  description?: string
  category?: string
}

interface Props {
  image: PortfolioImage
  category: string
  subcategory?: string
  showOverlay?: boolean
  showStaticContent?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showOverlay: false,
  showStaticContent: false
})

defineEmits<{
  click: []
}>()

// Computed class for image effects based on category/subcategory
const imageClasses = computed(() => {
  if (props.category === 'lifestyle' && (props.subcategory === 'rockpooling' || props.subcategory === 'traditional-wedding')) {
    return 'brightness-110 contrast-105 saturate-105'
  }
  return ''
})
</script> 