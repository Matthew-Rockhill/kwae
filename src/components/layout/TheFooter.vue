<template>
  <footer class="bg-[#33423C] text-[#F6F2ED] py-12">
    <div class="container-custom">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 class="text-xl font-light mb-4">Kristin With An Eye</h3>
          <p class="text-[#DCCDC3] text-sm">
            Capturing authentic moments and telling stories through photography.
          </p>
        </div>
        <div>
          <h3 class="text-xl font-light mb-4">Quick Links</h3>
          <ul class="space-y-2">
            <li><router-link to="/" class="text-[#DCCDC3] hover:text-white transition-colors">Home</router-link></li>
            <li><router-link to="/about" class="text-[#DCCDC3] hover:text-white transition-colors">About</router-link></li>
            <li><router-link to="/portfolio" class="text-[#DCCDC3] hover:text-white transition-colors">Portfolio</router-link></li>
            <li><router-link to="/packages" class="text-[#DCCDC3] hover:text-white transition-colors">Packages</router-link></li>
            <li><router-link to="/contact" class="text-[#DCCDC3] hover:text-white transition-colors">Contact</router-link></li>
          </ul>
        </div>
        <div>
          <h3 class="text-xl font-light mb-4">Connect</h3>
          <div class="flex space-x-4">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" class="text-[#DCCDC3] hover:text-white transition-colors">
              <font-awesome-icon :icon="['fab', 'instagram']" class="h-12 w-12" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" class="text-[#DCCDC3] hover:text-white transition-colors">
              <font-awesome-icon :icon="['fab', 'facebook']" class="h-12 w-12" />
            </a>
            <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" class="text-[#DCCDC3] hover:text-white transition-colors">
              <font-awesome-icon :icon="['fab', 'pinterest']" class="h-12 w-12" />
            </a>
          </div>
        </div>
      </div>
      <div class="mt-8 pt-8 border-t border-[#6A7D72] text-center text-sm text-[#DCCDC3]">
        <p>&copy; {{ new Date().getFullYear() }} Kristin With An Eye. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
// No imports needed as we're using global components
</script>