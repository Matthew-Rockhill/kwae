<template>
  <div>
    <!-- Hero Section -->
    <BaseSection background="white" padding="3xl" spacing="relaxed">
      <div class="relative">
        <!-- Background decorative elements -->
        <div class="absolute -top-20 -right-20 w-40 h-40 bg-[var(--color-secondary)]/5 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-20 -left-20 w-60 h-60 bg-[var(--color-accent)]/20 rounded-full blur-3xl"></div>
        
        <div class="relative max-w-5xl mx-auto text-center">
          <BaseHeading :level="1" align="center" :animate="true" class="mb-8">
            Photography <span class="font-cormorant italic font-normal text-[var(--color-secondary)]">Packages</span>
          </BaseHeading>
          <BaseText size="xl" weight="light" color="primary" leading="relaxed" align="center" class="max-w-4xl mx-auto mb-12">
            Every moment has a story worth telling. Whether it's the quiet connection between family members, 
            the joy of a celebration, or the powerful impact of your organisation's work, I'm here to capture 
            it with authenticity and heart.
          </BaseText>
          
          <!-- Quick Navigation -->
          <div class="flex flex-wrap justify-center gap-4">
            <a 
              href="#family-sessions"
              class="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm border border-[var(--color-text)]/10 rounded-full text-[var(--color-text)] hover:bg-[var(--color-accent)]/20 hover:border-[var(--color-secondary)]/30 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Portrait & Family
            </a>
            <a 
              href="#lifestyle-events"
              class="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm border border-[var(--color-text)]/10 rounded-full text-[var(--color-text)] hover:bg-[var(--color-accent)]/20 hover:border-[var(--color-secondary)]/30 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Lifestyle & Events
            </a>
            <a 
              href="#wedding-photography"
              class="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm border border-[var(--color-text)]/10 rounded-full text-[var(--color-text)] hover:bg-[var(--color-accent)]/20 hover:border-[var(--color-secondary)]/30 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Wedding Photography
            </a>
            <a 
              href="#organisation-storytelling"
              class="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm border border-[var(--color-text)]/10 rounded-full text-[var(--color-text)] hover:bg-[var(--color-accent)]/20 hover:border-[var(--color-secondary)]/30 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              NGO Storytelling
            </a>
          </div>
        </div>
      </div>
    </BaseSection>
      
    <!-- Personal Photography Section -->
    <PortraitFamilySection @book-package="openBookingModal" />
      
    <!-- Lifestyle & Events Section -->
    <LifestyleEventsSection @book-package="openBookingModal" />
      
    <!-- Wedding Photography Section -->
    <WeddingSection @book-package="openBookingModal" />
      
    <!-- Organisation Section -->
    <OrganisationSection @book-package="openBookingModal" />
    
    <!-- CTA Section -->
    <BaseSection background="alabaster" padding="xl" spacing="normal">
      <CallToActionSection
        custom-heading='Interested in <span class="font-cormorant italic font-normal text-[var(--color-secondary)]">working together?</span>'
        description="Every story is unique, and I'd love to help you tell yours. If you're unsure which package fits your needs or if you'd like a custom quote, let's chat!"
        :primary-action="{ text: 'Book Your Session', type: 'button' }"
        :show-voucher-action="true"
        @primary-click="openBookingModal"
        @voucher-click="openVoucherModal"
      />
    </BaseSection>

    <!-- Booking Modal -->
    <BookingModal
      :is-open="showBookingModal"
      :pre-selected-package="selectedPackageAction"
      @close="closeBookingModal"
    />
    
    <!-- Voucher Modal -->
    <VoucherModal
      :is-open="showVoucherModal"
            @close="closeVoucherModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import BookingModal from '@/components/BookingModal.vue'
import VoucherModal from '@/components/VoucherModal.vue'
import CallToActionSection from '@/components/ui/CallToActionSection.vue'
import PortraitFamilySection from '@/components/packages/PortraitFamilySection.vue'
import LifestyleEventsSection from '@/components/packages/LifestyleEventsSection.vue'
import WeddingSection from '@/components/packages/WeddingSection.vue'
import OrganisationSection from '@/components/packages/OrganisationSection.vue'
import BaseSection from '@/components/ui/BaseSection.vue'
import BaseHeading from '@/components/ui/BaseHeading.vue'
import BaseText from '@/components/ui/BaseText.vue'

const route = useRoute()
const showBookingModal = ref(false)
const selectedPackageAction = ref('')

// Handle anchor scrolling on page load
onMounted(() => {
  // Small delay to ensure the page is fully rendered
  setTimeout(() => {
    if (route.hash) {
      const element = document.querySelector(route.hash)
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        })
      }
    }
  }, 100)
})

const openBookingModal = (packageAction?: string) => {
  selectedPackageAction.value = packageAction || ''
  showBookingModal.value = true
}

const closeBookingModal = () => {
  showBookingModal.value = false
  selectedPackageAction.value = ''
}

// Voucher modal state
const showVoucherModal = ref(false)

const openVoucherModal = () => {
  showVoucherModal.value = true
}

const closeVoucherModal = () => {
  showVoucherModal.value = false
}


// Package data (commented out - not currently used)
/*
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
    ],
    image: {
      src: new URL('@/assets/images/family/dsc-0167.jpg', import.meta.url).href,
      alt: 'Family mini session'
    }
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
    ],
    image: {
      src: new URL('@/assets/images/family/dsc-0128.jpg', import.meta.url).href,
      alt: 'Family full session'
    }
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
    ],
    image: {
      src: new URL('@/assets/images/family/dsc-0207.jpg', import.meta.url).href,
      alt: 'Golden hour family session'
    }
  }
]

// const lifestylePackages = [
/*
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
    ],
    image: {
      src: new URL('@/assets/images/lifestyle/rockpooling/Copy of DSC_0027.jpg', import.meta.url).href,
      alt: 'Lifestyle and events photography'
    }
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
    ],
    image: {
      src: new URL('@/assets/images/lifestyle/traditional-wedding/Copy of DSC_0027.jpg', import.meta.url).href,
      alt: 'Wedding photography'
    }
  }
]
*/

// const organizationPackages = [
/*
  {
    title: 'The Raw Thread',
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
    ],
    image: {
      src: new URL('@/assets/images/NGO-storytelling/Sozo Foundation Case Study Images54.jpg', import.meta.url).href,
      alt: 'NGO short story package'
    }
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
    ],
    image: {
      src: new URL('@/assets/images/NGO-storytelling/Sozo Foundation Case Study Images40.jpg', import.meta.url).href,
      alt: 'NGO campaigns and reports'
    }
  },
  {
    title: 'The Footpath Journey',
    subtitle: 'Long-Term Partnership',
    price: 'From R6,000/month',
    description: 'Ideal for organisations with ongoing work and a story to tell across seasons.',
    features: [
      'Monthly or quarterly sessions',
      'Ongoing image library',
      'Visual + written story support for reports, donors & social',
      'Optional story-mapping and mentoring'
    ],
    buttons: [
      { text: 'Book Now', action: 'book-footpath', variant: 'primary' as const }
    ],
    image: {
      src: new URL('@/assets/images/NGO-storytelling/Sozo Foundation Case Study Images65.jpg', import.meta.url).href,
      alt: 'NGO long-term partnership'
    }
  }
]
*/
</script>