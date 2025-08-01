<template>
    <div>
      <!-- About Me Section -->
      <BaseSection background="white" padding="xl" spacing="relaxed">
        <!-- Page Header -->
        <div class="text-center mb-12">
          <BaseHeading :level="1" align="center" :animate="true" class="mb-6">
            About Me<br><span class="font-cormorant italic font-normal text-[var(--color-secondary)]">Behind the Lens</span>
          </BaseHeading>
        </div>

        <div class="relative">
          <!-- Background decorative elements -->
          <div class="absolute -top-20 -right-20 w-40 h-40 bg-[var(--color-secondary)]/5 rounded-full blur-3xl"></div>
          <div class="absolute -bottom-20 -left-20 w-60 h-60 bg-[var(--color-accent)]/20 rounded-full blur-3xl"></div>
          
          <div class="relative">
        <!-- First Content Block -->
        <ContentBlock 
          :image="{ src: aboutImage1, alt: 'Kristin' }" 
          image-position="left"
        >
          <BaseText size="lg" weight="light" leading="relaxed" class="mb-6">
            Hi, I'm Kristin, the heart and eyes behind Kristin With An Eye. I'm based in Cape Town but wander often, always seeking beauty in both people and places. I'm a wife to my incredible husband Matthew and mom to two very special boys. I'm passionate about exploring the world and capturing the quiet, meaningful moments that often go unnoticed.
          </BaseText>
          
          <QuoteBlock>
            I believe storytelling has the power to connect hearts, expand understanding, and spark change.
          </QuoteBlock>
          
          <BaseText size="lg" weight="light" leading="relaxed" class="mb-6">
            My journey into photography and visual storytelling began with a deep curiosity and love for stories. Since I was a young girl, I've been drawn to the gold in people and the poetry in everyday life. I was always capturing moments, advocating for causes close to my heart, and eventually found myself in the world of community development.
          </BaseText>
        </ContentBlock>
      
        <!-- Second Content Block -->
        <ContentBlock 
          :image="{ src: aboutImage2, alt: 'Kristin\'s work' }" 
          image-position="right"
        >
          <BaseText size="lg" weight="light" leading="relaxed" class="mb-6">
            With a background in Print Journalism and Social Anthropology, and over a decade of experience in the NGO and EdTech sectors, storytelling has always been part of my path. Photography was a quiet passion that kept resurfacing - a gift God gently, persistently invited me to embrace. What began as a whisper became a calling I could no longer ignore.
          </BaseText>

          <BaseText size="lg" weight="light" leading="relaxed" class="mb-6">
            In 2025, I was honoured to be named a Top 5 Finalist in the World Wildlife Foundation's "Believe in Better" Photography Competition - a moment that affirmed the power of storytelling rooted in purpose.
          </BaseText>
        
          <QuoteBlock>
            I'm drawn to humble beauty - the real, raw, and often overlooked parts of life. I believe every moment holds a story worth telling.
          </QuoteBlock>

          <BaseText size="lg" weight="light" leading="relaxed" class="mb-6">
            As a family, we made the bold and beautiful decision to pursue this vision wholeheartedly. I longed for more presence with our boys, space to create, and a way to build something soulful and sustainable. This time with them has been a sacred gift - a reminder of what truly matters.
          </BaseText>

          <BaseText size="lg" weight="light" leading="relaxed" class="mb-6">
            Through Kristin With An Eye, we capture beauty in humble places and tell stories that matter for individuals, families, and organisations.
          </BaseText>

          <BaseText size="lg" weight="light" leading="relaxed" class="mb-6">
            Whether it's a laugh shared around a kitchen table, the quiet strength of a community leader, or a landscape soaked in light, we are committed to capturing it with honesty, heart, and intention.
          </BaseText>

          <BaseText size="lg" weight="light" leading="relaxed" class="mb-6">
            Our approach is rooted in trust and connection. We walk closely with each client to ensure your story is told in a way that feels true to you.
          </BaseText>

          <BaseText size="lg" weight="light" leading="relaxed">
            Let's tell yours together.
          </BaseText>
        </ContentBlock>
          </div>
        </div>
      </BaseSection>
      
      <!-- Recent Recognition Section -->
      <BaseSection background="light" padding="xl" spacing="relaxed">
        
        <div class="text-center max-w-4xl mx-auto mb-16">
          <BaseHeading :level="2" align="center" class="mb-6">
            Recent <span class="font-cormorant italic font-normal text-[var(--color-secondary)]">Recognition</span>
          </BaseHeading>
          <BaseText size="lg" color="primary" weight="light" leading="relaxed" align="center">
            Honored to be recognized for visual storytelling that inspires environmental conservation and positive change.
          </BaseText>
        </div>

        <!-- Full Width Image with Card Overlay -->
        <div class="max-w-6xl mx-auto">
          <div class="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-0">
              
              <!-- Left Column - Winning Image -->
              <div class="relative">
                <img 
                  :src="winningImage" 
                  alt="WWF Believe in Better competition winning photograph" 
                  class="w-full h-64 lg:h-full object-cover"
                />
                
                <!-- 5th Place Badge Overlay -->
                <div class="absolute top-6 left-6">
                  <div class="bg-[var(--color-secondary)] text-white px-4 py-3 rounded-xl shadow-xl">
                    <div class="text-center">
                      <div class="text-3xl font-bold">5th</div>
                      <div class="text-sm uppercase tracking-wide font-medium">Place</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Right Column - Award Details -->
              <div class="p-8 lg:p-12 flex flex-col justify-center">
              <BaseHeading :level="3" class="mb-4">
                Believe in Better
              </BaseHeading>
              <BaseText size="xl" color="primary" weight="medium" class="mb-6">
                WWF Photography Competition
              </BaseText>
              <BaseText size="lg" color="primary" :opacity="70" weight="light" leading="relaxed" class="mb-6">
                Recognized among the top 5 finalists for visual storytelling that inspires environmental conservation and positive change.
              </BaseText>
              
              <div class="mb-6">
                <div class="text-lg font-medium text-[var(--color-text)] mb-2">2025</div>
                <span class="inline-block px-4 py-2 bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] text-sm rounded-full font-medium">
                  Top 5 Finalist
                </span>
              </div>
              
              <!-- WWF Logo and Competition Link -->
              <div class="space-y-4">
                <!-- WWF Logo -->
                <div class="flex items-center gap-3">
                  <img 
                    :src="wwfLogo" 
                    alt="World Wildlife Foundation logo" 
                    class="h-12 w-auto"
                  />
                  <span class="text-sm text-[var(--color-text)]/80 font-medium">World Wildlife Foundation</span>
                </div>
                
                <!-- View Competition Link -->
                <a 
                  href="https://believeinbetter.wwf.org.za/home" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-secondary)]/10 hover:bg-[var(--color-secondary)]/20 text-[var(--color-secondary)] rounded-lg transition-colors duration-300 text-sm font-medium"
                >
                  View Competition
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                  </svg>
                </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </BaseSection>
      
      <!-- CTA Section -->
      <BaseSection background="alabaster" padding="xl" spacing="normal">
        <CallToActionSection
          custom-heading='Ready to <span class="font-cormorant italic font-normal text-[var(--color-secondary)]">Tell Your Story?</span>'
          description="Let's work together to capture your authentic moments and create beautiful memories that last a lifetime."
          :primary-action="{ text: 'See My Work', type: 'router-link', to: '/portfolio' }"
          :secondary-action="{ text: 'Get in Touch', type: 'router-link', to: '/contact' }"
          :show-voucher-action="true"
          background="alabaster"
          @voucher-click="openVoucherModal"
        />
      </BaseSection>
      
      <!-- Voucher Modal -->
      <VoucherModal
        :is-open="showVoucherModal"
        :voucher-type="voucherType"
        @close="closeVoucherModal"
      />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import BaseSection from '@/components/ui/BaseSection.vue'
  import BaseHeading from '@/components/ui/BaseHeading.vue'
  import BaseText from '@/components/ui/BaseText.vue'
  import CallToActionSection from '@/components/ui/CallToActionSection.vue'
  import ContentBlock from '@/components/ui/ContentBlock.vue'
  import QuoteBlock from '@/components/ui/QuoteBlock.vue'
  import VoucherModal from '@/components/VoucherModal.vue'
  
  // Import images
  import aboutImage1 from '@/assets/images/about-1.jpg'
  import aboutImage2 from '@/assets/images/about-2.jpg'
  import winningImage from '@/assets/images/family/dsc-0175.jpg'
  import wwfLogo from '@/assets/images/wwf-logo.png'
  
  // Voucher modal state
  const showVoucherModal = ref(false)
  const voucherType = ref<'gift' | 'sponsorship'>('gift')

  const openVoucherModal = () => {
    voucherType.value = 'gift' // Default to gift voucher
    showVoucherModal.value = true
  }

  const closeVoucherModal = () => {
    showVoucherModal.value = false
  }
  </script>