<template>
  <BaseSection id="organisation-storytelling" background="light" padding="3xl" spacing="relaxed">
    <!-- Header -->
    <div class="text-center max-w-4xl mx-auto mb-16">
      <BaseHeading :level="2" align="center" class="mb-6">
        Visual Storytelling for <span class="font-cormorant italic font-normal text-[var(--color-secondary)]">NGOs & Organisations</span>
      </BaseHeading>
      <BaseText size="lg" color="primary" weight="light" leading="relaxed" align="center" class="mb-4">
        The Impact Box is a comprehensive storytelling package that provides your organisation with strategic imagery and narratives to tell your impact stories. Whether you need to explain your work, create awareness, raise funds, or deliver impact reports, these packages are designed to amplify your mission through authentic visual storytelling.
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
            'p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 min-w-[360px] max-w-[400px]',
            selectedIndex === index 
              ? 'bg-white border-[var(--color-secondary)] shadow-lg' 
              : 'bg-white/50 border-[var(--color-text)]/10 hover:bg-white/80 hover:border-[var(--color-secondary)]/30'
          ]"
        >
          <div class="flex justify-between items-start">
            <div>
              <h3 class="text-lg font-medium text-[var(--color-text)] mb-1">{{ pkg.title }}</h3>
              <p class="text-sm text-[var(--color-text)]/60 italic">{{ pkg.subtitle }}</p>
              <span 
                v-if="pkg.badge" 
                class="inline-block mt-2 px-2 py-1 bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] text-xs rounded-full"
              >
                {{ pkg.badge }}
              </span>
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
            :badge="selectedPackage.badge"
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
    title: 'The Raw Thread',
    subtitle: 'Short Story Package',
    price: 'R4,000',
    badge: 'Once-off',
    description: 'Ideal for events, new launches, or a content refresh. Perfect for organisations needing immediate visual content for campaigns or social media.',
    features: [
      'Half-day shoot',
      '50 edited images',
      'Social media captioning or visual theme guidance',
      'Quick turnaround for urgent campaigns'
    ],
    action: 'book-raw-thread',
    image: {
      src: new URL('@/assets/images/NGO-storytelling/Sozo Foundation Case Study Images54.jpg', import.meta.url).href,
      alt: 'NGO short story package'
    }
  },
  {
    title: 'The Narrative Journey',
    subtitle: 'Campaigns & Reports',
    price: 'R6,500',
    badge: 'Once-off',
    description: 'For deeper storytelling: campaigns, milestones, or annual reports. Comprehensive coverage that captures the heart of your mission.',
    features: [
      'Full-day shoot',
      '50–70 edited images',
      'Written narrative overview or social media caption set',
      'Planning call to align direction',
      'Impact measurement consultation'
    ],
    action: 'book-narrative',
    image: {
      src: new URL('@/assets/images/NGO-storytelling/Sozo Foundation Case Study Images40.jpg', import.meta.url).href,
      alt: 'NGO campaigns and reports'
    }
  },
  {
    title: 'The Footpath Journey',
    subtitle: 'Long-Term Partnership',
    price: 'R7,500',
    badge: 'Monthly Retainer',
    description: 'Ideal for organisations with ongoing work and a story to tell across seasons. Build a comprehensive visual library over time.',
    features: [
      'Monthly or quarterly sessions',
      'Ongoing image library development',
      'Visual + written story support for reports, donors & social',
      'Optional story-mapping and mentoring',
      'Priority booking and planning'
    ],
    action: 'book-footpath',
    image: {
      src: new URL('@/assets/images/NGO-storytelling/Sozo Foundation Case Study Images65.jpg', import.meta.url).href,
      alt: 'NGO long-term partnership'
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