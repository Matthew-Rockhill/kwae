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
              <component 
                :is="primaryAction.type || 'button'"
                :to="primaryAction.type === 'router-link' ? primaryAction.to : undefined"
                :href="primaryAction.type === 'a' ? primaryAction.href : undefined"
                :target="primaryAction.type === 'a' && primaryAction.external ? '_blank' : undefined"
                @click="primaryAction.type === 'button' ? handlePrimaryClick : undefined"
                class="inline-block"
              >
                <BaseButton variant="primary" size="lg" class="min-w-[200px]">
                  {{ primaryAction.text || 'Book Your Session' }}
                </BaseButton>
              </component>
              
              <!-- Secondary Action (optional) -->
              <component 
                v-if="secondaryAction"
                :is="secondaryAction.type || 'router-link'"
                :to="secondaryAction.type === 'router-link' ? secondaryAction.to : undefined"
                :href="secondaryAction.type === 'a' ? secondaryAction.href : undefined"
                :target="secondaryAction.type === 'a' && secondaryAction.external ? '_blank' : undefined"
                @click="secondaryAction.type === 'button' ? handleSecondaryClick : undefined"
                class="inline-block"
              >
                <BaseButton variant="ghost" size="lg" class="min-w-[200px]">
                  {{ secondaryAction.text }}
                </BaseButton>
              </component>
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
}

const props = withDefaults(defineProps<Props>(), {
  background: 'alabaster'
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

</script>