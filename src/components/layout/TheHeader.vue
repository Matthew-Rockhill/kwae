<template>
    <header class="w-full bg-[var(--color-light)] sticky top-0 z-50 shadow-sm border-b border-[var(--color-card-header)]">
      <div class="container-custom py-4">
        <div class="flex justify-between items-center">
          <!-- Logo -->
          <router-link to="/" class="flex items-center">
            <div class="relative h-14">
              <img src="@/assets/images/kwae.png" alt="Kristin with an eye" class="w-full h-full object-contain">
            </div>
          </router-link>
  
          <!-- Mobile menu button -->
          <button @click="toggleMenu" class="md:hidden text-[var(--color-text)] focus:outline-none">
            <svg v-if="!isMenuOpen" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
  
          <!-- Desktop navigation -->
          <nav class="hidden md:flex items-center space-x-8">
            <router-link 
              v-for="(item, index) in navItems" 
              :key="index" 
              :to="item.path" 
              class="text-[var(--color-text)] hover:text-[var(--color-secondary)] font-light uppercase tracking-wider text-sm transition duration-300"
              :class="{ 'font-normal border-b border-[var(--color-card-header)]': isActiveRoute(item.path) }"
            >
              {{ item.name }}
            </router-link>
            <button @click="openBookingModal" class="btn-primary uppercase text-sm tracking-wider">
              Book Now
            </button>
          </nav>
        </div>
  
        <!-- Mobile navigation -->
        <div v-if="isMenuOpen" class="md:hidden mt-4 pb-4 border-t border-[var(--color-card-header)] pt-4">
          <div class="flex flex-col space-y-4">
            <router-link 
              v-for="(item, index) in navItems" 
              :key="index" 
              :to="item.path" 
              class="text-[var(--color-text)] hover:text-[var(--color-secondary)] uppercase text-sm tracking-wider font-light py-2 transition duration-300"
              :class="{ 'font-normal border-b border-[var(--color-card-header)] w-max': isActiveRoute(item.path) }"
              @click="closeMenu"
            >
              {{ item.name }}
            </router-link>
            <button @click="openBookingModal" class="btn-primary uppercase text-sm tracking-wider w-full">
              Book Now
            </button>
          </div>
        </div>
      </div>

      <!-- Booking Modal -->
      <BookingModal
        :is-open="showBookingModal"
        @close="closeBookingModal"
      />
    </header>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { useRoute } from 'vue-router'
  import BookingModal from '@/components/BookingModal.vue'
  
  const route = useRoute()
  const isMenuOpen = ref(false)
  const showBookingModal = ref(false)
  
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Packages', path: '/packages' },
    { name: 'Contact', path: '/contact' }
  ]
  
  const isActiveRoute = (path: string) => {
    if (path === '/') {
      return route.path === '/'
    }
    return route.path.startsWith(path)
  }

  const openBookingModal = () => {
    showBookingModal.value = true
    isMenuOpen.value = false
  }

  const closeBookingModal = () => {
    showBookingModal.value = false
  }

  const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value
  }

  const closeMenu = () => {
    isMenuOpen.value = false
  }
  </script>