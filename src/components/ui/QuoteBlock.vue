<template>
  <div class="relative pl-8 py-4" :class="spacing">
    <div class="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-[var(--color-secondary)] to-[var(--color-accent)] rounded-full"></div>
    <p class="font-cormorant text-xl italic text-[var(--color-secondary)] leading-relaxed">
      <slot />
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  spacing?: string
}

const { spacing = 'mb-6' } = defineProps<Props>()
</script> 