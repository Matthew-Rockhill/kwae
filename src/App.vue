<template>
  <div class="min-h-screen flex flex-col">
    <TheHeader />
    
    <main class="flex-grow">
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    
    <TheFooter />
  </div>
</template>

<script setup lang="ts">
import { useMeta } from 'vue-meta'
import TheHeader from './components/layout/TheHeader.vue'
import TheFooter from './components/layout/TheFooter.vue'
import { useScrollAnimation } from './composables/useScrollAnimation'

// Initialize scroll animations
useScrollAnimation()

// Set global metadata
useMeta({
  title: 'Kristin With An Eye - Capturing Beauty in Humble Places',
  htmlAttrs: { lang: 'en' },
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'description', content: 'Kristin With An Eye - Photographer and storyteller capturing authentic moments, finding beauty in humble places, and sharing stories that connect us all.' },
    { property: 'og:title', content: 'Kristin With An Eye - Capturing Beauty in Humble Places' },
    { property: 'og:description', content: 'Authentic photography and visual storytelling for families, individuals, and purpose-driven organizations.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://kristinwithaneyephotography.com' },
    { property: 'og:image', content: '/images/og-image.jpg' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ]
})
</script>

<style>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>