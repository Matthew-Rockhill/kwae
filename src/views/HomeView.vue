<template>
  <div>
    <HeroSection />
    <AboutSection />
    <PortfolioPreview />
    <PackagesPreview />
    
    <!-- Testimonials Section -->
    <section class="py-24 md:py-32 bg-white">
      <div class="container-custom">
        <div class="text-center max-w-3xl mx-auto mb-16">
          <h2 class="text-3xl md:text-4xl font-extralight text-[#33423C] mb-6">
            What <span class="font-cormorant italic font-normal text-[#6A7D72]">Clients Say</span>
          </h2>
          <p class="text-[#6A7D72] text-lg font-light leading-relaxed">
            The stories and experiences shared by those who have trusted me to capture their special moments.
          </p>
        </div>
        
        <!-- Testimonials Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="(testimonial, index) in testimonials" :key="index"
               class="bg-[#F6F2ED] p-8 elegant-shadow flex flex-col">
            
            <div class="text-[#DCCDC3] mb-6">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.4 24H8V32.4H16.4V40.8H24.8V24H14.4V19.2C14.4 14.4 18.8 12 24 12V4.80005C13.6 4.80005 6.4 12 6.4 22.4V24H14.4ZM38.4 24H32V32.4H40.4V40.8H48.8V24H38.4V19.2C38.4 14.4 42.8 12 48 12V4.80005C37.6 4.80005 30.4 12 30.4 22.4V24H38.4Z" fill="currentColor"/>
              </svg>
            </div>
            
            <p class="text-[#33423C] font-light italic mb-8 flex-grow">{{ testimonial.text }}</p>
            
            <div class="flex items-center h-16">
              <!-- Placeholder avatar if image not available -->
              <div class="w-12 h-12 rounded-full overflow-hidden mr-4 bg-[#DCCDC3] flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-[#6A7D72]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h4 class="font-medium text-[#33423C]">{{ testimonial.name }}</h4>
                <p class="text-sm text-[#6A7D72]">{{ testimonial.title }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Contact CTA Section -->
    <section class="py-16 md:py-24 bg-[#F6F2ED] text-[#33423C]">
      <div class="container-custom text-center">
        <h2 class="text-3xl md:text-4xl font-extralight mb-8">
          Ready to <span class="font-cormorant italic font-normal text-[#6A7D72]">Tell Your Story?</span>
        </h2>
        <p class="text-lg max-w-2xl mx-auto mb-10 text-[#6A7D72] font-light">
          Let's work together to capture your authentic moments and create beautiful memories that last a lifetime.
        </p>
        <router-link to="/contact">
          <button class="bg-[#33423C] hover:bg-[#6A7D72] text-[#F6F2ED] font-medium py-3 px-8 transition duration-300 uppercase tracking-wider">
            Book Your Session Today
          </button>
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import HeroSection from '@/components/home/HeroSection.vue'
import AboutSection from '@/components/home/AboutSection.vue'
import PortfolioPreview from '@/components/home/PortfolioPreview.vue'
import PackagesPreview from '@/components/home/PackagesPreview.vue'

// Sample testimonials (replace with real data later)
const testimonials = ref([
  {
    text: "Kristin has an incredible gift for capturing authentic moments. Our family photos are more than just pictures—they tell our story in the most beautiful way.",
    name: "Sarah Johnson",
    title: "Family Session",
    avatar: "/images/testimonial-1.jpg"
  },
  {
    text: "Working with Kristin on our NGO's visual storytelling project was transformative. Her photos conveyed our mission with such emotional depth and authenticity.",
    name: "David Clarke",
    title: "Hope Foundation Director",
    avatar: "/images/testimonial-2.jpg"
  },
  {
    text: "I was nervous about our maternity photoshoot, but Kristin made us feel so comfortable and natural. The photos captured this special time in our lives perfectly.",
    name: "Emma Wilson",
    title: "Maternity Session",
    avatar: "/images/testimonial-3.jpg"
  }
])
</script>