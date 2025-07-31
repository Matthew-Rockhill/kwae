<template>
  <div class="bg-white rounded-2xl shadow-xl overflow-hidden h-full flex flex-col">
    <!-- Header Section -->
    <div class="p-8 pb-0">
      <div class="flex justify-between items-start mb-2">
        <div>
          <BaseHeading :level="4" class="text-2xl">{{ title }}</BaseHeading>
          <span 
            v-if="badge" 
            class="inline-block mt-1 px-2 py-1 bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] text-xs rounded-full"
          >
            {{ badge }}
          </span>
        </div>
        <p class="text-2xl font-semibold text-[var(--color-secondary)]">{{ price }}</p>
      </div>
      <p class="text-base text-[var(--color-text)]/60 italic mb-4">{{ subtitle }}</p>
      
      <BaseText 
        size="base"
        color="primary" 
        :opacity="70" 
        weight="light" 
        leading="relaxed" 
        class="mb-6"
      >
        {{ description }}
      </BaseText>
    </div>
    
    <!-- Features Section - Scrollable if needed -->
    <div class="px-8 flex-grow overflow-y-auto">
      <h4 class="text-xs font-medium text-[var(--color-text)] mb-3 uppercase tracking-wider opacity-60">What's Included</h4>
      <ul class="space-y-2 mb-6">
        <li 
          v-for="feature in features" 
          :key="feature"
          class="text-sm text-[var(--color-text)]/70 flex items-start"
        >
          <svg class="w-4 h-4 text-[var(--color-secondary)] mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
          {{ feature }}
        </li>
      </ul>
    </div>
    
    <!-- Action Section -->
    <div class="p-8 pt-4 mt-auto">
      <BaseButton
        variant="primary"
        size="lg"
        full-width
        class="shadow-lg hover:shadow-xl transition-all duration-300"
        @click="$emit('book-package')"
      >
        Book {{ title }}
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseHeading from '@/components/ui/BaseHeading.vue'
import BaseText from '@/components/ui/BaseText.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

interface Props {
  title: string
  subtitle: string
  price: string
  description: string
  features: string[]
  badge?: string
}

defineProps<Props>()

defineEmits<{
  'book-package': []
}>()
</script>