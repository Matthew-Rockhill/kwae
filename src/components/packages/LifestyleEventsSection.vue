<template>
  <BaseSection id="lifestyle-events" background="white" padding="3xl" spacing="relaxed">
    <!-- Header -->
    <div class="text-center max-w-4xl mx-auto mb-16">
      <BaseHeading :level="2" align="center" class="mb-6">
        Lifestyle & <span class="font-cormorant italic font-normal text-[var(--color-secondary)]">Events</span>
      </BaseHeading>
      <BaseText size="lg" color="primary" weight="light" leading="relaxed" align="center" class="mb-4">
        Want to capture a special moment or remember your celebration? Book me on a flexible hourly rate that's suited to your needs. Perfect for birthday parties, baby showers, corporate events, content creation, and special gatherings.
      </BaseText>
      <BaseText size="sm" color="primary" :opacity="60" weight="light" align="center" class="italic">
        Travel fees may apply for locations over 50km from Cape Town.
      </BaseText>
    </div>

    <!-- Simple Info Cards -->
    <div class="max-w-4xl mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <!-- Pricing Card -->
        <div class="bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-center items-center h-full">
          <h3 class="text-lg font-medium text-[var(--color-text)] mb-2">Flexible Pricing</h3>
          <p class="text-3xl font-semibold text-[var(--color-secondary)]">From R1,500/hour</p>
        </div>
        
        <!-- What's Included Card -->
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <h3 class="text-lg font-medium text-[var(--color-text)] mb-3">What's Included</h3>
          <ul class="space-y-2 text-sm text-[var(--color-text)]/70">
            <li>• Candid, documentary-style photography</li>
            <li>• Professional editing of all images</li>
            <li>• High-resolution files for print & digital</li>
            <li>• Custom pricing for extended events</li>
          </ul>
        </div>
      </div>
      
      <!-- Book Button -->
      <div class="text-center">
        <BaseButton
          variant="primary"
          size="lg"
          class="shadow-lg hover:shadow-xl transition-all duration-300 px-12"
          @click="$emit('book-package', 'book-lifestyle-event')"
        >
          Book Event Coverage
        </BaseButton>
      </div>
    </div>
  </BaseSection>
</template>

<script setup lang="ts">
import BaseSection from '@/components/ui/BaseSection.vue'
import BaseHeading from '@/components/ui/BaseHeading.vue'
import BaseText from '@/components/ui/BaseText.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

defineEmits<{
  'book-package': [action: string]
}>()
</script>