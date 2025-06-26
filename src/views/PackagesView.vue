<template>
    <div>
      <!-- Page Header -->
    <section class="relative py-20 bg-[#F6F2ED]">
      <div class="container-custom">
        <div class="max-w-3xl mx-auto text-center">
          <h1 class="text-4xl md:text-5xl font-extralight text-[#33423C] mb-6">
            Photography <span class="font-cormorant italic font-normal text-[#6A7D72]">Packages</span>
          </h1>
          <p class="text-[#6A7D72] text-lg font-light leading-relaxed">
            Every moment has a story worth telling. Whether it's the quiet connection between family members, 
            the joy of a celebration, or the powerful impact of your organisation's work, I'm here to capture 
            it with authenticity and heart.
          </p>
        </div>
        </div>
      </section>
      
    <!-- Personal Photography Section -->
    <section class="py-16 md:py-24 bg-white">
        <div class="container-custom">
        <div class="text-center max-w-3xl mx-auto mb-16">
          <h2 class="text-3xl md:text-4xl font-extralight text-[#33423C] mb-4">Portrait & Family Sessions</h2>
          <p class="text-[#6A7D72] text-lg font-light">
            Earthy, heart-led storytelling for individuals, couples, and families.
          </p>
          <p class="text-[#6A7D72] text-sm font-light mt-4 italic">
            *Travel beyond 50km from Cape Town may include an additional fee.
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <PackageCard
            v-for="pkg in portraitPackages"
            :key="pkg.title"
            :title="pkg.title"
            :subtitle="pkg.subtitle"
            :price="pkg.price"
            :description="pkg.description"
            :features="pkg.features"
            :buttons="pkg.buttons"
            @button-click="handleButtonClick"
          />
        </div>

        <div class="text-center mt-16">
          <h3 class="text-xl font-light text-[#6A7D72] mb-4">Need something custom?</h3>
          <p class="text-[#6A7D72] mb-8">
            Every story is unique. Let's create something that fits your rhythm.
          </p>
          <button class="bg-[#33423C] hover:bg-[#2A3630] text-[#F6F2ED] transition-all duration-300 px-8 py-3 rounded-none uppercase tracking-wider">
            Start a Conversation
          </button>
          </div>
        </div>
      </section>
      
    <!-- Lifestyle Photography Section -->
    <section class="py-16 md:py-24 bg-[#F6F2ED]">
      <div class="container-custom">
        <div class="text-center max-w-3xl mx-auto mb-16">
          <h2 class="text-3xl md:text-4xl font-extralight text-[#33423C] mb-4">
            Lifestyle, Events & <span class="font-cormorant italic font-normal text-[#6A7D72]">Weddings</span>
          </h2>
          <p class="text-[#6A7D72] text-lg font-light">
            For celebrations, content creation, and soulful wedding documentation.
          </p>
          <p class="text-[#6A7D72] text-sm font-light mt-4 italic">
            *Travel beyond 50km from Cape Town may include an additional fee.
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <PackageCard
            v-for="pkg in lifestylePackages"
            :key="pkg.title"
            :title="pkg.title"
            :subtitle="pkg.subtitle"
            :price="pkg.price"
            :description="pkg.description"
            :features="pkg.features"
            :buttons="pkg.buttons"
            @button-click="handleButtonClick"
          />
        </div>
      </div>
    </section>
      
    <!-- Organisation Section -->
    <section class="py-16 md:py-24 bg-white">
      <div class="container-custom">
        <div class="text-center max-w-3xl mx-auto mb-16">
          <h2 class="text-3xl md:text-4xl font-extralight text-[#33423C] mb-4">Storytelling for Organisations — The Impact Box</h2>
          <p class="text-[#6A7D72] text-lg font-light">
            For NGOs, foundations, and changemakers seeking authentic, visual storytelling.
          </p>
          <p class="text-[#6A7D72] text-sm font-light mt-4 italic">
            Each package includes access to an Impact Toolkit — a resource to help amplify your story through images, words, and strategy.
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <PackageCard
            v-for="pkg in organizationPackages"
            :key="pkg.title"
            :title="pkg.title"
            :subtitle="pkg.subtitle"
            :price="pkg.price"
            :additional-pricing="pkg.additionalPricing"
            :description="pkg.description"
            :features="pkg.features"
            :buttons="pkg.buttons"
            @button-click="handleButtonClick"
          />
        </div>
      </div>
    </section>
    
    <!-- CTA Section -->
    <section class="py-16 md:py-20 bg-[#DCCDC3] text-[#33423C]">
      <div class="container-custom text-center">
        <h2 class="text-3xl md:text-4xl font-extralight mb-6">Interested in working together?</h2>
        <p class="text-lg md:text-xl max-w-2xl mx-auto mb-10 text-[#33423C]/90">
          "Every story is unique, and I'd love to help you tell yours. If you're unsure which package fits
          your needs or if you'd like a custom quote, let's chat!"
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <router-link to="/contact">
            <button class="bg-[#33423C] hover:bg-[#2A3630] text-[#F6F2ED] transition-all duration-300 px-8 py-3 rounded-none uppercase tracking-wider">
              Contact Me
            </button>
            </router-link>
          <a 
            href="https://instagram.com/kristinwithaneye" 
            target="_blank" 
            class="bg-transparent hover:bg-[#33423C]/20 text-[#33423C] border border-[#33423C] transition-all duration-300 px-8 py-3 rounded-none uppercase tracking-wider inline-block"
          >
              Follow My Work @kristinwithaneye
            </a>
          </div>
        </div>
      </section>
    </div>
  </template>
  
  <script setup lang="ts">
