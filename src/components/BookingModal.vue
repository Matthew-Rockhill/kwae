<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="closeModal" class="relative z-50">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/40 backdrop-blur-sm" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel class="relative w-full max-w-3xl transform overflow-hidden rounded-3xl bg-gradient-to-br from-white via-white to-[var(--color-accent)]/10 shadow-2xl transition-all">
              <!-- Background decorative elements -->
              <div class="absolute -top-20 -right-20 w-40 h-40 bg-[var(--color-secondary)]/5 rounded-full blur-3xl"></div>
              <div class="absolute -bottom-20 -left-20 w-60 h-60 bg-[var(--color-accent)]/10 rounded-full blur-3xl"></div>
              
              <div class="relative p-8 lg:p-10">
                <!-- Close button -->
                <button
                  @click="closeModal"
                  class="absolute top-6 right-6 p-2 rounded-full hover:bg-[var(--color-text)]/5 transition-colors duration-300"
                  aria-label="Close dialog"
                >
                  <svg class="w-5 h-5 text-[var(--color-text)]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>

                <DialogTitle as="template">
                  <BaseHeading :level="3" align="center" class="mb-3">
                    Book Your <span class="font-cormorant italic font-normal text-[var(--color-secondary)]">Story Session</span>
                  </BaseHeading>
                </DialogTitle>
                
                <p class="text-[var(--color-text)]/70 text-center mb-8 max-w-xl mx-auto">
                  I'm excited to learn about your vision! Fill out the form below and I'll get back to you within 24-48 hours to discuss the details.
                </p>

              <!-- Success Message -->
              <Transition
                enter-active-class="transition ease-out duration-300"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-200"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <div v-if="submitSuccess" class="text-center py-12">
                  <div class="mb-6">
                    <div class="mx-auto w-20 h-20 bg-[var(--color-secondary)]/10 rounded-full flex items-center justify-center">
                      <svg class="w-10 h-10 text-[var(--color-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                      </svg>
                    </div>
                  </div>
                  <BaseHeading :level="4" align="center" class="mb-3">
                    Thank you for your booking request!
                  </BaseHeading>
                  <p class="text-[var(--color-text)]/70 mb-2">
                    I've received your request and I'm excited to learn more about your vision.
                  </p>
                  <p class="text-[var(--color-text)]/70 mb-8">
                    I'll get back to you at <span class="font-medium text-[var(--color-secondary)]">{{ formData.email }}</span> within 24-48 hours.
                  </p>
                  <BaseButton 
                    variant="secondary" 
                    @click="closeModal"
                  >
                    Close
                  </BaseButton>
                </div>
              </Transition>

              <!-- Error Message -->
              <div v-if="submitError" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div class="flex items-center">
                  <svg class="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                  </svg>
                  <span class="text-red-700 font-medium">Error</span>
                </div>
                <p class="text-red-600 text-sm mt-1">{{ submitError }}</p>
              </div>

              <form @submit.prevent="submitForm" class="space-y-6" v-if="!submitSuccess">
                <!-- Package Selection -->
                <div>
                  <label for="package" class="block text-sm font-medium text-[var(--color-text)] mb-2">
                    What are you interested in? *
                  </label>
                  <select 
                    id="package"
                    v-model="formData.selectedPackage"
                    required
                    class="w-full px-4 py-3 border border-[var(--color-text)]/10 rounded-xl focus:ring-2 focus:ring-[var(--color-secondary)] focus:border-transparent transition-all duration-300 bg-white/80"
                    :class="{ 'border-red-400 focus:ring-red-400/30 focus:border-red-400': errors.selectedPackage }"
                  >
                    <option value="">Select a package...</option>
                    <optgroup label="Portrait & Family Sessions">
                      <option value="dust-light">Dust & Light - Mini Session (R1,500)</option>
                      <option value="field-frame">Field & Frame - Full Session (R2,500)</option>
                      <option value="soil-sun">Soil & Sun - Golden Hour Session (R4,000)</option>
                    </optgroup>
                    <optgroup label="Lifestyle & Events">
                      <option value="lifestyle-event">Lifestyle & Events (From R1,500/hour)</option>
                      <option value="wedding">Wedding Photography (Custom Packages)</option>
                    </optgroup>
                    <optgroup label="Organisational Storytelling">
                      <option value="raw-thread">The Raw Thread - Short Story Package (R4,000)</option>
                      <option value="narrative-journey">The Narrative Journey - Campaigns & Reports (R6,500)</option>
                      <option value="footpath-journey">The Footpath Journey - Long-Term Partnership (From R6,000/month)</option>
                    </optgroup>
                    <option value="custom">Custom Package/Other</option>
                  </select>
                  <p v-if="errors.selectedPackage" class="text-red-500 text-sm mt-1">{{ errors.selectedPackage }}</p>
                </div>

                <!-- Name Row -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label for="firstName" class="block text-sm font-medium text-[var(--color-text)] mb-2">
                      First Name *
                    </label>
                    <input 
                      type="text" 
                      id="firstName"
                      v-model="formData.firstName"
                      required
                      placeholder="Your first name"
                      class="w-full px-4 py-3 border border-[var(--color-text)]/10 rounded-xl focus:ring-2 focus:ring-[var(--color-secondary)] focus:border-transparent transition-all duration-300 bg-white/80"
                      :class="{ 'border-red-400 focus:ring-red-400/30 focus:border-red-400': errors.firstName }"
                    />
                    <p v-if="errors.firstName" class="text-red-500 text-sm mt-1">{{ errors.firstName }}</p>
                  </div>
                  
                  <div>
                    <label for="lastName" class="block text-sm font-medium text-[var(--color-text)] mb-2">
                      Last Name *
                    </label>
                    <input 
                      type="text" 
                      id="lastName"
                      v-model="formData.lastName"
                      required
                      placeholder="Your last name"
                      class="w-full px-4 py-3 border border-[var(--color-text)]/10 rounded-xl focus:ring-2 focus:ring-[var(--color-secondary)] focus:border-transparent transition-all duration-300 bg-white/80"
                      :class="{ 'border-red-400 focus:ring-red-400/30 focus:border-red-400': errors.lastName }"
                    />
                    <p v-if="errors.lastName" class="text-red-500 text-sm mt-1">{{ errors.lastName }}</p>
                  </div>
                </div>

                <!-- Contact Details Row -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label for="email" class="block text-sm font-medium text-[var(--color-text)] mb-2">
                      Email Address *
                    </label>
                    <input 
                      type="email" 
                      id="email"
                      v-model="formData.email"
                      required
                      placeholder="your.email@example.com"
                      class="w-full px-4 py-3 border border-[var(--color-text)]/10 rounded-xl focus:ring-2 focus:ring-[var(--color-secondary)] focus:border-transparent transition-all duration-300 bg-white/80"
                      :class="{ 'border-red-400 focus:ring-red-400/30 focus:border-red-400': errors.email }"
                    />
                    <p v-if="errors.email" class="text-red-500 text-sm mt-1">{{ errors.email }}</p>
                  </div>

                  <div>
                    <label for="phone" class="block text-sm font-medium text-[var(--color-text)] mb-2">
                      Mobile Number *
                    </label>
                    <input 
                      type="tel" 
                      id="phone"
                      v-model="formData.phone"
                      required
                      placeholder="+27 XX XXX XXXX"
                      class="w-full px-4 py-3 border border-[var(--color-text)]/10 rounded-xl focus:ring-2 focus:ring-[var(--color-secondary)] focus:border-transparent transition-all duration-300 bg-white/80"
                      :class="{ 'border-red-400 focus:ring-red-400/30 focus:border-red-400': errors.phone }"
                    />
                    <p v-if="errors.phone" class="text-red-500 text-sm mt-1">{{ errors.phone }}</p>
                  </div>
                </div>

                <!-- Event Date -->
                <div>
                  <label for="eventDate" class="block text-sm font-medium text-[var(--color-text)] mb-2">
                    Preferred Date
                  </label>
                  <input 
                    type="date" 
                    id="eventDate"
                    v-model="formData.eventDate"
                    :min="minDate"
                    class="w-full px-4 py-3 border border-[var(--color-text)]/10 rounded-xl focus:ring-2 focus:ring-[var(--color-secondary)] focus:border-transparent transition-all duration-300 bg-white/80"
                  />
                  <p class="text-[var(--color-text)]/60 text-sm mt-1">I recommend booking at least 2-4 weeks in advance</p>
                </div>

                <!-- Additional Notes -->
                <div>
                  <label for="additionalNotes" class="block text-sm font-medium text-[var(--color-text)] mb-2">
                    Tell me about your vision
                  </label>
                  <textarea 
                    id="additionalNotes"
                    v-model="formData.additionalNotes"
                    rows="5"
                    placeholder="Share your story, vision, or any questions you have. The more details you provide, the better I can understand how to help bring your ideas to life."
                    class="w-full px-4 py-3 border border-[var(--color-text)]/10 rounded-xl focus:ring-2 focus:ring-[var(--color-secondary)] focus:border-transparent transition-all duration-300 resize-none bg-white/80"
                  ></textarea>
                </div>

                <!-- Submit Section -->
                <div class="pt-4">
                  <BaseButton 
                    type="submit" 
                    variant="primary" 
                    size="lg" 
                    full-width
                    :disabled="isSubmitting"
                    class="min-h-[56px] mb-6"
                  >
                    <span v-if="isSubmitting" class="flex items-center justify-center">
                      <ArrowPathIcon class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                      Sending your request...
                    </span>
                    <span v-else>Send Booking Request</span>
                  </BaseButton>
                  
                  <!-- Response Time Note -->
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
              
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed, Transition } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { ArrowPathIcon } from '@heroicons/vue/24/outline'
import { bookingService } from '@/services/bookingService'
import BaseHeading from '@/components/ui/BaseHeading.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const props = defineProps<{
  isOpen: boolean
  preSelectedPackage?: string
  onClose?: () => void
}>()

