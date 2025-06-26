<template>
  <div>
    <!-- Page Header -->
    <BaseSection background="light" padding="xl">
      <div class="container-custom text-center">
        <BaseHeading :level="1" align="center" class="mb-4">
          Let's Connect!
        </BaseHeading>
        <BaseText size="lg" color="primary" :opacity="70" align="center" class="max-w-3xl mx-auto">
          I'm excited to hear about your story, your project, or the memories you want to capture. 
          Please fill out the form below, and I'll be in touch soon!
        </BaseText>
      </div>
    </BaseSection>

    <!-- Contact Section -->
    <BaseSection background="accent" padding="xl">
      <div class="container-custom">
        <div class="grid grid-cols-1 lg:grid-cols-5 gap-12">
          <!-- Contact Form Column -->
          <div class="lg:col-span-3">
            <BaseCard variant="default" class="p-8 md:p-10">
              <BaseHeading :level="2" class="mb-6">
                Send Me a Message
              </BaseHeading>
              
              <!-- Success Message -->
              <div v-if="submitSuccess" class="bg-[var(--color-accent)] text-[var(--color-text)] p-4 mb-6 border border-[var(--color-card-header)] rounded-lg">
                <div class="flex">
                  <CheckCircleIcon class="h-6 w-6 text-[var(--color-secondary)] mr-2" />
                  <div>
                    <BaseText weight="medium" class="mb-1">Message sent successfully!</BaseText>
                    <BaseText size="sm" color="primary" :opacity="80">Thank you for reaching out. I'll get back to you as soon as possible.</BaseText>
                  </div>
                </div>
              </div>
              
              <!-- Contact Form -->
              <form @submit.prevent="handleSubmit" v-if="!submitSuccess">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <!-- First Name Input -->
                  <div>
                    <label for="firstName" class="block text-[var(--color-text)] font-medium mb-2">First Name *</label>
                    <input 
                      type="text" 
                      id="firstName"
                      v-model="formData.firstName"
                      required
                      class="w-full px-4 py-2 border border-[var(--color-card-header)] focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] focus:border-transparent rounded-lg"
                      :class="{ 'border-red-500': errors.firstName }"
                    />
                    <p v-if="errors.firstName" class="text-red-500 text-sm mt-1">{{ errors.firstName }}</p>
                  </div>
                  
                  <!-- Last Name Input -->
                  <div>
                    <label for="lastName" class="block text-[var(--color-text)] font-medium mb-2">Last Name *</label>
                    <input 
                      type="text" 
                      id="lastName"
                      v-model="formData.lastName"
                      required
                      class="w-full px-4 py-2 border border-[var(--color-card-header)] focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] focus:border-transparent rounded-lg"
                      :class="{ 'border-red-500': errors.lastName }"
                    />
                    <p v-if="errors.lastName" class="text-red-500 text-sm mt-1">{{ errors.lastName }}</p>
                  </div>
                </div>
                
                <!-- Email Input -->
                <div class="mb-6">
                  <label for="email" class="block text-[var(--color-text)] font-medium mb-2">Email *</label>
                  <input 
                    type="email" 
                    id="email"
                    v-model="formData.email"
                    required
                    class="w-full px-4 py-2 border border-[var(--color-card-header)] focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] focus:border-transparent rounded-lg"
                    :class="{ 'border-red-500': errors.email }"
                  />
                  <p v-if="errors.email" class="text-red-500 text-sm mt-1">{{ errors.email }}</p>
                </div>
                
                <!-- Message Input -->
                <div class="mb-6">
                  <label for="message" class="block text-[var(--color-text)] font-medium mb-2">Your Message *</label>
                  <textarea 
                    id="message"
                    v-model="formData.message"
                    required
                    rows="5"
                    class="w-full px-4 py-2 border border-[var(--color-card-header)] focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] focus:border-transparent rounded-lg"
                    :class="{ 'border-red-500': errors.message }"
                  ></textarea>
                  <p v-if="errors.message" class="text-red-500 text-sm mt-1">{{ errors.message }}</p>
                </div>
                
                <!-- Submit Button -->
                <BaseButton 
                  variant="primary" 
                  size="lg"
                  :full-width="true"
                  :disabled="isSubmitting"
                  @click="handleSubmit"
                >
                  <span v-if="isSubmitting">
                    <ArrowPathIcon class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" />
                    Sending...
                  </span>
                  <span v-else>Send Message</span>
                </BaseButton>
              </form>
            </BaseCard>
          </div>
          
          <!-- Contact Info Column -->
          <div class="lg:col-span-2">
            <!-- Contact Information -->
            <BaseCard variant="default" class="p-8 md:p-10 mb-8">
              <BaseHeading :level="2" class="mb-6">Contact Information</BaseHeading>
              
              <div class="space-y-6">
                <div class="flex items-start">
                  <BaseIcon class="mr-3 mt-0.5">
                    <EnvelopeIcon class="h-6 w-6" />
                  </BaseIcon>
                  <div>
                    <BaseText weight="medium" class="mb-1">Email</BaseText>
                    <a href="mailto:hello@kristinmathilde.com" class="text-[var(--color-secondary)] hover:text-[var(--color-text)] transition-colors">
                      hello@kristinmathilde.com
                    </a>
                  </div>
                </div>
                
                <div class="flex items-start">
                  <BaseIcon class="mr-3 mt-0.5">
                    <ClockIcon class="h-6 w-6" />
                  </BaseIcon>
                  <div>
                    <BaseText weight="medium" class="mb-1">Response Time</BaseText>
                    <BaseText color="primary" :opacity="70">I typically respond within 24-48 hours on business days.</BaseText>
                  </div>
                </div>
                
                <div class="flex items-start">
                  <BaseIcon class="mr-3 mt-0.5">
                    <MapPinIcon class="h-6 w-6" />
                  </BaseIcon>
                  <div>
                    <BaseText weight="medium" class="mb-1">Location</BaseText>
                    <BaseText color="primary" :opacity="70" class="mb-1">Based in Cape Town, South Africa</BaseText>
                    <BaseText size="sm" color="primary" :opacity="70">(Available for travel throughout South Africa)</BaseText>
                  </div>
                </div>
              </div>
            </BaseCard>
            
            <!-- Social Media Links -->
            <BaseCard variant="default" class="p-8 md:p-10">
              <BaseHeading :level="2" class="mb-6">Follow Along</BaseHeading>
              
              <div class="flex space-x-4">
                <a href="https://instagram.com/kristin_with.an.eye" target="_blank" class="bg-[var(--color-primary)] text-[var(--color-light)] p-4 rounded-full hover:bg-[var(--color-secondary)] hover:shadow-lg transition-all flex items-center justify-center">
                  <font-awesome-icon :icon="['fab', 'instagram']" class="text-3xl" />
                </a>
                
                <a href="https://facebook.com/kristinwithaneye" target="_blank" class="bg-[var(--color-primary)] text-[var(--color-light)] p-4 rounded-full hover:bg-[var(--color-secondary)] hover:shadow-lg transition-all flex items-center justify-center">
                  <font-awesome-icon :icon="['fab', 'facebook']" class="text-3xl" />
                </a>
                
                <a href="https://pinterest.com/kristinwithaneye" target="_blank" class="bg-[var(--color-primary)] text-[var(--color-light)] p-4 rounded-full hover:bg-[var(--color-secondary)] hover:shadow-lg transition-all flex items-center justify-center">
                  <font-awesome-icon :icon="['fab', 'pinterest']" class="text-3xl" />
                </a>
              </div>
              
              <BaseText color="primary" :opacity="70" class="mt-6">
                Follow along for behind-the-scenes content, photography tips, and to see my latest work!
              </BaseText>
            </BaseCard>
          </div>
        </div>
      </div>
    </BaseSection>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { EnvelopeIcon, ClockIcon, MapPinIcon, CheckCircleIcon, ArrowPathIcon } from '@heroicons/vue/24/outline'
