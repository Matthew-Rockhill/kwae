<template>
  <BaseCard 
    variant="elevated" 
    :class="[
      'hover:-translate-y-2 transition-transform duration-300 h-full flex flex-col',
      uniformHeight ? 'min-h-[500px]' : ''
    ]"
  >
    <!-- Image -->
    <div class="relative h-48 overflow-hidden rounded-t-lg">
      <img 
        :src="image.src" 
        :alt="image.alt" 
        class="w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
    </div>
    
    <!-- Content -->
    <div class="p-8 flex-grow text-left">
      <BaseHeading :level="3" class="mb-4">{{ title }}</BaseHeading>
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
        <ul class="space-y-2">
          <li 
            v-for="feature in features" 
            :key="feature"
            class="text-sm text-[var(--color-text)]/60 flex items-start"
          >
            <span class="inline-block w-1.5 h-1.5 bg-[var(--color-primary)] rounded-full mt-2 mr-3 flex-shrink-0"></span>
            {{ feature }}
          </li>
        </ul>
      </div>
      
      <!-- Price (if provided) -->
      <div v-if="price" class="mb-4">
        <BaseText 
          color="primary" 
          weight="semibold" 
          size="lg"
          class="text-[var(--color-primary)]"
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
    
    <!-- Buttons -->
    <div class="p-6 pt-0 mt-auto">
      <div v-if="buttons && buttons.length > 0" class="space-y-3">
        <BaseButton
          v-for="button in buttons"
          :key="button.text"
          :variant="button.variant"
          :size="button.size || 'sm'"
          full-width
          @click="handleButtonClick(button.action)"
        >
          {{ button.text }}
        </BaseButton>
      </div>
      
      <!-- Fallback single button (for preview-style cards) -->
      <BaseButton
        v-else
        variant="primary"
        size="sm"
        full-width
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
}

const props = withDefaults(defineProps<Props>(), {
  buttonText: 'Learn More',
  buttonAction: 'default',
  uniformHeight: false
})

const emit = defineEmits<{
  'button-click': [action: string]
}>()

const handleButtonClick = (action: string) => {
  emit('button-click', action)
}
</script>