const emit = defineEmits<{
  close: []
}>()

const isSubmitting = ref(false)
const submitSuccess = ref(false)
const submitError = ref('')

const formData = reactive({
  selectedPackage: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  eventDate: '',
  additionalNotes: ''
})

// Compute minimum date (2 weeks from today)
const minDate = computed(() => {
  const date = new Date()
  date.setDate(date.getDate() + 14)
  return date.toISOString().split('T')[0]
})

const errors = reactive({
  selectedPackage: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  eventDate: '',
  additionalNotes: ''
})

// Watch for pre-selected package
watch(() => props.preSelectedPackage, (newPackage) => {
  if (newPackage) {
    formData.selectedPackage = newPackage
  }
}, { immediate: true })

// Package mapping for pre-selection
const packageMapping: { [key: string]: string } = {
  'book-dust-light': 'dust-light',
  'book-field-frame': 'field-frame',
  'book-soil-sun': 'soil-sun',
  'book-lifestyle-event': 'lifestyle-event',
  'wedding-quote': 'wedding',
  'book-raw-thread': 'raw-thread',
  'book-narrative': 'narrative-journey',
  'book-footpath': 'footpath-journey'
}

// Map action to package value
if (props.preSelectedPackage && packageMapping[props.preSelectedPackage]) {
  formData.selectedPackage = packageMapping[props.preSelectedPackage]
}

