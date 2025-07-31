<template>
  <div>
    <HeroSection @book-now="openBookingModal" />
    <BaseSection background="transparent" padding="2xl" spacing="relaxed">
      <AboutSection />
    </BaseSection>
    <BaseSection background="light" padding="2xl" spacing="relaxed">
      <PortfolioPreview />
    </BaseSection>
    <BaseSection background="accent" padding="2xl" spacing="relaxed">
      <PackagesPreview />
    </BaseSection>
    
    <!-- Testimonials Section -->
    <BaseSection background="light" padding="2xl" spacing="relaxed">
      <TestimonialsSection />
    </BaseSection>
    
    <!-- Contact CTA Section -->
    <BaseSection background="alabaster" padding="xl" spacing="normal">
      <CallToActionSection
        :primary-action="{ text: 'Book Your Session', type: 'button' }"
        @primary-click="openBookingModal"
        @voucher-click="handleVoucherClick"
      />
    </BaseSection>
    <BookingModal
      :is-open="showBookingModal"
      @close="closeBookingModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import HeroSection from '@/components/home/HeroSection.vue'
import AboutSection from '@/components/home/AboutSection.vue'
import PortfolioPreview from '@/components/home/PortfolioPreview.vue'
import PackagesPreview from '@/components/home/PackagesPreview.vue'
import TestimonialsSection from '@/components/home/TestimonialsSection.vue'
import CallToActionSection from '@/components/ui/CallToActionSection.vue'
import BaseSection from '@/components/ui/BaseSection.vue'
import BookingModal from '@/components/BookingModal.vue'

const showBookingModal = ref(false)
const openBookingModal = () => {
  showBookingModal.value = true
}
const closeBookingModal = () => {
  showBookingModal.value = false
}

const handleVoucherClick = () => {
  // TODO: Implement voucher functionality later
  console.log('Voucher clicked - functionality to be implemented')
}

</script>