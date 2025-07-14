<template>
  <section class="bg-[var(--color-accent)]">
    <div class="container-custom">
      <div class="text-center max-w-3xl mx-auto mb-16">
        <h2 class="text-3xl md:text-4xl font-extralight text-[var(--color-text)] mb-6">
          Photography Packages & <span class="font-cormorant italic font-normal text-[var(--color-text)]">Visual Storytelling</span>
        </h2>
        <p class="text-[var(--color-text)]/70 text-lg font-light leading-relaxed">
          Whether you're seeking timeless family portraits, a special event captured, or a storytelling
          project to amplify your business's mission, my packages are designed to meet your needs with
          creativity, care, and quality.
        </p>
      </div>
      
      <!-- Packages Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <PackagePreviewCard
          v-for="pkg in previewPackages"
          :key="pkg.title"
          :title="pkg.title"
          :description="pkg.description"
          :image="pkg.image"
          :button-text="pkg.buttonText"
          :button-action="pkg.buttonAction"
          @button-click="handlePackageClick"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import PackagePreviewCard from '@/components/PackagePreviewCard.vue'

const router = useRouter()

const previewPackages = [
  {
    title: 'Portrait & Family Sessions',
    description: 'Earthy, natural photos that celebrate connection and the beauty of the everyday.',
    image: {
      src: new URL('@/assets/images/family/dsc-0006.jpg', import.meta.url).href,
      alt: 'Family photography'
    },
    buttonText: 'Family Packages',
    buttonAction: 'family-sessions'
  },
  {
    title: 'Events & Weddings',
    description: 'Candid, heartfelt coverage of milestones, celebrations, and soulful unions.',
    image: {
      src: new URL('@/assets/images/lifestyle/traditional-wedding/Copy of DSC_0017.jpg', import.meta.url).href,
      alt: 'Wedding photography'
    },
    buttonText: 'Events & Weddings',
    buttonAction: 'lifestyle-events'
  },
  {
    title: 'Organisational Storytelling',
    description: 'Long-form storytelling for NGOs and changemakers — crafted with care.',
    image: {
      src: new URL('@/assets/images/NGO-storytelling/Sozo Foundation Case Study Images103.jpg', import.meta.url).href,
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