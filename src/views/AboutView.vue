<template>
    <div>
      <!-- Page Header -->
      <BaseSection background="light" padding="xl">
        <div class="max-w-3xl mx-auto text-center">
          <BaseHeading :level="1" align="center" class="mb-6">
            About Kristin – <span class="font-cormorant italic font-normal text-[var(--color-text)]">Your Storyteller Behind the Lens</span>
          </BaseHeading>
          <BaseText size="lg" color="primary" :opacity="70" weight="light" leading="relaxed" align="center">
            Through my lens, I tell stories that matter, preserving memories that last a lifetime.
          </BaseText>
        </div>
      </BaseSection>
      
      <!-- Main Content -->
      <BaseSection background="light" padding="xl">
        <!-- First Content Block -->
        <ContentBlock 
          :image="{ src: aboutImage1, alt: 'Kristin' }" 
          image-position="left" 
          spacing="large"
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

          <BaseText size="lg" weight="light" leading="relaxed">
            Our approach is rooted in trust and connection. We walk closely with each client to ensure your story is told in a way that feels true to you.
          </BaseText>
        </ContentBlock>
      </BaseSection>
      
      <!-- CTA Section -->
      <BaseSection background="accent" padding="lg">
        <div class="text-center">
          <BaseHeading :level="2" align="center" class="mb-6">
            Ready to <span class="font-cormorant italic font-normal text-[var(--color-text)]">Tell Your Story?</span>
          </BaseHeading>
          <BaseText size="lg" color="primary" :opacity="70" weight="light" class="max-w-2xl mx-auto mb-10" align="center">
            Let's work together to capture your authentic moments and create beautiful memories that last a lifetime.
          </BaseText>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <router-link to="/portfolio">
              <BaseButton variant="primary">See My Work</BaseButton>
            </router-link>
            <router-link to="/contact">
              <BaseButton variant="secondary">Get in Touch</BaseButton>
            </router-link>
          </div>
        </div>
      </BaseSection>
    </div>
  </template>
  
  <script setup lang="ts">
  import BaseSection from '@/components/ui/BaseSection.vue'
  import BaseHeading from '@/components/ui/BaseHeading.vue'
  import BaseText from '@/components/ui/BaseText.vue'
  import BaseButton from '@/components/ui/BaseButton.vue'
  import ContentBlock from '@/components/ui/ContentBlock.vue'
  import QuoteBlock from '@/components/ui/QuoteBlock.vue'
  
  // Import images
  import aboutImage1 from '@/assets/images/about-1.jpg'
  import aboutImage2 from '@/assets/images/about-2.jpg'
  </script>