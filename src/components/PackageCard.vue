<template>
  <div class="bg-white shadow-lg h-full flex flex-col" :class="cardClass">
    <!-- Header -->
    <div class="p-8 bg-gradient-to-br from-[#DCCDC3] to-[#E6DFD7]">
      <h3 class="text-2xl font-light text-[#33423C] mb-2" :class="titleClass">{{ title }}</h3>
      <p class="text-[#6A7D72] text-sm italic mb-4">{{ subtitle }}</p>
      <p class="text-2xl font-semibold text-[#33423C]">{{ price }}</p>
      <p v-if="additionalPricing" class="text-sm text-[#6A7D72] mt-2">{{ additionalPricing }}</p>
    </div>
    
    <!-- Content - grows to fill available space -->
    <div class="p-8 flex-grow flex flex-col">
      <!-- Description -->
      <p v-if="description" class="text-[#6A7D72] mb-4" :class="descriptionClass">{{ description }}</p>
      
      <!-- Features List -->
      <div class="space-y-4 mb-8 flex-grow">
        <div v-for="feature in features" :key="feature" class="flex items-start gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#6A7D72] mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
          <span class="text-[#33423C] font-light">{{ feature }}</span>
        </div>
      </div>
      
      <!-- Additional Content (for complex cards like weddings) -->
      <div v-if="additionalContent" class="mb-6">
        <p v-if="additionalContent.text" class="text-[#6A7D72] mb-4" v-html="additionalContent.text"></p>
        <div v-if="additionalContent.bulletPoints" class="space-y-2 mb-4 text-sm text-[#6A7D72]">
          <p v-for="point in additionalContent.bulletPoints" :key="point">{{ point }}</p>
        </div>
      </div>
      
      <!-- Buttons - always at bottom -->
      <div class="mt-auto">
        <div v-if="buttons.length === 1" class="space-y-3">
          <button 
            v-for="button in buttons" 
            :key="button.text"
            class="w-full transition-all duration-300 px-8 py-3 rounded-none uppercase tracking-wider"
            :class="button.variant === 'primary' ? 'bg-[#33423C] hover:bg-[#2A3630] text-[#F6F2ED]' : 'bg-transparent hover:bg-[#33423C]/10 text-[#33423C] border border-[#33423C]'"
            @click="$emit('button-click', button.action)"
          >
            {{ button.text }}
          </button>
        </div>
        <div v-else class="space-y-3">
          <button 
            v-for="button in buttons" 
            :key="button.text"
            class="w-full transition-all duration-300 px-8 py-3 rounded-none uppercase tracking-wider"
            :class="button.variant === 'primary' ? 'bg-[#33423C] hover:bg-[#2A3630] text-[#F6F2ED]' : 'bg-transparent hover:bg-[#33423C]/10 text-[#33423C] border border-[#33423C]'"
            @click="$emit('button-click', button.action)"
          >
            {{ button.text }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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
}

defineProps<Props>()
defineEmits<{
  'button-click': [action: string]
}>()
</script> 