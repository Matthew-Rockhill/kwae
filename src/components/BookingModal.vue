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
        <div class="fixed inset-0 bg-black/30" />
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
            <DialogPanel class="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-[var(--color-light)] p-6 text-left align-middle shadow-xl transition-all">
              <DialogTitle as="h3" class="font-montserrat text-2xl font-medium text-[var(--color-text)] mb-4">
                Book Your Session
              </DialogTitle>
              
              <p class="text-[var(--color-text)]/70 text-sm mb-6">
                Fill out the form below and I'll get back to you within 24-48 hours at 
                <a href="mailto:hello@kristinmathilde.com" class="text-[var(--color-secondary)] hover:underline">hello@kristinmathilde.com</a>
              </p>

              <!-- Success Message -->
              <div v-if="submitSuccess" class="mb-6 p-4 bg-[var(--color-secondary)]/10 border border-[var(--color-secondary)]/20 rounded-lg">
                <div class="flex items-center">
                  <svg class="w-5 h-5 text-[var(--color-secondary)] mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                  </svg>
                  <span class="text-[var(--color-secondary)] font-medium">Success!</span>
                </div>
                <p class="text-[var(--color-text)] text-sm mt-1">
                  Your booking request has been submitted successfully. I'll get back to you within 24-48 hours!
                </p>
              </div>

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

              <form @submit.prevent="submitForm" class="mt-4" v-if="!submitSuccess">
                <!-- Package Selection -->
                <div class="mb-6">
                  <label for="package" class="block text-[var(--color-text)] font-medium mb-2">Package/Service *</label>
                  <select 
                    id="package"
                    v-model="formData.selectedPackage"
                    required
                    class="w-full px-4 py-2 border border-[var(--color-card-header)] focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] focus:border-transparent rounded-lg"
                    :class="{ 'border-red-500': errors.selectedPackage }"
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

                <!-- Phone Input -->
                <div class="mb-6">
                  <label for="phone" class="block text-[var(--color-text)] font-medium mb-2">Phone Number *</label>
                  <input 
                    type="tel" 
                    id="phone"
                    v-model="formData.phone"
                    required
                    class="w-full px-4 py-2 border border-[var(--color-card-header)] focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] focus:border-transparent rounded-lg"
                    :class="{ 'border-red-500': errors.phone }"
                  />
                  <p v-if="errors.phone" class="text-red-500 text-sm mt-1">{{ errors.phone }}</p>
                </div>

                <!-- Event Date -->
                <div class="mb-6">
                  <label for="eventDate" class="block text-[var(--color-text)] font-medium mb-2">Preferred Date</label>
                  <input 
                    type="date" 
                    id="eventDate"
                    v-model="formData.eventDate"
                    class="w-full px-4 py-2 border border-[var(--color-card-header)] focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] focus:border-transparent rounded-lg"
                  />
                </div>

                <!-- Additional Notes -->
                <div class="mb-6">
                  <label for="additionalNotes" class="block text-[var(--color-text)] font-medium mb-2">Additional Notes</label>
                  <textarea 
                    id="additionalNotes"
                    v-model="formData.additionalNotes"
                    rows="3"
                    placeholder="Any specific requirements or questions?"
                    class="w-full px-4 py-2 border border-[var(--color-card-header)] focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] focus:border-transparent rounded-lg"
                  ></textarea>
                </div>

                <div class="mt-6 flex justify-end gap-4">
                  <button
                    type="button"
                    class="px-4 py-2 text-[var(--color-text)] hover:text-[var(--color-secondary)] transition-colors"
                    @click="closeModal"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    class="btn-primary px-4 py-2"
                    :disabled="isSubmitting"
                  >
                    <span v-if="isSubmitting">
                      <ArrowPathIcon class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" />
                      Submitting...
                    </span>
                    <span v-else>Submit Booking</span>
                  </button>
                </div>
              </form>
              
              <!-- Close button for success state -->
              <div v-if="submitSuccess" class="mt-6 flex justify-end">
                <button
                  type="button"
                  class="btn-primary px-4 py-2"
                  @click="closeModal"
                >
                  Close
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { ArrowPathIcon } from '@heroicons/vue/24/outline'
import { bookingService } from '@/services/bookingService'

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
      
      // Reset form
      Object.keys(formData).forEach(key => {
        formData[key as keyof typeof formData] = ''
      })
      
      // Show success message for a few seconds then close
      setTimeout(() => {
        closeModal()
      }, 3000)
    } else {
      submitError.value = result.message
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