import BaseSection from '@/components/ui/BaseSection.vue'
import BaseHeading from '@/components/ui/BaseHeading.vue'
import BaseText from '@/components/ui/BaseText.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseIcon from '@/components/ui/BaseIcon.vue'

const formData = reactive({
  firstName: '',
  lastName: '',
  email: '',
  message: ''
})

const errors = reactive({
  firstName: '',
  lastName: '',
  email: '',
  message: ''
})

const isSubmitting = ref(false)
const submitSuccess = ref(false)
const submitError = ref('')

const validateForm = () => {
  let isValid = true
  
  // Reset errors
  errors.firstName = ''
  errors.lastName = ''
  errors.email = ''
  errors.message = ''
  
  // Validate first name
  if (!formData.firstName.trim()) {
    errors.firstName = 'First name is required'
    isValid = false
  }
  
  // Validate last name
  if (!formData.lastName.trim()) {
    errors.lastName = 'Last name is required'
    isValid = false
  }
  
  // Validate email
  if (!formData.email.trim()) {
    errors.email = 'Email is required'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = 'Please enter a valid email address'
    isValid = false
  }
  
  // Validate message
  if (!formData.message.trim()) {
    errors.message = 'Message is required'
    isValid = false
  }
  
  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) return
  
  isSubmitting.value = true
  submitError.value = ''
  
  try {
    // Here you would typically send the form data to your backend
    // For now, we'll just simulate a successful submission
    await new Promise(resolve => setTimeout(resolve, 1000))
    submitSuccess.value = true
    formData.firstName = ''
    formData.lastName = ''
    formData.email = ''
    formData.message = ''
  } catch (error) {
    submitError.value = 'Failed to send message. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}
</script>