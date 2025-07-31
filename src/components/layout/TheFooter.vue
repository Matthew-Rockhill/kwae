<template>
  <footer class="bg-gradient-to-b from-[var(--color-primary)] to-[var(--color-primary)]/95 text-[var(--color-text-light)] relative overflow-hidden">
    <!-- Background decorative elements -->
    <div class="absolute inset-0 opacity-5">
      <div class="absolute top-0 left-1/4 w-64 h-64 bg-[var(--color-secondary)] rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-[var(--color-accent)] rounded-full blur-3xl"></div>
    </div>
    
    <div class="relative z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <!-- Main Footer Content -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-12">
          
          <!-- Brand Column -->
          <div class="lg:col-span-2 max-w-md">
            <div class="mb-6">
              <h3 class="text-3xl lg:text-4xl font-light mb-2 tracking-tight">
                Kristin <span class="font-cormorant italic font-normal text-[var(--color-accent)]">With An Eye</span>
              </h3>
              <div class="w-16 h-0.5 bg-gradient-to-r from-[var(--color-secondary)] to-transparent"></div>
            </div>
            
            <p class="text-[var(--color-text-light)]/80 text-lg leading-relaxed mb-8">
              Capturing authentic moments and telling stories that matter through natural, earthy photography that celebrates life's beautiful simplicity.
            </p>
            
            <!-- Social Media -->
            <div class="flex items-center gap-4">
              <span class="text-sm text-[var(--color-text-light)]/60">Follow the journey</span>
              <div class="flex gap-3">
                <a 
                  href="https://www.instagram.com/kristin_with.an.eye/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-[var(--color-text-light)]/70 hover:text-[var(--color-accent)] transition-colors duration-300"
                >
                  <font-awesome-icon :icon="['fab', 'instagram']" class="text-2xl" />
                </a>
                <a 
                  href="https://www.facebook.com/people/Kristin-With-An-Eye/100071698255681/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-[var(--color-text-light)]/70 hover:text-[var(--color-accent)] transition-colors duration-300"
                >
                  <font-awesome-icon :icon="['fab', 'facebook']" class="text-2xl" />
                </a>
                <a 
                  href="https://www.linkedin.com/company/kristin-with-an-eye/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-[var(--color-text-light)]/70 hover:text-[var(--color-accent)] transition-colors duration-300"
                >
                  <font-awesome-icon :icon="['fab', 'linkedin']" class="text-2xl" />
                </a>
              </div>
            </div>
          </div>
          
          <!-- Quick Links -->
          <div>
            <h4 class="text-xl font-medium mb-6 text-[var(--color-accent)]">Explore</h4>
            <ul class="space-y-4">
              <li>
                <router-link 
                  to="/" 
                  class="text-[var(--color-text-light)]/80 hover:text-[var(--color-accent)] transition-colors duration-300 flex items-center group"
                >
                  <span class="w-1 h-1 bg-[var(--color-secondary)] rounded-full mr-3 group-hover:w-2 transition-all duration-300"></span>
                  Home
                </router-link>
              </li>
              <li>
                <router-link 
                  to="/about" 
                  class="text-[var(--color-text-light)]/80 hover:text-[var(--color-accent)] transition-colors duration-300 flex items-center group"
                >
                  <span class="w-1 h-1 bg-[var(--color-secondary)] rounded-full mr-3 group-hover:w-2 transition-all duration-300"></span>
                  About Kristin
                </router-link>
              </li>
              <li>
                <router-link 
                  to="/portfolio" 
                  class="text-[var(--color-text-light)]/80 hover:text-[var(--color-accent)] transition-colors duration-300 flex items-center group"
                >
                  <span class="w-1 h-1 bg-[var(--color-secondary)] rounded-full mr-3 group-hover:w-2 transition-all duration-300"></span>
                  Portfolio
                </router-link>
              </li>
              <li>
                <router-link 
                  to="/packages" 
                  class="text-[var(--color-text-light)]/80 hover:text-[var(--color-accent)] transition-colors duration-300 flex items-center group"
                >
                  <span class="w-1 h-1 bg-[var(--color-secondary)] rounded-full mr-3 group-hover:w-2 transition-all duration-300"></span>
                  Packages
                </router-link>
              </li>
              <li>
                <router-link 
                  to="/contact" 
                  class="text-[var(--color-text-light)]/80 hover:text-[var(--color-accent)] transition-colors duration-300 flex items-center group"
                >
                  <span class="w-1 h-1 bg-[var(--color-secondary)] rounded-full mr-3 group-hover:w-2 transition-all duration-300"></span>
                  Contact
                </router-link>
              </li>
            </ul>
          </div>
          
          <!-- Services -->
          <div>
            <h4 class="text-xl font-medium mb-6 text-[var(--color-accent)]">Services</h4>
            <ul class="space-y-4">
              <li class="text-[var(--color-text-light)]/70 flex items-center">
                <span class="w-1 h-1 bg-[var(--color-secondary)]/60 rounded-full mr-3"></span>
                Family Portraits
              </li>
              <li class="text-[var(--color-text-light)]/70 flex items-center">
                <span class="w-1 h-1 bg-[var(--color-secondary)]/60 rounded-full mr-3"></span>
                Wedding Photography
              </li>
              <li class="text-[var(--color-text-light)]/70 flex items-center">
                <span class="w-1 h-1 bg-[var(--color-secondary)]/60 rounded-full mr-3"></span>
                NGO Storytelling
              </li>
              <li class="text-[var(--color-text-light)]/70 flex items-center">
                <span class="w-1 h-1 bg-[var(--color-secondary)]/60 rounded-full mr-3"></span>
                Brand Photography
              </li>
            </ul>
          </div>
        </div>
        
        <!-- Bottom Bar -->
        <div class="border-t border-[var(--color-text-light)]/20 pt-8">
          <div class="flex flex-col md:flex-row justify-between items-center gap-4">
            <div class="flex flex-col md:flex-row items-center gap-4 md:gap-8">
              <p class="text-[var(--color-text-light)]/60 text-sm">
                © {{ currentYear }} Kristin With An Eye. All rights reserved.
              </p>
              <p class="text-[var(--color-text-light)]/60 text-sm">
                📍 Based in Cape Town, South Africa
              </p>
            </div>
            <p class="text-[var(--color-text-light)]/50 text-xs italic">
              Capturing beauty in humble places
            </p>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const currentYear = computed(() => new Date().getFullYear())
</script>