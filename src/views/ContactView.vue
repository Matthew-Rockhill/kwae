<template>
  <div>
    <!-- Contact Form & Info Section -->
    <BaseSection background="white" padding="2xl" spacing="relaxed">
      <!-- Page Header -->
      <div class="text-center mb-12">
        <BaseHeading :level="1" align="center" :animate="true" class="mb-6">
          Let's Create <span class="font-cormorant italic font-normal text-[var(--color-secondary)]">Something Beautiful Together</span>
        </BaseHeading>
        <p class="text-[var(--color-text)] text-lg font-light leading-relaxed max-w-3xl mx-auto">
          Whether you're looking to capture a special moment, tell your story, or create content that connects, 
          I'd love to hear from you. Every project begins with a conversation.
        </p>
      </div>

      <div class="relative">
        <!-- Background decorative elements -->
        <div class="absolute -top-20 -right-20 w-40 h-40 bg-[var(--color-secondary)]/5 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-20 -left-20 w-60 h-60 bg-[var(--color-accent)]/20 rounded-full blur-3xl"></div>
        
        <!-- Main Contact Card -->
        <div class="relative bg-gradient-to-br from-white via-white to-[var(--color-accent)]/20 rounded-3xl shadow-2xl overflow-hidden">
          <div class="grid grid-cols-1 lg:grid-cols-12">
            
            <!-- Contact Form -->
            <div class="lg:col-span-7 p-8 lg:p-12">
              
              <form @submit.prevent="submitForm" class="space-y-6">
                <!-- Name Row -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label for="firstName" class="block text-sm font-medium text-[var(--color-text)] mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      v-model="form.firstName"
                      required
                      class="w-full px-4 py-3 border border-[var(--color-text)]/10 rounded-xl focus:ring-2 focus:ring-[var(--color-secondary)] focus:border-transparent transition-all duration-300 bg-white/80"
                      placeholder="Your first name"
                    />
                  </div>
                  <div>
                    <label for="lastName" class="block text-sm font-medium text-[var(--color-text)] mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      v-model="form.lastName"
                      required
                      class="w-full px-4 py-3 border border-[var(--color-text)]/10 rounded-xl focus:ring-2 focus:ring-[var(--color-secondary)] focus:border-transparent transition-all duration-300 bg-white/80"
                      placeholder="Your last name"
                    />
                  </div>
                </div>

                <!-- Contact Details Row -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label for="mobile" class="block text-sm font-medium text-[var(--color-text)] mb-2">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      id="mobile"
                      v-model="form.mobile"
                      required
                      class="w-full px-4 py-3 border border-[var(--color-text)]/10 rounded-xl focus:ring-2 focus:ring-[var(--color-secondary)] focus:border-transparent transition-all duration-300 bg-white/80"
                      placeholder="+27 XX XXX XXXX"
                    />
                  </div>
                  <div>
                    <label for="email" class="block text-sm font-medium text-[var(--color-text)] mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      v-model="form.email"
                      required
                      class="w-full px-4 py-3 border border-[var(--color-text)]/10 rounded-xl focus:ring-2 focus:ring-[var(--color-secondary)] focus:border-transparent transition-all duration-300 bg-white/80"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <!-- Package Selection -->
                <div>
                  <label for="sessionType" class="block text-sm font-medium text-[var(--color-text)] mb-2">
                    What are you interested in? *
                  </label>
                  <select
                    id="sessionType"
                    v-model="form.sessionType"
                    required
                    class="w-full px-4 py-3 border border-[var(--color-text)]/10 rounded-xl focus:ring-2 focus:ring-[var(--color-secondary)] focus:border-transparent transition-all duration-300 bg-white/80"
                  >
                    <option value="">Please select...</option>
                    <option value="family">Family Portrait Session</option>
                    <option value="wedding">Wedding Photography</option>
                    <option value="lifestyle">Lifestyle Photography</option>
                    <option value="ngo">NGO Storytelling</option>
                    <option value="branding">Brand Photography</option>
                    <option value="other">Something Else</option>
                  </select>
                </div>

                <!-- Message -->
                <div>
                  <label for="message" class="block text-sm font-medium text-[var(--color-text)] mb-2">
                    Tell me about your vision
                  </label>
                  <textarea
                    id="message"
                    v-model="form.message"
                    rows="6"
                    class="w-full px-4 py-3 border border-[var(--color-text)]/10 rounded-xl focus:ring-2 focus:ring-[var(--color-secondary)] focus:border-transparent transition-all duration-300 resize-none bg-white/80"
                    placeholder="Share your story, vision, or any questions you have. The more details you provide, the better I can understand how to help bring your ideas to life."
                  ></textarea>
                </div>

                <!-- Submit Button -->
                <div class="pt-4">
                  <BaseButton 
                    type="submit" 
                    variant="primary" 
                    size="lg" 
                    full-width
                    :disabled="isSubmitting"
                    class="min-h-[56px] mb-6"
                  >
                    {{ isSubmitting ? 'Sending...' : 'Send Message' }}
                  </BaseButton>
                  
                  <!-- Response Time -->
                  <div class="flex items-center justify-center text-center">
                    <div class="flex items-center">
                      <svg class="w-5 h-5 text-[var(--color-secondary)] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      <p class="text-[var(--color-text)]/70 text-sm">I typically respond within 24-48 hours</p>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <!-- Contact Information -->
            <div class="lg:col-span-5 bg-gradient-to-br from-[var(--color-accent)]/30 to-[var(--color-secondary)]/10 p-8 lg:p-12 flex flex-col justify-center">
              <div class="mb-8">
                <BaseHeading :level="3" class="mb-4 text-[var(--color-text)]">Let's Connect</BaseHeading>
                <p class="text-[var(--color-text)]/70 leading-relaxed">
                  I'd love to learn more about your story and how we can work together.
                </p>
              </div>
              
              <div class="space-y-8">

                <!-- WhatsApp -->
                <div class="flex items-start">
                  <div class="flex-shrink-0 w-12 h-12 bg-white/80 rounded-full flex items-center justify-center mr-4 shadow-lg">
                    <svg class="w-6 h-6 text-[var(--color-secondary)]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.570-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                    </svg>
                  </div>
                  <div>
                    <h4 class="text-lg font-medium text-[var(--color-text)] mb-2">WhatsApp</h4>
                    <p class="text-[var(--color-text)]/70 text-sm leading-relaxed mb-3">For quick questions or urgent enquiries.</p>
                    <a 
                      href="https://wa.me/27834025563" 
                      target="_blank"
                      class="inline-flex items-center text-[var(--color-secondary)] hover:text-[var(--color-secondary)]/80 transition-colors duration-300 font-medium"
                    >
                      <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.570-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                      </svg>
                      WhatsApp Me
                      <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                      </svg>
                    </a>
                  </div>
                </div>

                <!-- Email -->
                <div class="flex items-start">
                  <div class="flex-shrink-0 w-12 h-12 bg-white/80 rounded-full flex items-center justify-center mr-4 shadow-lg">
                    <svg class="w-6 h-6 text-[var(--color-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 class="text-lg font-medium text-[var(--color-text)] mb-2">Email</h4>
                    <p class="text-[var(--color-text)]/70 text-sm leading-relaxed mb-3">Drop me a line directly.</p>
                    <a 
                      href="mailto:rockill.kristin@gmail.com" 
                      class="inline-flex items-center text-[var(--color-secondary)] hover:text-[var(--color-secondary)]/80 transition-colors duration-300 font-medium"
                    >
                      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                      </svg>
                      Send Email
                      <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                      </svg>
                    </a>
                  </div>
                </div>

                <!-- Social -->
                <div class="flex items-start">
                  <div class="flex-shrink-0 w-12 h-12 bg-white/80 rounded-full flex items-center justify-center mr-4 shadow-lg">
                    <svg class="w-6 h-6 text-[var(--color-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 class="text-lg font-medium text-[var(--color-text)] mb-2">Follow My Work</h4>
                    <p class="text-[var(--color-text)]/70 text-sm leading-relaxed mb-3">See my latest projects and behind-the-scenes content on Instagram.</p>
                    <a 
                      href="https://www.instagram.com/kristin_with.an.eye/" 
                      target="_blank"
                      class="inline-flex items-center text-[var(--color-secondary)] hover:text-[var(--color-secondary)]/80 transition-colors duration-300 font-medium"
                    >
                      @kristin_with.an.eye
                      <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                      </svg>
                    </a>
                  </div>
                </div>

                <!-- Location -->
                <div class="flex items-start">
                  <div class="flex-shrink-0 w-12 h-12 bg-white/80 rounded-full flex items-center justify-center mr-4 shadow-lg">
                    <svg class="w-6 h-6 text-[var(--color-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 class="text-lg font-medium text-[var(--color-text)] mb-2">Based in Cape Town</h4>
                    <p class="text-[var(--color-text)]/70 text-sm leading-relaxed">Available for shoots throughout the Western Cape and beyond. Travel fees may apply for locations over 50km from Cape Town.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseSection>

    <!-- FAQ Section -->
    <BaseSection background="light" padding="2xl" spacing="relaxed">
      <div class="text-center mb-16">
        <BaseHeading :level="2" align="center" class="mb-6">
          Frequently Asked <span class="font-cormorant italic font-normal text-[var(--color-secondary)]">Questions</span>
        </BaseHeading>
        <p class="text-[var(--color-text)] text-lg font-light leading-relaxed max-w-2xl mx-auto">
          Here are some common questions I receive. If you don't see your question here, feel free to ask!
        </p>
      </div>

      <div class="max-w-4xl mx-auto">
        <div class="space-y-4">
          <div 
            v-for="(faq, index) in faqs" 
            :key="index"
            class="bg-white rounded-2xl shadow-lg border border-[var(--color-text)]/5 overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <button
              @click="toggleFaq(index)"
              class="w-full px-8 py-6 text-left hover:bg-[var(--color-accent)]/20 transition-colors duration-300 flex justify-between items-center"
            >
              <span class="text-lg font-medium text-[var(--color-text)] pr-4">{{ faq.question }}</span>
              <svg 
                class="w-5 h-5 text-[var(--color-secondary)] transition-transform duration-300 flex-shrink-0"
                :class="{ 'rotate-180': faq.isOpen }"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>
            <div 
              v-show="faq.isOpen"
              class="px-8 pb-6 text-[var(--color-text)]/80 leading-relaxed"
            >
              {{ faq.answer }}
            </div>
          </div>
        </div>
      </div>
    </BaseSection>

    <!-- Simple Contact Prompt -->
    <BaseSection background="alabaster" padding="xl" spacing="normal">
      <div class="text-center max-w-2xl mx-auto">
        <BaseHeading :level="3" align="center" class="mb-6">
          Still have <span class="font-cormorant italic font-normal text-[var(--color-secondary)]">questions?</span>
        </BaseHeading>
        <p class="text-[var(--color-text)] text-lg leading-relaxed mb-8">
          I'm here to help! Don't hesitate to reach out if you need more information or want to discuss your specific needs.
        </p>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-6">
          <a 
            href="https://wa.me/27834025563" 
            target="_blank"
            class="inline-flex items-center text-[var(--color-secondary)] hover:text-[var(--color-secondary)]/80 transition-colors duration-300 font-medium text-lg"
          >
            <svg class="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.570-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
            </svg>
            WhatsApp Me
          </a>
          <span class="text-[var(--color-text)]/50">or</span>
          <a 
            href="mailto:rockill.kristin@gmail.com" 
            class="inline-flex items-center text-[var(--color-secondary)] hover:text-[var(--color-secondary)]/80 transition-colors duration-300 font-medium text-lg"
          >
            <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
            Send Email
          </a>
          <span class="text-[var(--color-text)]/50">or</span>
          <button 
            @click="scrollToForm"
            class="inline-flex items-center text-[var(--color-secondary)] hover:text-[var(--color-secondary)]/80 transition-colors duration-300 font-medium text-lg"
          >
            <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            Send Me a Message
          </button>
        </div>
      </div>
    </BaseSection>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import BaseSection from '@/components/ui/BaseSection.vue'
