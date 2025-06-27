<template>
    <section class="py-24 md:py-32 bg-[var(--color-accent)]">
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
          <!-- Portrait & Family Sessions -->
          <BaseCard variant="elevated" class="hover:-translate-y-2 transition-transform duration-300 h-full flex flex-col">
            <div class="p-8 flex-grow text-left">
              <!-- Nature Icon: Tree for growth & connection -->
              <div class="mb-6">
                <svg class="w-12 h-12 text-[var(--color-secondary)]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7.5,14 8,20 8,20C8.5,18 9.5,16 11,14C12.5,12 15.5,10 17,8Z"/>
                </svg>
              </div>
              <BaseHeading :level="3" class="mb-4">Portrait & Family Sessions</BaseHeading>
              <BaseText color="primary" :opacity="70" weight="light" leading="relaxed" class="mb-6">
                Earthy, natural photos that celebrate connection and the beauty of the everyday.
              </BaseText>
            </div>
            <div class="p-6 pt-0 mt-auto">
              <BaseButton variant="primary" size="sm" @click="navigateToSection('family-sessions')" full-width>
                Family Packages
              </BaseButton>
            </div>
          </BaseCard>

          <!-- Events & Weddings -->
          <BaseCard variant="elevated" class="hover:-translate-y-2 transition-transform duration-300 h-full flex flex-col">
            <div class="p-8 flex-grow text-left">
              <!-- Nature Icon: Flower for celebration & beauty -->
              <div class="mb-6">
                <svg class="w-12 h-12 text-[var(--color-secondary)]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M16.18,7.76L15.12,8.82L14.06,7.76L13,8.82L14.06,9.88L13,10.94L14.06,12L15.12,10.94L16.18,12L17.24,10.94L16.18,9.88L17.24,8.82L16.18,7.76M7.82,12L8.88,10.94L9.94,12L11,10.94L9.94,9.88L11,8.82L9.94,7.76L8.88,8.82L7.82,7.76L6.76,8.82L7.82,9.88L6.76,10.94L7.82,12M12,13.5A1.5,1.5 0 0,1 10.5,12A1.5,1.5 0 0,1 12,10.5A1.5,1.5 0 0,1 13.5,12A1.5,1.5 0 0,1 12,13.5Z"/>
                </svg>
              </div>
              <BaseHeading :level="3" class="mb-4">Events & Weddings</BaseHeading>
              <BaseText color="primary" :opacity="70" weight="light" leading="relaxed" class="mb-6">
                Candid, heartfelt coverage of milestones, celebrations, and soulful unions.
              </BaseText>
            </div>
            <div class="p-6 pt-0 mt-auto">
              <BaseButton variant="primary" size="sm" @click="navigateToSection('lifestyle-events')" full-width>
                Events & Weddings
              </BaseButton>
            </div>
          </BaseCard>

          <!-- Organisational Storytelling -->
          <BaseCard variant="elevated" class="hover:-translate-y-2 transition-transform duration-300 h-full flex flex-col">
            <div class="p-8 flex-grow text-left">
              <!-- Nature Icon: Mountain for journey & impact -->
              <div class="mb-6">
                <svg class="w-12 h-12 text-[var(--color-secondary)]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14,6L10.25,11L13.1,14.8L11.5,16C9.81,13.75 7,10 7,10L1,20H23L14,6Z"/>
                </svg>
              </div>
              <BaseHeading :level="3" class="mb-4">Organisational Storytelling</BaseHeading>
              <BaseText color="primary" :opacity="70" weight="light" leading="relaxed" class="mb-6">
                Long-form storytelling for NGOs and changemakers — crafted with care.
              </BaseText>
            </div>
            <div class="p-6 pt-0 mt-auto">
              <BaseButton variant="primary" size="sm" @click="navigateToSection('organisation-storytelling')" full-width>
                Impact Box
              </BaseButton>
            </div>
          </BaseCard>
        </div>

      </div>
    </section>
  </template>
  
  <script setup lang="ts">
  import { useRouter } from 'vue-router'
  import BaseButton from '@/components/ui/BaseButton.vue'
  import BaseCard from '@/components/ui/BaseCard.vue'
  import BaseHeading from '@/components/ui/BaseHeading.vue'
  import BaseText from '@/components/ui/BaseText.vue'

  const router = useRouter()

  const navigateToSection = (sectionId: string) => {
    router.push(`/packages#${sectionId}`)
  }
  </script>