<template>
  <section class="pt-4 sm:pt-8 md:pt-12 pb-3 sm:pb-4 bg-[var(--color-light)] sticky top-0 z-10 shadow-sm">
    <div class="container-custom">
      <div class="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4">
        <slot />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// No props needed - just a layout component
</script>

<style scoped>
.container-custom {
  max-width: 1280px;
  margin: 0 auto;
  padding-left: 1rem;
  padding-right: 1rem;
}

@media (min-width: 640px) {
  .container-custom {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
}

@media (min-width: 1024px) {
  .container-custom {
    padding-left: 2rem;
    padding-right: 2rem;
  }
}
</style> 