import BaseHeading from '@/components/ui/BaseHeading.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import CallToActionSection from '@/components/ui/CallToActionSection.vue'

// Form data
const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  mobile: '',
  sessionType: '',
  message: ''
})

const isSubmitting = ref(false)

// FAQ data
const faqs = ref([
  {
    question: "How far in advance should I book my session?",
    answer: "I recommend booking at least 2-4 weeks in advance, especially during peak seasons (spring, summer, and holiday periods). However, I understand that sometimes special moments can't wait, so I'll always do my best to accommodate shorter notice requests when my schedule allows.",
    isOpen: false
  },
  {
    question: "What happens if the weather doesn't cooperate for our outdoor session?",
    answer: "Cape Town weather can be unpredictable! I always monitor forecasts closely and will communicate with you about any potential weather concerns. If needed, we can reschedule to ensure you get the beautiful images you deserve. I also have several backup indoor and covered locations that work beautifully for different types of sessions.",
    isOpen: false
  },
  {
    question: "How long after our session will I receive my photos?",
    answer: "You'll receive a selection of preview images within 48 hours so you can see the magic we captured together. Your complete, professionally edited gallery will be delivered within one week. I believe in providing you with beautiful, carefully crafted images that truly reflect the essence of your session, and this timeline ensures each photograph receives the attention it deserves.",
    isOpen: false
  },
  {
    question: "Do you provide the raw/unedited photos?",
    answer: "I provide professionally edited, high-resolution images that are ready for print and digital use. Raw files are not typically included as they represent unfinished work - much like a painter wouldn't share their initial sketches. My editing process is an integral part of my artistic vision and ensures you receive images that truly represent the beauty of your session.",
    isOpen: false
  },
  {
    question: "Can we include our pets in the session?",
    answer: "Absolutely! Pets are family too, and I love including them in sessions. Just let me know in advance so I can plan accordingly and perhaps bring some treats to help keep them engaged. I've photographed dogs, cats, horses, and even a few chickens - each session is always an adventure!",
    isOpen: false
  },
  {
    question: "What should we wear for our session?",
    answer: "I'll provide you with a detailed style guide once your session is booked, but generally I recommend earthy, natural tones that complement rather than compete with the environment. Think creams, soft browns, muted greens, and dusty blues. Most importantly, choose clothing that makes you feel comfortable and authentically you.",
    isOpen: false
  }
])

// Form submission
const submitForm = async () => {
  isSubmitting.value = true
  
  try {
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Reset form
    Object.assign(form, {
      firstName: '',
      lastName: '',
      email: '',
      mobile: '',
      sessionType: '',
      message: ''
    })
    
    alert('Thank you for your message! I\'ll get back to you within 24-48 hours.')
  } catch (error) {
    alert('There was an error sending your message. Please try again or contact me directly.')
  } finally {
    isSubmitting.value = false
  }
}

// FAQ functionality
const toggleFaq = (index: number) => {
  faqs.value[index].isOpen = !faqs.value[index].isOpen
}

// Scroll to form
const scrollToForm = () => {
  const formElement = document.querySelector('form')
  if (formElement) {
    formElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

</script>