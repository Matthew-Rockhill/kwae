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
            <DialogPanel class="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
              <DialogTitle as="h3" class="font-montserrat text-2xl font-medium text-[#33423C] mb-4">
                Book Your {{ packageTitle }} Session
              </DialogTitle>

              <form @submit.prevent="submitForm" class="mt-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <!-- First Name Input -->
                  <div>
                    <label for="firstName" class="block text-[#33423C] font-medium mb-2">First Name *</label>
                    <input 
                      type="text" 
                      id="firstName"
                      v-model="form.firstName"
                      required
                      class="w-full px-4 py-2 border border-[#DCCDC3] focus:outline-none focus:ring-2 focus:ring-[#33423C] focus:border-transparent"
                      :class="{ 'border-red-500': errors.firstName }"
                    />
                    <p v-if="errors.firstName" class="text-red-500 text-sm mt-1">{{ errors.firstName }}</p>
                  </div>
                  
                  <!-- Last Name Input -->
                  <div>
                    <label for="lastName" class="block text-[#33423C] font-medium mb-2">Last Name *</label>
                    <input 
                      type="text" 
                      id="lastName"
                      v-model="form.lastName"
                      required
                      class="w-full px-4 py-2 border border-[#DCCDC3] focus:outline-none focus:ring-2 focus:ring-[#33423C] focus:border-transparent"
                      :class="{ 'border-red-500': errors.lastName }"
                    />
                    <p v-if="errors.lastName" class="text-red-500 text-sm mt-1">{{ errors.lastName }}</p>
                  </div>
                </div>

                <!-- Email Input -->
                <div class="mb-6">
                  <label for="email" class="block text-[#33423C] font-medium mb-2">Email *</label>
                  <input 
                    type="email" 
                    id="email"
                    v-model="form.email"
                    required
                    class="w-full px-4 py-2 border border-[#DCCDC3] focus:outline-none focus:ring-2 focus:ring-[#33423C] focus:border-transparent"
                    :class="{ 'border-red-500': errors.email }"
                  />
                  <p v-if="errors.email" class="text-red-500 text-sm mt-1">{{ errors.email }}</p>
                </div>

                <!-- Phone Input -->
                <div class="mb-6">
                  <label for="phone" class="block text-[#33423C] font-medium mb-2">Phone Number *</label>
                  <input 
                    type="tel" 
                    id="phone"
                    v-model="form.phone"
                    required
                    class="w-full px-4 py-2 border border-[#DCCDC3] focus:outline-none focus:ring-2 focus:ring-[#33423C] focus:border-transparent"
                    :class="{ 'border-red-500': errors.phone }"
                  />
                  <p v-if="errors.phone" class="text-red-500 text-sm mt-1">{{ errors.phone }}</p>
                </div>

                <!-- Event Date -->
                <div class="mb-6">
                  <label for="eventDate" class="block text-[#33423C] font-medium mb-2">Preferred Date</label>
                  <input 
                    type="date" 
                    id="eventDate"
                    v-model="form.eventDate"
                    class="w-full px-4 py-2 border border-[#DCCDC3] focus:outline-none focus:ring-2 focus:ring-[#33423C] focus:border-transparent"
                  />
                </div>

                <!-- Event Location -->
                <div class="mb-6">
                  <label for="eventLocation" class="block text-[#33423C] font-medium mb-2">Event Location</label>
                  <input 
                    type="text" 
                    id="eventLocation"
                    v-model="form.eventLocation"
                    placeholder="Where will the session take place?"
                    class="w-full px-4 py-2 border border-[#DCCDC3] focus:outline-none focus:ring-2 focus:ring-[#33423C] focus:border-transparent"
                  />
                </div>

                <!-- Additional Notes -->
                <div class="mb-6">
                  <label for="additionalNotes" class="block text-[#33423C] font-medium mb-2">Additional Notes</label>
                  <textarea 
                    id="additionalNotes"
                    v-model="form.additionalNotes"
                    rows="3"
                    placeholder="Any specific requirements or questions?"
                    class="w-full px-4 py-2 border border-[#DCCDC3] focus:outline-none focus:ring-2 focus:ring-[#33423C] focus:border-transparent"
                  ></textarea>
                </div>

                <div class="mt-6 flex justify-end gap-4">
                  <button
                    type="button"
                    class="px-4 py-2 text-[#33423C] hover:text-[#6A7D72] transition-colors"
                    @click="closeModal"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    class="btn-primary px-4 py-2"
                    :disabled="submitting"
                  >
                    <span v-if="submitting">
                      <ArrowPathIcon class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" />
                      Submitting...
                    </span>
                    <span v-else>Submit Booking</span>
                  </button>
                </div>
              </form>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { ArrowPathIcon } from '@heroicons/vue/24/outline'
import { bookingService } from '@/services/supabase'

const props = defineProps<{
  isOpen: boolean
  packageTitle: string
  packageType: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

// Form state
const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  eventDate: '',
  eventLocation: '',
  additionalNotes: '',
  packageType: props.packageType
})

const errors = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: ''
})

const submitting = ref(false)

// Form validation
const validateForm = () => {
  let isValid = true
  errors.firstName = ''
  errors.lastName = ''
  errors.email = ''
  errors.phone = ''

  if (!form.firstName.trim()) {
    errors.firstName = 'First name is required'
    isValid = false
  }

  if (!form.lastName.trim()) {
    errors.lastName = 'Last name is required'
    isValid = false
  }

  if (!form.email.trim()) {
    errors.email = 'Email is required'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Please enter a valid email address'
    isValid = false
  }

  if (!form.phone.trim()) {
    errors.phone = 'Phone number is required'
    isValid = false
  }

  return isValid
}

const closeModal = () => {
  emit('close')
}

// Form submission
const submitForm = async () => {
  if (!validateForm()) return

  submitting.value = true

  try {
    await bookingService.submitBookingForm(form)
    closeModal()
    // You might want to show a success toast here
  } catch (error) {
    console.error('Error submitting booking:', error)
    // You might want to show an error message here
  } finally {
    submitting.value = false
  }
}
</script> 