import PackageCard from '@/components/PackageCard.vue'

// Package data
const portraitPackages = [
  {
    title: 'Dust & Light',
    subtitle: 'Mini Session',
    price: 'R1,500',
    description: 'A short and sweet storytelling session - perfect for seasonal milestones or quick connection.',
    features: [
      '30-minute session',
      '30 edited high-resolution images',
      'Private online gallery'
    ],
    buttons: [
      { text: 'Book Now', action: 'book-dust-light', variant: 'primary' as const }
    ]
  },
  {
    title: 'Field & Frame',
    subtitle: 'Full Session',
    price: 'R2,500',
    description: 'A grounded shoot to capture movement, connection, and personality in a beautiful setting.',
    features: [
      '60-minute session',
      '60 to 80 edited images',
      'Private online gallery'
    ],
    buttons: [
      { text: 'Book Now', action: 'book-field-frame', variant: 'primary' as const }
    ]
  },
  {
    title: 'Soil & Sun',
    subtitle: 'Golden Hour Session',
    price: 'R4,000',
    description: 'A flexible storytelling experience during the best light of the day.',
    features: [
      '90-minute session (sunrise or sunset)',
      '100+ edited images',
      'Multiple locations (within 50km)',
      'Sneak peek within 24 hours',
      'Private online gallery'
    ],
    buttons: [
      { text: 'Book Now', action: 'book-soil-sun', variant: 'primary' as const }
    ]
  }
]

const lifestylePackages = [
  {
    title: 'Lifestyle & Events',
    subtitle: 'Birthdays, Gatherings & Content',
    price: 'From R1,500/hour',
    description: 'Perfect for birthdays, baby showers, gatherings, or creative content creation.',
    features: [
      'Candid, documentary-style coverage',
      'Edited, high-res images for print & social media',
      'Custom pricing based on event duration & location',
      'Professional editing included'
    ],
    buttons: [
      { text: 'Book Now', action: 'book-lifestyle-event', variant: 'primary' as const }
    ]
  },
  {
    title: 'Wedding Photography',
    subtitle: 'Authentic Wedding Storytelling',
    price: 'Custom Packages',
    description: 'Authentic, natural storytelling for your wedding day. Whether you\'re planning an intimate elopement or a full celebration, I offer custom wedding photography with a documentary approach, capturing quiet moments, golden light, and real connection.',
    features: [
      'Flexible coverage options (4 hours to full-day)',
      'High-resolution, edited image gallery',
      'Optional sneak peeks and printed albums',
      'Custom packages available'
    ],
    buttons: [
      { text: 'Request a Wedding Quote', action: 'wedding-quote', variant: 'primary' as const }
    ]
  }
]

const organizationPackages = [
  {
    title: 'Raw Thread',
    subtitle: 'Short Story Package',
    price: 'R4,000',
    description: 'Ideal for events, new launches, or a content refresh.',
    features: [
      'Half-day shoot',
      '50 edited images',
      'Social media captioning or visual theme guidance'
    ],
    buttons: [
      { text: 'Book Now', action: 'book-raw-thread', variant: 'primary' as const }
    ]
  },
  {
    title: 'The Narrative Journey',
    subtitle: 'Campaigns & Reports',
    price: 'R6,500',
    description: 'For deeper storytelling: campaigns, milestones, or annual reports.',
    features: [
      'Full-day shoot',
      '50–70 edited images',
      'Written narrative overview or social media caption set',
      'Planning call to align direction'
    ],
    buttons: [
      { text: 'Book Now', action: 'book-narrative', variant: 'primary' as const }
    ]
  },
  {
    title: 'The Footpath Journey',
    subtitle: 'Long-Term Partnership',
    price: 'From R4,500 per visit',
    additionalPricing: 'Retainer options: R6,000–R12,000/month',
    description: 'Ideal for organisations with ongoing work and a story to tell across seasons.',
    features: [
      'Monthly or quarterly sessions',
      'Ongoing image library',
      'Visual + written story support for reports, donors & social',
      'Optional story-mapping and mentoring'
    ],
    buttons: [
      { text: 'Book Now', action: 'book-footpath', variant: 'primary' as const }
    ]
  }
]

const handleButtonClick = (action: string) => {
  console.log('Button clicked:', action)
  // Handle different actions here
}
  </script>