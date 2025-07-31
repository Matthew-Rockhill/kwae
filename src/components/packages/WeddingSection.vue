<template>
  <BaseSection id="wedding-photography" background="accent" padding="3xl" spacing="relaxed">
    <!-- Header -->
    <div class="text-center max-w-4xl mx-auto mb-16">
      <BaseHeading :level="2" align="center" class="mb-6">
        Wedding <span class="font-cormorant italic font-normal text-[var(--color-secondary)]">Photography</span>
      </BaseHeading>
      <BaseText size="lg" color="primary" weight="light" leading="relaxed" align="center" class="mb-4">
        Authentic, natural storytelling for your wedding day. Whether you're planning an intimate elopement or a full celebration, I offer custom wedding photography with a documentary approach, capturing quiet moments, golden light, and real connection.
      </BaseText>
      <BaseText size="sm" color="primary" :opacity="60" weight="light" align="center" class="italic">
        Each wedding is unique - let's create a custom package that fits your vision and budget.
      </BaseText>
    </div>

    <!-- Simple Info Cards -->
    <div class="max-w-4xl mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <!-- Custom Packages Card -->
        <div class="bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-center items-center h-full">
          <h3 class="text-lg font-medium text-[var(--color-text)] mb-2">Custom Packages</h3>
          <p class="text-3xl font-semibold text-[var(--color-secondary)]">Tailored for You</p>
          <p class="text-sm text-[var(--color-text)]/60 mt-2 text-center">From intimate elopements to full-day celebrations</p>
        </div>
        
        <!-- What's Included Card -->
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <h3 class="text-lg font-medium text-[var(--color-text)] mb-3">What's Included</h3>
          <ul class="space-y-2 text-sm text-[var(--color-text)]/70">
            <li>• Flexible coverage options (4 hours to full-day)</li>
            <li>• High-resolution, professionally edited gallery</li>
            <li>• Documentary-style storytelling approach</li>
            <li>• Optional sneak peeks and printed albums</li>
          </ul>
        </div>
      </div>
      
      <!-- Book Button -->
      <div class="text-center">
        <BaseButton
          variant="primary"
          size="lg"
          class="shadow-lg hover:shadow-xl transition-all duration-300 px-12"
          @click="$emit('book-package', 'wedding-quote')"
        >
          Request Wedding Quote
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