<template>
  <BaseCard 
    variant="elevated" 
    :class="[
      'hover:-translate-y-1 hover:shadow-2xl transition-all duration-500 h-full flex flex-col group bg-gradient-to-br from-white via-white to-[var(--color-accent)]/5 border border-[var(--color-text)]/5',
      uniformHeight ? 'min-h-[500px]' : ''
    ]"
  >
    <!-- Image -->
    <div class="relative h-56 overflow-hidden rounded-t-lg">
      <img 
        :src="image.src" 
        :alt="image.alt" 
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
      
      <!-- Featured Badge -->
      <div v-if="featured" class="absolute top-4 right-4">
        <div class="bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-secondary)]/80 text-white px-4 py-2 rounded-full text-xs font-medium uppercase tracking-wider shadow-lg backdrop-blur-sm">
          {{ featuredText || 'Featured' }}
        </div>
      </div>
    </div>
    
    <!-- Content -->
    <div class="p-8 flex-grow text-left">
      <!-- Title and Price -->
      <div class="mb-6">
        <BaseHeading :level="4" class="mb-2 group-hover:text-[var(--color-secondary)] transition-colors duration-300">{{ title }}</BaseHeading>
        <div v-if="price" class="flex items-baseline gap-2 mb-2">
          <BaseText 
            color="primary" 
            weight="semibold" 
            size="xl"
            class="text-[var(--color-secondary)]"
          >
            {{ price }}
          </BaseText>
          <BaseText 
            v-if="subtitle" 
            color="primary" 
            :opacity="60" 
            size="sm"
            class="italic"
          >
            {{ subtitle }}
          </BaseText>
        </div>
      </div>
      
      <BaseText 
        color="primary" 
        :opacity="70" 
        weight="light" 
        leading="relaxed" 
        class="mb-6"
      >
        {{ description }}
      </BaseText>
      
      <!-- Features list (if provided) -->
      <div v-if="features && features.length > 0" class="mb-6">
        <ul class="space-y-3">
          <li 
            v-for="feature in features" 
            :key="feature"
            class="text-sm text-[var(--color-text)]/70 flex items-start"
          >
            <svg class="w-4 h-4 text-[var(--color-secondary)] mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            {{ feature }}
          </li>
        </ul>
      </div>
    </div>
    
    <!-- Buttons -->
    <div class="p-8 pt-0 mt-auto">
      <div v-if="buttons && buttons.length > 0" class="space-y-3">
        <BaseButton
          v-for="button in buttons"
          :key="button.text"
          :variant="button.variant"
          :size="button.size || 'md'"
          full-width
          class="shadow-lg hover:shadow-xl transition-all duration-300"
          @click="handleButtonClick(button.action)"
        >
          {{ button.text }}
        </BaseButton>
      </div>
      
      <!-- Fallback single button (for preview-style cards) -->
      <BaseButton
        v-else
        variant="primary"
        size="md"
        full-width
        class="shadow-lg hover:shadow-xl transition-all duration-300"
        @click="handleButtonClick(buttonAction)"
      >
        {{ buttonText }}
      </BaseButton>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseHeading from '@/components/ui/BaseHeading.vue'
import BaseText from '@/components/ui/BaseText.vue'

interface Button {
  text: string
  action: string
  variant: 'primary' | 'secondary' | 'ghost' | 'white'
  size?: 'sm' | 'md' | 'lg'
}

interface Image {
  src: string
  alt: string
}

interface Props {
  title: string
  description: string
  image: Image
  subtitle?: string
  price?: string
  features?: string[]
  buttons?: Button[]
  buttonText?: string
  buttonAction?: string
  uniformHeight?: boolean
  featured?: boolean
  featuredText?: string
}

withDefaults(defineProps<Props>(), {
  buttonText: 'Learn More',
  buttonAction: 'default',
  uniformHeight: false,
  featured: false,
  featuredText: 'Featured'
})

const emit = defineEmits<{
  'button-click': [action: string]
}>()

const handleButtonClick = (action: string) => {
  emit('button-click', action)
}
</script>