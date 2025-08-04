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
  title: 'Kristin Mathilde - Cape Town Photographer | Professional Photography Services',
  htmlAttrs: { lang: 'en' },
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'description', content: 'Professional Cape Town photographer specializing in weddings, portraits, lifestyle & event photography. Kristin Mathilde captures authentic moments with artistic storytelling throughout Cape Town.' },
    { name: 'keywords', content: 'Cape Town photographer, Cape Town photography, wedding photographer Cape Town, portrait photography Cape Town, lifestyle photographer, event photography Cape Town, professional photographer Cape Town, Kristin Mathilde' },
    { name: 'author', content: 'Kristin Mathilde Photography' },
    { property: 'og:title', content: 'Kristin Mathilde - Cape Town Photographer | Professional Photography Services' },
    { property: 'og:description', content: 'Professional Cape Town photographer specializing in weddings, portraits, lifestyle & event photography. Capturing authentic moments with artistic storytelling.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://www.kristinmathilde.com' },
    { property: 'og:image', content: 'https://www.kristinmathilde.com/src/assets/images/kristin_mathilde_social.png' },
    { property: 'og:locale', content: 'en_ZA' },
    { property: 'og:site_name', content: 'Kristin Mathilde Photography' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Kristin Mathilde - Cape Town Photographer' },
    { name: 'twitter:description', content: 'Professional Cape Town photographer specializing in weddings, portraits, lifestyle & event photography.' },
    { name: 'twitter:image', content: 'https://www.kristinmathilde.com/src/assets/images/kristin_mathilde_social.png' },
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