const validateForm = () => {
  let isValid = true
  
  // Reset errors
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })
  
  // Validate package selection
  if (!formData.selectedPackage.trim()) {
    errors.selectedPackage = 'Please select a package'
    isValid = false
  }
  
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
  
  // Validate phone
  if (!formData.phone.trim()) {
    errors.phone = 'Phone number is required'
    isValid = false
  } else if (!/^(\+27|0)[0-9]{9}$/.test(formData.phone.replace(/\s+/g, ''))) {
    errors.phone = 'Please enter a valid South African phone number'
    isValid = false
  }
  
  return isValid
}

const submitForm = async () => {
  if (!validateForm()) return
  
  isSubmitting.value = true
  submitError.value = ''
  
  try {
    const bookingData = {
      selectedPackage: formData.selectedPackage,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      eventDate: formData.eventDate,
      additionalNotes: formData.additionalNotes,
      submittedAt: new Date().toISOString()
    }
    
    const result = await bookingService.submitBooking(bookingData)
    
    if (result.success) {
      submitSuccess.value = true
      // Don't reset form data yet - user might want to see what they submitted
    } else {
      submitError.value = result.message || 'Failed to submit booking. Please try again or contact me directly.'
    }
  } catch (error) {
    console.error('Booking submission error:', error)
    submitError.value = 'Failed to submit booking. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}

const closeModal = () => {
  emit('close')
  submitSuccess.value = false
  submitError.value = ''
  
  // Reset form
  Object.keys(formData).forEach(key => {
    formData[key as keyof typeof formData] = ''
  })
}
</script> 