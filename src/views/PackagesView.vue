<template>
  <div>
    <!-- Page Header -->
    <BaseSection background="light" padding="xl">
      <div class="max-w-3xl mx-auto text-center">
        <BaseHeading :level="1" align="center" class="mb-6">
          Photography <span class="font-cormorant italic font-normal text-[var(--color-text)]">Packages</span>
        </BaseHeading>
        <BaseText size="lg" weight="light" color="muted" leading="relaxed" align="center">
          Every moment has a story worth telling. Whether it's the quiet connection between family members, 
          the joy of a celebration, or the powerful impact of your organisation's work, I'm here to capture 
          it with authenticity and heart.
        </BaseText>
      </div>
    </BaseSection>
      
    <!-- Personal Photography Section -->
    <section id="family-sessions" class="py-16 md:py-24 bg-[var(--color-accent)]">
      <div class="container-custom">
        <div class="text-center max-w-3xl mx-auto mb-16">
          <BaseHeading :level="2" class="mb-4">Portrait & Family Sessions</BaseHeading>
          <p class="text-[var(--color-text)]/70 text-lg font-light">
            Earthy, heart-led storytelling for individuals, couples, and families.
          </p>
          <p class="text-[var(--color-secondary)] text-sm font-light mt-4 italic">
            *Travel beyond 50km from Cape Town may include an additional fee.
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <PackagePreviewCard
            v-for="pkg in portraitPackages"
            :key="pkg.title"
            :title="pkg.title"
            :subtitle="pkg.subtitle"
            :price="pkg.price"
            :description="pkg.description"
            :features="pkg.features"
            :buttons="pkg.buttons"
            :image="pkg.image"
            @button-click="openBookingModal"
          />
        </div>
      </div>
    </section>
      
    <!-- Lifestyle Photography Section -->
    <section id="lifestyle-events" class="py-16 md:py-24 bg-[var(--color-light)]">
      <div class="container-custom">
        <div class="text-center max-w-3xl mx-auto mb-16">
          <BaseHeading :level="2" class="mb-4">
            Lifestyle, Events & <span class="font-cormorant italic font-normal text-[var(--color-text)]">Weddings</span>
          </BaseHeading>
          <p class="text-[var(--color-text)]/70 text-lg font-light">
            For celebrations, content creation, and soulful wedding documentation.
          </p>
          <p class="text-[var(--color-secondary)] text-sm font-light mt-4 italic">
            *Travel beyond 50km from Cape Town may include an additional fee.
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <PackagePreviewCard
            v-for="pkg in lifestylePackages"
            :key="pkg.title"
            :title="pkg.title"
            :subtitle="pkg.subtitle"
            :price="pkg.price"
            :description="pkg.description"
            :features="pkg.features"
            :buttons="pkg.buttons"
            :image="pkg.image"
            @button-click="openBookingModal"
          />
        </div>
      </div>
    </section>
      
    <!-- Organisation Section -->
    <section id="organisation-storytelling" class="py-16 md:py-24 bg-[var(--color-accent)]">
      <div class="container-custom">
        <div class="text-center max-w-3xl mx-auto mb-16">
          <BaseHeading :level="2" class="mb-4">Storytelling for Organisations — The Impact Box</BaseHeading>
          <p class="text-[var(--color-text)]/70 text-lg font-light">
            For NGOs, foundations, and changemakers seeking authentic, visual storytelling.
          </p>
          <p class="text-[var(--color-secondary)] text-sm font-light mt-4 italic">
            Each package includes access to an Impact Toolkit — a resource to help amplify your story through images, words, and strategy.
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <PackagePreviewCard
            v-for="pkg in organizationPackages"
            :key="pkg.title"
            :title="pkg.title"
            :subtitle="pkg.subtitle"
            :price="pkg.price"
            :description="pkg.description"
            :features="pkg.features"
            :buttons="pkg.buttons"
            :image="pkg.image"
            :uniform-height="true"
            @button-click="openBookingModal"
          />
        </div>
      </div>
    </section>
    
    <!-- CTA Section -->
    <BaseSection background="light" padding="lg">
      <div class="text-center">
        <BaseHeading :level="2" align="center" class="mb-6">Interested in working together?</BaseHeading>
        <BaseText size="lg" color="primary" :opacity="90" class="max-w-2xl mx-auto mb-10" align="center">
          "Every story is unique, and I'd love to help you tell yours. If you're unsure which package fits
          your needs or if you'd like a custom quote, let's chat!"
        </BaseText>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <router-link to="/contact">
            <BaseButton variant="primary">Contact Me</BaseButton>
          </router-link>
          <a 
            href="https://www.instagram.com/kristin_with.an.eye/" 
            target="_blank"
          >
            <BaseButton variant="secondary">Follow My Work @kristin_with.an.eye</BaseButton>
          </a>
        </div>
      </div>
    </BaseSection>

    <!-- Booking Modal -->
    <BookingModal
      :is-open="showBookingModal"
      :pre-selected-package="selectedPackageAction"
      @close="closeBookingModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import PackagePreviewCard from '@/components/PackagePreviewCard.vue'
import BookingModal from '@/components/BookingModal.vue'
import BaseSection from '@/components/ui/BaseSection.vue'
import BaseHeading from '@/components/ui/BaseHeading.vue'
import BaseText from '@/components/ui/BaseText.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

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

const openBookingModal = (packageAction: string) => {
  selectedPackageAction.value = packageAction
  showBookingModal.value = true
}

const closeBookingModal = () => {
  showBookingModal.value = false
  selectedPackageAction.value = ''
}

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

const organizationPackages = [
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
</script>