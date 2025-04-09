<template>
    <div>
      <!-- Page Header -->
      <section class="relative py-20 bg-[#F6F2ED]">
        <div class="container-custom text-center">
          <h1 class="font-montserrat font-extralight text-4xl md:text-5xl text-[#33423C] mb-4">Photography Packages – Capturing Moments, Telling Stories</h1>
          <p class="text-lg text-[#6A7D72] max-w-3xl mx-auto">
            I offer a range of photography packages designed to meet your unique needs. Whether you're looking for a mini 
            session, family portraits, or visual storytelling for a business or NGO, each package is created with heart 
            and authenticity.
          </p>
        </div>
      </section>
      
      <!-- Package Categories Navigation -->
      <section class="py-8 border-b border-[#DCCDC3]">
        <div class="container-custom">
          <div class="flex flex-wrap justify-center gap-4">
            <button 
              v-for="(tab, index) in tabs" 
              :key="index"
              @click="activeTab = index"
              class="px-6 py-3 font-medium transition-colors"
              :class="activeTab === index ? 
                'bg-[#33423C] text-[#F6F2ED]' : 
                'bg-[#F6F2ED] text-[#33423C] hover:bg-[#DCCDC3]/20'"
            >
              {{ tab.name }}
            </button>
          </div>
        </div>
      </section>
      
      <!-- Packages Section -->
      <section class="py-16 bg-white">
        <div class="container-custom">
          <div v-if="activeTab === 0">
            <!-- Personal Photography Packages -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div v-for="(pkg, index) in personalPackages" :key="index" 
                   class="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[#DCCDC3]/20 flex flex-col">
                <!-- Package Header -->
                <div class="relative bg-gradient-to-br from-[#F6F2ED]/90 to-[#DCCDC3]/70 p-8">
                  <div class="text-center text-[#33423C]">
                    <h3 class="font-montserrat text-2xl">{{ pkg.title }}</h3>
                    <p class="text-[#6A7D72]/90 mt-2 font-light">{{ pkg.subtitle }}</p>
                    <div class="mt-4 flex items-center justify-center gap-2">
                      <span class="text-3xl font-bold">{{ pkg.price }}</span>
                      <span class="text-[#6A7D72]/90 text-sm">{{ pkg.priceNote }}</span>
                    </div>
                  </div>
                </div>
                
                <!-- Package Details -->
                <div class="p-8 flex-1 flex flex-col">
                  <div class="flex-1">
                    <div class="mb-6">
                      <h4 class="text-[#33423C] font-medium mb-4">What's Included:</h4>
                      <ul class="space-y-3">
                        <li v-for="(feature, i) in pkg.features" :key="i" class="flex items-start gap-3">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#6A7D72] shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                          </svg>
                          <span class="text-[#33423C]/80">{{ feature }}</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div v-if="pkg.notes" class="mb-6">
                      <p class="text-sm text-[#6A7D72] italic">{{ pkg.notes }}</p>
                    </div>
                  </div>
                  
                  <button 
                    @click="openBookingModal(pkg.title, 'Personal Photography')"
                    class="block w-full py-3 px-4 text-center rounded-lg bg-[#33423C] text-[#F6F2ED] hover:bg-[#6A7D72] transition-colors duration-300 mt-6">
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div v-if="activeTab === 1">
            <!-- Event Photography Packages -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div class="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[#DCCDC3]/20 flex flex-col">
                <!-- Package Header -->
                <div class="relative bg-gradient-to-br from-[#F6F2ED]/90 to-[#DCCDC3]/70 p-8">
                  <div class="text-center text-[#33423C]">
                    <h3 class="font-montserrat text-2xl">Lifestyle Photography</h3>
                    <p class="text-[#6A7D72]/90 mt-2 font-light">Ideal for birthdays, baby showers, and special gatherings</p>
                    <div class="mt-4 flex items-center justify-center gap-2">
                      <span class="text-3xl font-bold">R800 – R1,500</span>
                      <span class="text-[#6A7D72]/90 text-sm">per hour</span>
                    </div>
                  </div>
                </div>
                
                <!-- Package Details -->
                <div class="p-8 flex-1 flex flex-col">
                  <div class="flex-1">
                    <div class="mb-6">
                      <h4 class="text-[#33423C] font-medium mb-4">What's Included:</h4>
                      <ul class="space-y-3">
                        <li v-for="(feature, i) in eventFeatures" :key="i" class="flex items-start gap-3">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#6A7D72] shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                          </svg>
                          <span class="text-[#33423C]/80">{{ feature }}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <button 
                    @click="openBookingModal('Lifestyle Photography', 'Event Coverage')"
                    class="block w-full py-3 px-4 text-center rounded-lg bg-[#33423C] text-[#F6F2ED] hover:bg-[#6A7D72] transition-colors duration-300 mt-6">
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div v-if="activeTab === 2">
            <!-- Organisation Packages -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <!-- One-Time Package -->
              <div class="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[#DCCDC3]/20 flex flex-col">
                <!-- Package Header -->
                <div class="relative bg-gradient-to-br from-[#F6F2ED]/90 to-[#DCCDC3]/70 p-8">
                  <div class="text-center text-[#33423C]">
                    <h3 class="font-montserrat text-2xl">One-Time Storytelling Project</h3>
                    <p class="text-[#6A7D72]/90 mt-2 font-light">Perfect for specific campaigns or events</p>
                    <div class="mt-4 flex items-center justify-center gap-2">
                      <span class="text-3xl font-bold">R4,000</span>
                      <span class="text-[#6A7D72]/90 text-sm">starting from</span>
                    </div>
                  </div>
                </div>
                
                <!-- Package Details -->
                <div class="p-8 flex-1 flex flex-col">
                  <div class="flex-1">
                    <div class="mb-6">
                      <h4 class="text-[#33423C] font-medium mb-4">What's Included:</h4>
                      <ul class="space-y-3">
                        <li v-for="(feature, i) in ngoOnTimeFeatures" :key="i" class="flex items-start gap-3">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#6A7D72] shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                          </svg>
                          <span class="text-[#33423C]/80">{{ feature }}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <button 
                    @click="openBookingModal('One-Time Storytelling Project', 'Organisation')"
                    class="block w-full py-3 px-4 text-center rounded-lg bg-[#33423C] text-[#F6F2ED] hover:bg-[#6A7D72] transition-colors duration-300 mt-6">
                    Book Now
                  </button>
                </div>
              </div>
              
              <!-- Ongoing Partnership -->
              <div class="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[#DCCDC3]/20 flex flex-col">
                <!-- Package Header -->
                <div class="relative bg-gradient-to-br from-[#F6F2ED]/90 to-[#DCCDC3]/70 p-8">
                  <div class="text-center text-[#33423C]">
                    <h3 class="font-montserrat text-2xl">Ongoing Storytelling Partnership</h3>
                    <p class="text-[#6A7D72]/90 mt-2 font-light">For consistent visual presence</p>
                    <div class="mt-4 flex items-center justify-center gap-2">
                      <span class="text-3xl font-bold">Custom</span>
                      <span class="text-[#6A7D72]/90 text-sm">Monthly Retainer</span>
                    </div>
                  </div>
                </div>
                
                <!-- Package Details -->
                <div class="p-8 flex-1 flex flex-col">
                  <div class="flex-1">
                    <div class="mb-6">
                      <h4 class="text-[#33423C] font-medium mb-4">What's Included:</h4>
                      <ul class="space-y-3">
                        <li v-for="(feature, i) in ngoOngoingFeatures" :key="i" class="flex items-start gap-3">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#6A7D72] shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                          </svg>
                          <span class="text-[#33423C]/80">{{ feature }}</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div class="mb-6">
                      <p class="text-sm text-[#6A7D72] italic">
                        Ideal for organizations looking to build a consistent, impactful visual presence.
                      </p>
                    </div>
                  </div>
                  
                  <button 
                    @click="openBookingModal('Ongoing Storytelling Partnership', 'Organisation')"
                    class="block w-full py-3 px-4 text-center rounded-lg bg-[#33423C] text-[#F6F2ED] hover:bg-[#6A7D72] transition-colors duration-300 mt-6">
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- FAQ Section -->
      <section class="py-16 bg-gray-50">
        <div class="container-custom">
          <div class="max-w-3xl mx-auto">
            <h2 class="section-title text-center mb-16">Frequently Asked Questions</h2>
            
            <div class="space-y-6">
              <div v-for="(faq, index) in faqs" :key="index" class="bg-white rounded-lg shadow-md overflow-hidden">
                <button 
                  @click="toggleFaq(index)"
                  class="w-full text-left p-6 flex justify-between items-center focus:outline-none"
                >
                  <h3 class="text-lg font-medium text-gray-800">{{ faq.question }}</h3>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    class="h-5 w-5 text-amber-600 transition-transform" 
                    :class="{ 'transform rotate-180': openFaqs.includes(index) }"
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div 
                  v-show="openFaqs.includes(index)"
                  class="px-6 pb-6 text-gray-600"
                >
                  <p>{{ faq.answer }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Contact CTA -->
      <section class="py-16 md:py-20 bg-white">
        <div class="container-custom text-center">
          <h2 class="text-3xl font-bold mb-6">Interested in working together?</h2>
          <p class="text-lg max-w-2xl mx-auto mb-10 text-gray-600">
            Every story is unique, and I'd love to help you tell yours. If you're unsure which package fits
            your needs or if you'd like a custom quote, let's chat!
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <router-link to="/contact" class="btn-primary">
              Contact Me
            </router-link>
            <a href="https://instagram.com/kristinwithaneye" target="_blank" class="btn-secondary">
              Follow My Work @kristinwithaneye
            </a>
          </div>
        </div>
      </section>

      <!-- Booking Modal -->
      <BookingModal
        :is-open="showBookingModal"
        :package-title="selectedPackage.title"
        :package-type="selectedPackage.type"
        @close="closeBookingModal"
      />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'
  import BookingModal from '@/components/BookingModal.vue'
  
  // Tabs state
  const tabs = [
    { name: 'Personal Photography' },
    { name: 'Event Coverage' },
    { name: 'Organisation' }
  ]
  const activeTab = ref(0)
  
  // FAQs state
  const faqs = ref([
    {
      question: 'How far in advance should I book a photography session?',
      answer: 'I recommend booking at least 2-4 weeks in advance for personal and family sessions, and 1-2 months for events. For NGO storytelling projects, a 1-2 month lead time allows for proper planning and coordination.'
    },
    {
      question: 'What happens if it rains on the day of our outdoor session?',
      answer: 'Don\'t worry! If the weather doesn\'t cooperate, we\'ll reschedule your session at no additional cost. I\'m flexible and understand that some things are beyond our control.'
    },
    {
      question: 'How long until I receive my photos?',
      answer: 'For personal photography sessions, you\'ll receive your images within 2 weeks. Event coverage is delivered within 1-2 weeks. For NGO and business projects, delivery timelines are established based on project scope but typically range from 2-3 weeks.'
    },
    {
      question: 'Do you travel for photography sessions?',
      answer: 'Yes! I\'m happy to travel to your preferred location. Sessions within 50km of my base are included in the package price. For locations beyond that range, a travel fee may apply depending on the distance.'
    },
    {
      question: 'Can I purchase additional images beyond what\'s included in my package?',
      answer: 'Absolutely! Additional images are available for purchase at R100 per image or R500 for 10 additional images.'
    }
  ])
  const openFaqs = ref<number[]>([])
  
  // Package details
  const personalPackages = ref([
    {
      title: 'Mini Moments',
      subtitle: 'For authentic, beautiful memories',
      price: 'R1,200',
      priceNote: 'one-time payment',
      features: [
        '30-minute session',
        '50 professionally edited high-resolution images',
        'Private online gallery for easy downloads',
        'Extra images available for purchase'
      ],
      notes: ''
    },
    {
      title: 'Family Story',
      subtitle: 'For those heartfelt, real-life moments',
      price: 'R2,500',
      priceNote: 'one-time payment',
      features: [
        '60-minute session',
        '80+ professionally edited images',
        'Private online gallery for easy downloads',
        'Multiple outfit changes'
      ],
      notes: 'Travel beyond 50km may incur additional costs.'
    },
    {
      title: 'Golden Hour Experience',
      subtitle: 'For storytelling in its purest form',
      price: 'R4,000',
      priceNote: 'one-time payment',
      features: [
        '90-minute session (best at sunrise/sunset)',
        'All the best images (100+)',
        'Multiple locations (within 50km)',
        'Private online gallery for full-resolution downloads',
        'Priority editing (24-hour sneak peek available)'
      ],
      notes: ''
    }
  ])
  
  // Event features
  const eventFeatures = [
    'Candid, natural storytelling coverage',
    'High-resolution images, ready for print and social media',
    'Quick turnaround time (1-2 weeks)',
    'Professional editing with my signature earthy, authentic style',
    'Online gallery for easy sharing and downloading'
  ]
  
  // NGO features
  const ngoOnTimeFeatures = [
    'Half-day or full-day on-location shoot',
    '50+ high-quality images capturing impact and connection',
    'Short written piece (blog post, caption series, or marketing copy)',
    'Social media-ready visuals',
    'Private online gallery for easy access'
  ]
  
  const ngoOngoingFeatures = [
    'Regular on-location visits (monthly, quarterly, or milestone-based)',
    'Documentary-style photography showing real impact over time',
    'In-depth interviews & written narratives',
    'Social media content (photos + captions)',
    'High-resolution images for marketing, reports & donor engagement',
    'Optional video snippets for a well-rounded story'
  ]
  
  // Methods
  const toggleFaq = (index: number) => {
    if (openFaqs.value.includes(index)) {
      openFaqs.value = openFaqs.value.filter(i => i !== index)
    } else {
      openFaqs.value.push(index)
    }
  }

  const showBookingModal = ref(false)
  const selectedPackage = ref({
    title: '',
    type: ''
  })

  const openBookingModal = (title: string, type: string) => {
    selectedPackage.value = { title, type }
    showBookingModal.value = true
  }

  const closeBookingModal = () => {
    showBookingModal.value = false
  }
  </script>