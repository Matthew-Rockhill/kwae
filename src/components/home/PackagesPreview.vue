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
          <BaseCard variant="elevated" class="text-center hover:-translate-y-2 transition-transform duration-300 h-full flex flex-col">
            <div class="p-8 flex-grow">
              <BaseHeading :level="3" class="mb-4">Portrait & Family Sessions</BaseHeading>
              <BaseText color="primary" :opacity="70" weight="light" leading="relaxed" class="mb-6">
                Earthy, natural photos that celebrate connection and the beauty of the everyday.
              </BaseText>
            </div>
            <div class="p-6 pt-0 mt-auto">
              <router-link to="/packages" class="inline-block">
                <BaseText tag="span" color="secondary" class="hover:text-[var(--color-text)] transition-colors duration-300">
                  Explore Family Packages
                </BaseText>
              </router-link>
            </div>
          </BaseCard>

          <!-- Events & Weddings -->
          <BaseCard variant="elevated" class="text-center hover:-translate-y-2 transition-transform duration-300 h-full flex flex-col">
            <div class="p-8 flex-grow">
              <BaseHeading :level="3" class="mb-4">Events & Weddings</BaseHeading>
              <BaseText color="primary" :opacity="70" weight="light" leading="relaxed" class="mb-6">
                Candid, heartfelt coverage of milestones, celebrations, and soulful unions.
              </BaseText>
            </div>
            <div class="p-6 pt-0 mt-auto">
              <router-link to="/packages" class="inline-block">
                <BaseText tag="span" color="secondary" class="hover:text-[var(--color-text)] transition-colors duration-300">
                  View Event & Wedding Options
                </BaseText>
              </router-link>
            </div>
          </BaseCard>

          <!-- Organisational Storytelling -->
          <BaseCard variant="elevated" class="text-center hover:-translate-y-2 transition-transform duration-300 h-full flex flex-col">
            <div class="p-8 flex-grow">
              <BaseHeading :level="3" class="mb-4">Organisational Storytelling</BaseHeading>
              <BaseText color="primary" :opacity="70" weight="light" leading="relaxed" class="mb-6">
                Long-form storytelling for NGOs and changemakers — crafted with care.
              </BaseText>
            </div>
            <div class="p-6 pt-0 mt-auto">
              <router-link to="/packages" class="inline-block">
                <BaseText tag="span" color="secondary" class="hover:text-[var(--color-text)] transition-colors duration-300">
                  Discover the Impact Box
                </BaseText>
              </router-link>
            </div>
          </BaseCard>
        </div>
        
        <!-- CTA Button -->
        <div class="text-center mt-12">
          <router-link to="/packages">
            <BaseButton variant="primary">
              View All Packages
            </BaseButton>
          </router-link>
        </div>
      </div>
    </section>
  </template>
  
  <script setup lang="ts">
  import BaseButton from '@/components/ui/BaseButton.vue'
  import BaseCard from '@/components/ui/BaseCard.vue'
  import BaseHeading from '@/components/ui/BaseHeading.vue'
  import BaseText from '@/components/ui/BaseText.vue'
  </script>