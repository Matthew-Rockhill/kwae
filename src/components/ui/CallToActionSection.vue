<template>
  <section :class="backgroundClass">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="relative">
        <!-- Background Decorative Elements -->
        <div class="absolute -top-20 -right-20 w-40 h-40 bg-[var(--color-secondary)]/5 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-20 -left-20 w-60 h-60 bg-[var(--color-accent)]/20 rounded-full blur-3xl"></div>
        
        <!-- Main CTA Card -->
        <div class="relative bg-gradient-to-br from-white via-white to-[var(--color-accent)]/20 rounded-3xl shadow-2xl p-8 md:p-12 lg:p-16 text-center overflow-hidden">
          <!-- Subtle pattern overlay -->
          <div class="absolute inset-0 opacity-5">
            <div class="absolute inset-0" style="background-image: radial-gradient(circle at 2px 2px, var(--color-secondary) 1px, transparent 0); background-size: 40px 40px;"></div>
          </div>
          
          <div class="relative z-10 max-w-4xl mx-auto">
            <!-- Heading -->
            <BaseHeading :level="2" align="center" class="mb-6">
              <template v-if="customHeading">
                <span v-html="customHeading"></span>
              </template>
              <template v-else>
                Ready to <span class="font-cormorant italic font-normal text-[var(--color-secondary)]">Tell Your Story?</span>
              </template>
            </BaseHeading>
            
            <!-- Description -->
            <p class="text-[var(--color-text)] text-lg lg:text-xl font-light leading-relaxed mb-10 max-w-3xl mx-auto">
              {{ description || "Let's work together to capture your authentic moments and create beautiful memories that last a lifetime." }}
            </p>
            
            <!-- Action Buttons -->
            <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <!-- Primary Action -->
              <template v-if="primaryAction.type === 'button'">
                <button @click="handlePrimaryClick" class="inline-block">
                  <BaseButton variant="primary" size="lg" class="min-w-[180px]">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                    {{ primaryAction.text || 'Book Your Session' }}
                  </BaseButton>
                </button>
              </template>
              <template v-else>
                <component 
                  :is="primaryAction.type || 'router-link'"
                  :to="primaryAction.type === 'router-link' ? primaryAction.to : undefined"
                  :href="primaryAction.type === 'a' ? primaryAction.href : undefined"
                  :target="primaryAction.type === 'a' && primaryAction.external ? '_blank' : undefined"
                  class="inline-block"
                >
                  <BaseButton variant="primary" size="lg" class="min-w-[180px]">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                    {{ primaryAction.text || 'Book Your Session' }}
                  </BaseButton>
                </component>
              </template>
              
              <!-- Voucher Action (if enabled) -->
              <button 
                v-if="showVoucherAction"
                @click="handleVoucherClick"
                class="inline-block"
              >
                <BaseButton variant="secondary" size="lg" class="min-w-[180px] flex items-center justify-center">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"/>
                  </svg>
                  {{ voucherActionText || 'Buy a Voucher' }}
                </BaseButton>
              </button>
              
              <!-- Secondary Action (optional) -->
              <template v-if="secondaryAction">
                <template v-if="secondaryAction.type === 'button'">
                  <button @click="handleSecondaryClick" class="inline-block">
                    <BaseButton variant="ghost" size="lg" class="min-w-[180px]">
                      {{ secondaryAction.text }}
                    </BaseButton>
                  </button>
                </template>
                <template v-else>
                  <component 
                    :is="secondaryAction.type || 'router-link'"
                    :to="secondaryAction.type === 'router-link' ? secondaryAction.to : undefined"
                    :href="secondaryAction.type === 'a' ? secondaryAction.href : undefined"
                    :target="secondaryAction.type === 'a' && secondaryAction.external ? '_blank' : undefined"
                    class="inline-block"
                  >
                    <BaseButton variant="ghost" size="lg" class="min-w-[180px]">
                      {{ secondaryAction.text }}
                    </BaseButton>
                  </component>
                </template>
              </template>
            </div>
            
            <!-- Optional additional content slot -->
            <div v-if="$slots.additional" class="mt-8">
              <slot name="additional"></slot>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BaseHeading from '@/components/ui/BaseHeading.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

interface ActionConfig {
  text: string
  type?: 'button' | 'router-link' | 'a'
  to?: string
  href?: string
  external?: boolean
}

interface Props {
  customHeading?: string
  description?: string
  primaryAction: ActionConfig
  secondaryAction?: ActionConfig
  background?: 'alabaster' | 'light' | 'accent' | 'white'
  showVoucherAction?: boolean
  voucherActionText?: string
}

const props = withDefaults(defineProps<Props>(), {
  background: 'alabaster',
  showVoucherAction: false,
  voucherActionText: 'Buy a Voucher'
})

const emit = defineEmits<{
  'primary-click': []
  'secondary-click': []
  'voucher-click': []
}>()

const backgroundClass = computed(() => {
  const baseClasses = ''
  
  switch (props.background) {
    case 'alabaster':
      return `${baseClasses} bg-[var(--color-alabaster)]`
    case 'light':
      return `${baseClasses} bg-[var(--color-light)]`
    case 'accent':
      return `${baseClasses} bg-[var(--color-accent)]`
    case 'white':
      return `${baseClasses} bg-white`
    default:
      return `${baseClasses} bg-[var(--color-alabaster)]`
  }
})

const handlePrimaryClick = () => {
  emit('primary-click')
}

const handleSecondaryClick = () => {
  emit('secondary-click')
}

const handleVoucherClick = () => {
  emit('voucher-click')
}

</script>