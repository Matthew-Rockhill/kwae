<template>
    <section class="py-24 md:py-32 bg-[#E6DFD7]">
      <div class="container-custom">
        <div class="text-center max-w-3xl mx-auto mb-16">
          <h2 class="text-3xl md:text-4xl font-extralight text-[#33423C] mb-6">
            Photography Packages & <span class="font-cormorant italic font-normal text-[#6A7D72]">Visual Storytelling</span>
          </h2>
          <p class="text-[#6A7D72] text-lg font-light leading-relaxed">
            Whether you're seeking timeless family portraits, a special event captured, or a storytelling
            project to amplify your business's mission, my packages are designed to meet your needs with
            creativity, care, and quality.
          </p>
        </div>
        
        <!-- Packages Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="(pkg, index) in packages" :key="index" 
               class="bg-white relative elegant-shadow hover:-translate-y-2 transition-transform duration-300">
            <!-- Package Header with Icon -->
            <div class="p-8 pb-4">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 bg-[#33423C] flex items-center justify-center">
                  <component :is="pkg.icon" class="w-5 h-5 text-[#DCCDC3]" />
                </div>
                <span class="block uppercase tracking-wider text-xs font-light text-[#6A7D72]">{{ pkg.label }}</span>
              </div>
              <h3 class="text-2xl font-light text-[#33423C] mb-2">{{ pkg.title }}</h3>
              <div class="bg-[#DCCDC3] h-px w-16 my-4"></div>
              <p class="text-xl text-[#33423C] font-cormorant italic">{{ pkg.price }}</p>
            </div>
            
            <!-- Package Content -->
            <div class="p-8 pt-4">
              <ul class="space-y-3 mb-8">
                <li v-for="(feature, i) in pkg.features" :key="i" class="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#6A7D72] mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  <span class="text-[#33423C] font-light">{{ feature }}</span>
                </li>
              </ul>
              
              <router-link to="/packages" class="block mt-auto">
                <button class="btn-primary w-full">
                  LEARN MORE
                </button>
              </router-link>
            </div>
          </div>
        </div>
        
        <!-- CTA Button -->
        <div class="text-center mt-12">
          <router-link to="/packages">
            <button class="btn-secondary">
              VIEW ALL PACKAGES
            </button>
          </router-link>
        </div>
      </div>
    </section>
  </template>
  
  <script setup lang="ts">
  import { ref, defineComponent, h, markRaw } from 'vue'
  
  // Create icon components outside of ref
  const MiniMomentsIcon = markRaw(defineComponent({
    render: () => h('svg', { 
      xmlns: 'http://www.w3.org/2000/svg', 
      fill: 'none', 
      viewBox: '0 0 24 24', 
      stroke: 'currentColor', 
      'stroke-width': '1.5',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    }, [
      h('path', { d: 'M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z' }),
      h('path', { d: 'M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z' })
    ])
  }))

  const FamilyStoryIcon = markRaw(defineComponent({
    render: () => h('svg', { 
      xmlns: 'http://www.w3.org/2000/svg', 
      fill: 'none', 
      viewBox: '0 0 24 24', 
      stroke: 'currentColor', 
      'stroke-width': '1.5',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    }, [
      h('path', { d: 'M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z' })
    ])
  }))

  const GoldenHourIcon = markRaw(defineComponent({
    render: () => h('svg', { 
      xmlns: 'http://www.w3.org/2000/svg', 
      fill: 'none', 
      viewBox: '0 0 24 24', 
      stroke: 'currentColor', 
      'stroke-width': '1.5',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    }, [
      h('path', { d: 'M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z' })
    ])
  }))

  // Package details with icons
  const packages = ref([
    {
      label: "For authentic memories",
      title: "Mini Moments",
      price: "Starting from R1,200",
      icon: MiniMomentsIcon,
      features: [
        "30-minute session",
        "50 professionally edited images",
        "Private online gallery",
        "Extra images available for purchase"
      ]
    },
    {
      label: "For real-life moments",
      title: "Family Story",
      price: "Starting from R2,500",
      icon: FamilyStoryIcon,
      features: [
        "60-minute session",
        "80+ professionally edited images",
        "Private online gallery",
        "Multiple outfit changes"
      ]
    },
    {
      label: "For the complete experience",
      title: "Golden Hour",
      price: "Starting from R4,000",
      icon: GoldenHourIcon,
      features: [
        "90-minute session at sunset",
        "100+ professionally edited images",
        "Multiple locations (within 50km)",
        "24-hour sneak peek available"
      ]
    }
  ])
  </script>