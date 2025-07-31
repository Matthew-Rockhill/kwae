<template>
  <BaseSection id="family-sessions" background="accent" padding="3xl" spacing="relaxed">
    <!-- Header -->
    <div class="text-center max-w-4xl mx-auto mb-16">
      <BaseHeading :level="2" align="center" class="mb-6">
        Portrait & <span class="font-cormorant italic font-normal text-[var(--color-secondary)]">Family Sessions</span>
      </BaseHeading>
      <BaseText size="lg" color="primary" weight="light" leading="relaxed" align="center" class="mb-4">
        Earthy, heart-led storytelling for individuals, couples, and families. Choose your perfect session below – click on any package to see full details and book your date.
      </BaseText>
      <BaseText size="sm" color="primary" :opacity="60" weight="light" align="center" class="italic">
        Travel fees may apply for locations over 50km from Cape Town.
      </BaseText>
    </div>

    <!-- Horizontal Package List -->
    <div class="max-w-6xl mx-auto mb-12">
      <div class="flex flex-col sm:flex-row justify-center gap-4">
        <div
          v-for="(pkg, index) in packages" 
          :key="pkg.title"
          @click="selectPackage(index)"
          :class="[
            'p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 min-w-[280px] max-w-[320px]',
            selectedIndex === index 
              ? 'bg-white border-[var(--color-secondary)] shadow-lg' 
              : 'bg-white/50 border-[var(--color-text)]/10 hover:bg-white/80 hover:border-[var(--color-secondary)]/30'
          ]"
        >
          <div class="flex justify-between items-start">
            <div>
              <h3 class="text-lg font-medium text-[var(--color-text)] mb-1">{{ pkg.title }}</h3>
              <p class="text-sm text-[var(--color-text)]/60 italic">{{ pkg.subtitle }}</p>
            </div>
            <div class="text-right">
              <p class="text-xl font-semibold text-[var(--color-secondary)]">{{ pkg.price }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Two Column Layout -->
    <div class="max-w-6xl mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        
        <!-- Left Column - Image -->
        <div>
          <div class="rounded-2xl overflow-hidden shadow-xl" style="height: 520px;">
            <img 
              :src="selectedPackage.image.src" 
              :alt="selectedPackage.image.alt" 
              class="w-full h-full object-cover transition-opacity duration-500"
              :key="selectedPackage.title"
            />
          </div>
        </div>

        <!-- Right Column - Package Details -->
        <div style="height: 520px;">
          <PackageDetailCard
            :title="selectedPackage.title"
            :subtitle="selectedPackage.subtitle"
            :price="selectedPackage.price"
            :description="selectedPackage.description"
            :features="selectedPackage.features"
            @book-package="bookPackage"
          />
        </div>
      </div>
    </div>
  </BaseSection>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import BaseSection from '@/components/ui/BaseSection.vue'
import BaseHeading from '@/components/ui/BaseHeading.vue'
import BaseText from '@/components/ui/BaseText.vue'
import PackageDetailCard from '@/components/packages/PackageDetailCard.vue'

const emit = defineEmits<{
  'book-package': [action: string]
}>()

const selectedIndex = ref(0)

const packages = [
  {
    title: 'Dust & Light',
    subtitle: 'Mini Session',
    price: 'R1,500',
    description: 'A short and sweet storytelling session - perfect for seasonal milestones or quick connection.',
    features: [
      '30-minute session',
      '30 edited high-resolution images'
    ],
    action: 'book-dust-light',
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
      '60 to 80 edited images'
    ],
    action: 'book-field-frame',
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
      'Sneak peek within 24 hours'
    ],
    action: 'book-soil-sun',
    image: {
      src: new URL('@/assets/images/family/dsc-0207.jpg', import.meta.url).href,
      alt: 'Golden hour family session'
    }
  }
]

const selectedPackage = computed(() => packages[selectedIndex.value])

const selectPackage = (index: number) => {
  selectedIndex.value = index
}

const bookPackage = () => {
  emit('book-package', selectedPackage.value.action)
}

// Set first package as selected on mount
onMounted(() => {
  selectedIndex.value = 0
})
</script>