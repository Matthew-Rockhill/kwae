<template>
  <section class="bg-[var(--color-accent)]">
    <div class="section-header text-center max-w-3xl mx-auto">
      <BaseHeading :level="2" :animate="true" align="center" decoration="dots">
        <span class="block">Find the Package</span>
        <span class="block font-cormorant italic font-normal text-[var(--color-secondary)]">That Works for You</span>
      </BaseHeading>
      <BaseText size="lg" color="primary" weight="normal" leading="relaxed" class="text-[var(--color-text)] font-medium">
        Whether you're seeking timeless family portraits, a special event captured, or a storytelling
        project to amplify your business's mission, my packages are designed to meet your needs with
        creativity, care, and quality.
      </BaseText>
    </div>
    
    <!-- Packages Grid -->
    <div class="content-grid grid-cols-1 md:grid-cols-3">
        <PackagePreviewCard
          v-for="pkg in previewPackages"
          :key="pkg.title"
          :title="pkg.title"
          :description="pkg.description"
          :image="pkg.image"
          :button-text="pkg.buttonText"
          :button-action="pkg.buttonAction"
          :featured="pkg.featured"
          :featured-text="pkg.featuredText"
          @button-click="handlePackageClick"
        />
    </div>
    
  </section>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import PackagePreviewCard from '@/components/PackagePreviewCard.vue'
import BaseHeading from '@/components/ui/BaseHeading.vue'
import BaseText from '@/components/ui/BaseText.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const router = useRouter()

const previewPackages = [
  {
    title: 'Portrait & Family Sessions',
    description: 'Earthy, natural photos that celebrate connection and the beauty of the everyday.',
    image: {
      src: new URL('@/assets/images/family/dsc-0222.jpg', import.meta.url).href,
      alt: 'Family photography'
    },
    buttonText: 'Family Packages',
    buttonAction: 'family-sessions',
    featured: true,
    featuredText: 'Most Popular'
  },
  {
    title: 'Events & Weddings',
    description: 'Candid, heartfelt coverage of milestones, celebrations, and soulful unions.',
    image: {
      src: new URL('@/assets/images/lifestyle/traditional-wedding/Copy of DSC_0319.jpg', import.meta.url).href,
      alt: 'Wedding photography'
    },
    buttonText: 'Events & Weddings',
    buttonAction: 'lifestyle-events'
  },
  {
    title: 'Organisational Storytelling',
    description: 'Long-form storytelling for NGOs and changemakers — crafted with care.',
    image: {
      src: new URL('@/assets/images/NGO-storytelling/Sozo Foundation Case Study Images20.jpg', import.meta.url).href,
      alt: 'NGO storytelling'
    },
    buttonText: 'Impact Box',
    buttonAction: 'organisation-storytelling'
  }
]

const handlePackageClick = (sectionId: string) => {
  router.push(`/packages#${sectionId}`)
}
</script>