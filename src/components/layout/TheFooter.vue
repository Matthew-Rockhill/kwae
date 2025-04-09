<template>
  <footer class="bg-[#33423C]">
    <div class="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
      <div class="flex justify-center space-x-4 md:order-2">
        <a v-for="item in socialLinks" :key="item.name" 
           :href="item.href" 
           target="_blank"
           class="text-[#F6F2ED] hover:text-[#DCCDC3] transition-colors duration-300">
          <span class="sr-only">{{ item.name }}</span>
          <font-awesome-icon :icon="['fab', item.icon]" class="h-20 w-20" style="font-size: 2.0rem;" />
        </a>
      </div>
      <p class="mt-8 text-center text-sm text-[#F6F2ED]/70 md:order-1 md:mt-0">
        © {{ currentYear }} Kristin With An Eye. All rights reserved.
      </p>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const currentYear = new Date().getFullYear()

const socialLinks = [
  {
    name: 'Instagram',
    href: 'https://instagram.com/kristinwithaneye',
    icon: 'instagram'
  },
  {
    name: 'Facebook',
    href: 'https://facebook.com/kristinwithaneye',
    icon: 'facebook'
  },
  {
    name: 'Pinterest',
    href: 'https://pinterest.com/kristinwithaneye',
    icon: 'pinterest'
  }
]
</script>