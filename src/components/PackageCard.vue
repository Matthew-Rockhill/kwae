<template>
  <BaseCard variant="elevated" :full-height="true" padding="none" class="flex flex-col">
    <!-- Header -->
    <div class="p-8 bg-[var(--color-card-header)]">
      <h3 class="text-2xl md:text-3xl font-extralight text-[var(--color-text)] mb-2" :class="uniformHeight ? 'min-h-[5rem] flex items-center' : ''">{{ title }}</h3>
      <BaseText tag="p" size="sm" color="secondary" :italic="true" class="mb-4">{{ subtitle }}</BaseText>
      <BaseText tag="p" size="xl" weight="semibold">{{ price }}</BaseText>
      <BaseText v-if="additionalPricing" tag="p" size="sm" color="secondary" class="mt-2">{{ additionalPricing }}</BaseText>
    </div>
    
    <!-- Content - grows to fill available space -->
    <div class="p-8 flex-grow flex flex-col">
      <!-- Description -->
      <BaseText v-if="description" color="muted" class="mb-4" :class="descriptionClass">{{ description }}</BaseText>
      
      <!-- Features List -->
      <div class="space-y-4 mb-8 flex-grow">
        <div v-for="feature in features" :key="feature" class="flex items-start gap-3">
          <BaseIcon color="secondary" class="mt-0.5">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </BaseIcon>
          <BaseText weight="light">{{ feature }}</BaseText>
        </div>
      </div>
      
      <!-- Additional Content (for complex cards like weddings) -->
      <div v-if="additionalContent" class="mb-6">
        <BaseText v-if="additionalContent.text" color="secondary" class="mb-4" v-html="additionalContent.text"></BaseText>
        <div v-if="additionalContent.bulletPoints" class="space-y-2 mb-4">
          <BaseText v-for="point in additionalContent.bulletPoints" :key="point" size="sm" color="secondary">{{ point }}</BaseText>
        </div>
      </div>
      
      <!-- Buttons - always at bottom -->
      <div class="mt-auto">
        <div v-if="buttons.length === 1" class="space-y-3">
          <BaseButton 
            v-for="button in buttons" 
            :key="button.text"
            :variant="button.variant"
            full-width
            @click="$emit('button-click', button.action)"
          >
            {{ button.text }}
          </BaseButton>
        </div>
        <div v-else class="space-y-3">
          <BaseButton 
            v-for="button in buttons" 
            :key="button.text"
            :variant="button.variant"
            full-width
            @click="$emit('button-click', button.action)"
          >
            {{ button.text }}
          </BaseButton>
        </div>
      </div>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import BaseButton from '@/components/ui/BaseButton.vue'
// import BaseHeading from '@/components/ui/BaseHeading.vue' // Removed - not used  
import BaseText from '@/components/ui/BaseText.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseIcon from '@/components/ui/BaseIcon.vue'

interface Button {
  text: string
  action: string
  variant: 'primary' | 'secondary'
}

interface AdditionalContent {
  text?: string
  bulletPoints?: string[]
}

interface Props {
  title: string
  subtitle: string
  price: string
  additionalPricing?: string
  description?: string
  features: string[]
  buttons: Button[]
  additionalContent?: AdditionalContent
  cardClass?: string
  titleClass?: string
  descriptionClass?: string
  uniformHeight?: boolean
}

defineProps<Props>()
defineEmits<{
  'button-click': [action: string]
}>()
</script> 