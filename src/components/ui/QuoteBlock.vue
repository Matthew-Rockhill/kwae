<template>
  <div class="pl-6 border-l-2 border-[var(--color-accent)] py-2" :class="spacing">
    <BaseText 
      tag="p" 
      size="xl" 
      color="secondary" 
      :italic="true" 
      class="font-cormorant"
    >
      <slot />
    </BaseText>
  </div>
</template>

<script setup lang="ts">
import BaseText from './BaseText.vue'

interface Props {
  spacing?: string
}

const { spacing = 'mb-6' } = defineProps<Props>()
</script> 