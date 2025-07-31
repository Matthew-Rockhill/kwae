<template>
    <header class="w-full bg-[var(--color-light)]/80 backdrop-blur-md sticky top-0 z-50 shadow-lg border-b border-[var(--color-card-header)]/50">
      <div class="container-custom py-4">
        <div class="flex justify-between items-center">
          <!-- Logo -->
          <router-link to="/" class="flex items-center">
            <div class="relative h-14">
              <img src="@/assets/images/kwae.png" alt="Kristin with an eye" class="w-full h-full object-contain">
            </div>
          </router-link>
  
          <!-- Mobile menu button -->
          <button @click="toggleMenu" class="md:hidden text-[var(--color-text)] focus:outline-none hover:text-[var(--color-secondary)] transition-colors duration-300 hover:scale-110 transform-gpu">
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
              class="text-[var(--color-text)] hover:text-[var(--color-secondary)] font-light uppercase tracking-wider text-sm transition-all duration-300 hover:scale-105 hover:drop-shadow-sm"
              :class="{ 'font-normal border-b-2 border-[var(--color-secondary)] text-[var(--color-secondary)]': isActiveRoute(item.path) }"
            >
              {{ item.name }}
            </router-link>
            <BaseButton @click="openBookingModal" variant="primary" size="sm">
              Book Now
            </BaseButton>
          </nav>
        </div>
  
        <!-- Mobile navigation -->
        <transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="transform scale-95 opacity-0"
          enter-to-class="transform scale-100 opacity-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="transform scale-100 opacity-100"
          leave-to-class="transform scale-95 opacity-0"
        >
          <div v-if="isMenuOpen" class="md:hidden mt-4 pb-4 border-t border-[var(--color-card-header)]/50 pt-4 bg-[var(--color-light)]/50 backdrop-blur-sm rounded-lg">
            <div class="flex flex-col space-y-3">
              <router-link 
                v-for="(item, index) in navItems" 
                :key="index" 
                :to="item.path" 
                class="text-[var(--color-text)] hover:text-[var(--color-secondary)] uppercase text-base tracking-wider font-light py-3 px-2 transition-all duration-300 active:bg-[var(--color-accent)] rounded-lg hover:scale-105 transform-gpu"
                :class="{ 'font-normal bg-[var(--color-accent)]': isActiveRoute(item.path) }"
                @click="closeMenu"
              >
                {{ item.name }}
              </router-link>
              <BaseButton @click="openBookingModal" variant="primary" size="md" full-width>
                Book Now
              </BaseButton>
            </div>
          </div>
        </transition>
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
  import BaseButton from '@/components/ui/BaseButton.vue'
  
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