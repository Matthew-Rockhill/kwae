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
            <DialogPanel class="relative w-full max-w-4xl transform overflow-hidden rounded-3xl bg-gradient-to-br from-white via-white to-[var(--color-accent)]/10 shadow-2xl transition-all">
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
                  <BaseHeading :level="3" align="center" class="mb-6">
                    <span v-if="selectedVoucherType === 'sponsorship'">Support an <span class="font-cormorant italic font-normal text-[var(--color-secondary)]">Organisation</span></span>
                    <span v-else>Choose Your <span class="font-cormorant italic font-normal text-[var(--color-secondary)]">Voucher Type</span></span>
                  </BaseHeading>
                </DialogTitle>
                
                <!-- Selected Voucher Type Display -->
                <div v-if="selectedVoucherType" class="mb-6 p-4 bg-[var(--color-secondary)]/10 rounded-xl border border-[var(--color-secondary)]/20">
                  <div class="flex items-center justify-between">
                    <div>
                      <h4 class="font-medium text-lg text-[var(--color-text)]">
                        <span v-if="selectedVoucherType === 'sponsorship'">Sponsor an Organisation</span>
                        <span v-else>Gift a Story Session</span>
                      </h4>
                      <p class="text-[var(--color-text)]/70 text-sm mt-1">
                        <span v-if="selectedVoucherType === 'sponsorship'">Support meaningful storytelling by sponsoring a photography session for an organisation or cause.</span>
                        <span v-else>Purchase a voucher for someone special to capture their story and create beautiful memories.</span>
                      </p>
                    </div>
                    <button
                      @click="selectedVoucherType = selectedVoucherType === 'gift' ? 'sponsorship' : 'gift'"
                      class="px-4 py-2 text-sm bg-white/80 border border-[var(--color-secondary)]/30 rounded-lg hover:bg-[var(--color-secondary)]/10 transition-colors duration-300"
                    >
                      Switch Type
                    </button>
                  </div>
                </div>

                <!-- Voucher Type Selection -->
                <div v-if="!selectedVoucherType" class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <!-- Gift Voucher Option -->
                  <button
                    @click="selectedVoucherType = 'gift'"
                    class="p-6 border-2 rounded-xl transition-all duration-300 text-left"
                    :class="selectedVoucherType === 'gift' 
                      ? 'border-[var(--color-secondary)] bg-[var(--color-secondary)]/5' 
                      : 'border-[var(--color-text)]/10 hover:border-[var(--color-secondary)]/30'"
                  >
                    <div class="flex items-center justify-between mb-3">
                      <h4 class="font-medium text-lg">Gift a Story Session</h4>
                      <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                           :class="selectedVoucherType === 'gift' 
                             ? 'border-[var(--color-secondary)] bg-[var(--color-secondary)]' 
                             : 'border-[var(--color-text)]/20'"
                      >
                        <div v-if="selectedVoucherType === 'gift'" class="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    </div>
                    <p class="text-[var(--color-text)]/70 text-sm">
                      Purchase a voucher for someone special to capture their story and create beautiful memories.
                    </p>
                  </button>
                  
                  <!-- Sponsorship Option -->
                  <button
                    @click="selectedVoucherType = 'sponsorship'"
                    class="p-6 border-2 rounded-xl transition-all duration-300 text-left"
                    :class="selectedVoucherType === 'sponsorship' 
                      ? 'border-[var(--color-secondary)] bg-[var(--color-secondary)]/5' 
                      : 'border-[var(--color-text)]/10 hover:border-[var(--color-secondary)]/30'"
                  >
                    <div class="flex items-center justify-between mb-3">
                      <h4 class="font-medium text-lg">Sponsor an Organisation</h4>
                      <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                           :class="selectedVoucherType === 'sponsorship' 
                             ? 'border-[var(--color-secondary)] bg-[var(--color-secondary)]' 
                             : 'border-[var(--color-text)]/20'"
                      >
                        <div v-if="selectedVoucherType === 'sponsorship'" class="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    </div>
                    <p class="text-[var(--color-text)]/70 text-sm">
                      Support meaningful storytelling by sponsoring a photography session for an organisation or cause.
                    </p>
                  </button>
                </div>

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
                    <span v-if="selectedVoucherType === 'sponsorship'">Sponsorship Request Received!</span>
                    <span v-else>Voucher Request Received!</span>
                  </BaseHeading>
                  <p class="text-[var(--color-text)]/70 mb-2">
                    Thank you for your {{ selectedVoucherType === 'sponsorship' ? 'generous sponsorship' : 'thoughtful gift' }}!
                  </p>
                  <p class="text-[var(--color-text)]/70 mb-8">
                    I'll send payment instructions to <span class="font-medium text-[var(--color-secondary)]">{{ formData.purchaserEmail }}</span> within 24 hours.
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

              <form @submit.prevent="submitForm" class="space-y-8" v-if="!submitSuccess && selectedVoucherType">
                <!-- Package Selection -->
                <div>
                  <label for="package" class="block text-sm font-medium text-[var(--color-text)] mb-2">
                    <span v-if="selectedVoucherType === 'sponsorship'">Choose Sponsorship Package *</span>
                    <span v-else>Select Package for Gift Voucher *</span>
                  </label>
                  <select 
                    id="package"
                    v-model="formData.selectedPackage"
                    required
                    class="w-full px-4 py-3 border border-[var(--color-text)]/10 rounded-xl focus:ring-2 focus:ring-[var(--color-secondary)] focus:border-transparent transition-all duration-300 bg-white/80"
                    :class="{ 'border-red-400 focus:ring-red-400/30 focus:border-red-400': errors.selectedPackage }"
                  >
                    <option value="">Select a package...</option>
                    <optgroup v-if="selectedVoucherType !== 'sponsorship'" label="Portrait & Family Sessions">
                      <option value="dust-light">Dust & Light - Mini Session (R1,500)</option>
                      <option value="field-frame">Field & Frame - Full Session (R2,500)</option>
                      <option value="soil-sun">Soil & Sun - Golden Hour Session (R4,000)</option>
                    </optgroup>
                    <optgroup v-if="selectedVoucherType === 'sponsorship'" label="Organisation Storytelling">
                      <option value="raw-thread">The Raw Thread - Short Story Package (R4,000)</option>
                      <option value="narrative-journey">The Narrative Journey - Campaigns & Reports (R6,500)</option>
                    </optgroup>
                  </select>
                  <p v-if="errors.selectedPackage" class="text-red-500 text-sm mt-1">{{ errors.selectedPackage }}</p>
                </div>

                <!-- Purchaser/Sponsor Details -->
                <div>
                  <h4 class="text-lg font-medium text-[var(--color-text)] mb-4">
                    <span v-if="selectedVoucherType === 'sponsorship'">Your Details (Sponsor)</span>
                    <span v-else">Your Details (Purchaser)</span>
                  </h4>
                  
                  <!-- Purchaser Name Row -->
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label for="purchaserFirstName" class="block text-sm font-medium text-[var(--color-text)] mb-2">
                        First Name *
                      </label>
                      <input 
                        type="text" 
                        id="purchaserFirstName"
                        v-model="formData.purchaserFirstName"
                        required
                        placeholder="Your first name"
                        class="w-full px-4 py-3 border border-[var(--color-text)]/10 rounded-xl focus:ring-2 focus:ring-[var(--color-secondary)] focus:border-transparent transition-all duration-300 bg-white/80"
                        :class="{ 'border-red-400 focus:ring-red-400/30 focus:border-red-400': errors.purchaserFirstName }"
                      />
                      <p v-if="errors.purchaserFirstName" class="text-red-500 text-sm mt-1">{{ errors.purchaserFirstName }}</p>
                    </div>
                    
                    <div>
                      <label for="purchaserLastName" class="block text-sm font-medium text-[var(--color-text)] mb-2">
                        Last Name *
                      </label>
                      <input 
                        type="text" 
                        id="purchaserLastName"
                        v-model="formData.purchaserLastName"
                        required
                        placeholder="Your last name"
                        class="w-full px-4 py-3 border border-[var(--color-text)]/10 rounded-xl focus:ring-2 focus:ring-[var(--color-secondary)] focus:border-transparent transition-all duration-300 bg-white/80"
                        :class="{ 'border-red-400 focus:ring-red-400/30 focus:border-red-400': errors.purchaserLastName }"
                      />
                      <p v-if="errors.purchaserLastName" class="text-red-500 text-sm mt-1">{{ errors.purchaserLastName }}</p>
                    </div>
                  </div>

                  <!-- Purchaser Contact Details Row -->
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label for="purchaserEmail" class="block text-sm font-medium text-[var(--color-text)] mb-2">
                        Email Address *
                      </label>
                      <input 
                        type="email" 
                        id="purchaserEmail"
                        v-model="formData.purchaserEmail"
                        required
                        placeholder="your.email@example.com"
                        class="w-full px-4 py-3 border border-[var(--color-text)]/10 rounded-xl focus:ring-2 focus:ring-[var(--color-secondary)] focus:border-transparent transition-all duration-300 bg-white/80"
                        :class="{ 'border-red-400 focus:ring-red-400/30 focus:border-red-400': errors.purchaserEmail }"
                      />
                      <p v-if="errors.purchaserEmail" class="text-red-500 text-sm mt-1">{{ errors.purchaserEmail }}</p>
                    </div>

                    <div>
                      <label for="purchaserPhone" class="block text-sm font-medium text-[var(--color-text)] mb-2">
                        Mobile Number *
                      </label>
                      <input 
                        type="tel" 
                        id="purchaserPhone"
                        v-model="formData.purchaserPhone"
                        required
                        placeholder="+27 XX XXX XXXX"
                        class="w-full px-4 py-3 border border-[var(--color-text)]/10 rounded-xl focus:ring-2 focus:ring-[var(--color-secondary)] focus:border-transparent transition-all duration-300 bg-white/80"
                        :class="{ 'border-red-400 focus:ring-red-400/30 focus:border-red-400': errors.purchaserPhone }"
                      />
                      <p v-if="errors.purchaserPhone" class="text-red-500 text-sm mt-1">{{ errors.purchaserPhone }}</p>
                    </div>
                  </div>
                </div>

                <!-- Recipient/Organisation Details -->
                <div>
                  <h4 class="text-lg font-medium text-[var(--color-text)] mb-4">
                    <span v-if="selectedVoucherType === 'sponsorship'">Organisation Details</span>
                    <span v-else">Gift Recipient Details</span>
                  </h4>
                  
                  <!-- Recipient Name -->
                  <div class="mb-6">
                    <label for="recipientName" class="block text-sm font-medium text-[var(--color-text)] mb-2">
                      <span v-if="selectedVoucherType === 'sponsorship'">Organisation Name *</span>
                      <span v-else">Recipient Name *</span>
                    </label>
                    <input 
                      type="text" 
                      id="recipientName"
                      v-model="formData.recipientName"
                      required
                      :placeholder="selectedVoucherType === 'sponsorship' ? 'Organisation or NGO name' : 'Gift recipient full name'"
                      class="w-full px-4 py-3 border border-[var(--color-text)]/10 rounded-xl focus:ring-2 focus:ring-[var(--color-secondary)] focus:border-transparent transition-all duration-300 bg-white/80"
                      :class="{ 'border-red-400 focus:ring-red-400/30 focus:border-red-400': errors.recipientName }"
                    />
                    <p v-if="errors.recipientName" class="text-red-500 text-sm mt-1">{{ errors.recipientName }}</p>
                  </div>

                  <!-- Recipient Contact Details Row (Optional) -->
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label for="recipientEmail" class="block text-sm font-medium text-[var(--color-text)] mb-2">
                        <span v-if="selectedVoucherType === 'sponsorship'">Contact Email (Optional)</span>
                        <span v-else">Recipient Email (Optional)</span>
                      </label>
                      <input 
                        type="email" 
                        id="recipientEmail"
                        v-model="formData.recipientEmail"
                        :placeholder="selectedVoucherType === 'sponsorship' ? 'organisation@example.com' : 'recipient@example.com'"
                        class="w-full px-4 py-3 border border-[var(--color-text)]/10 rounded-xl focus:ring-2 focus:ring-[var(--color-secondary)] focus:border-transparent transition-all duration-300 bg-white/80"
                      />
                    </div>

                    <div>
                      <label for="recipientPhone" class="block text-sm font-medium text-[var(--color-text)] mb-2">
                        <span v-if="selectedVoucherType === 'sponsorship'">Contact Number (Optional)</span>
                        <span v-else">Recipient Phone (Optional)</span>
                      </label>
                      <input 
                        type="tel" 
                        id="recipientPhone"
                        v-model="formData.recipientPhone"
                        placeholder="+27 XX XXX XXXX"
                        class="w-full px-4 py-3 border border-[var(--color-text)]/10 rounded-xl focus:ring-2 focus:ring-[var(--color-secondary)] focus:border-transparent transition-all duration-300 bg-white/80"
                      />
                    </div>
                  </div>
                </div>

                <!-- Message -->
                <div>
                  <label for="message" class="block text-sm font-medium text-[var(--color-text)] mb-2">
                    <span v-if="selectedVoucherType === 'sponsorship'">Sponsorship Message (Optional)</span>
                    <span v-else">Gift Message (Optional)</span>
                  </label>
                  <textarea 
                    id="message"
                    v-model="formData.message"
                    rows="4"
                    :placeholder="selectedVoucherType === 'sponsorship' ? 'Why are you sponsoring this organisation? Share your message of support...' : 'Add a personal message for the gift recipient...'"
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
                      <span v-if="selectedVoucherType === 'sponsorship'">Submitting sponsorship...</span>
                      <span v-else>Creating voucher...</span>
                    </span>
                    <span v-else>
                      <span v-if="selectedVoucherType === 'sponsorship'">Submit Sponsorship Request</span>
                      <span v-else">Create Gift Voucher</span>
                    </span>
                  </BaseButton>
                  
                  <!-- Note about payment -->
                  <div class="flex items-center justify-center text-center">
                    <div class="flex items-center">
                      <svg class="w-5 h-5 text-[var(--color-secondary)] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      <p class="text-[var(--color-text)]/70 text-sm">Payment instructions will be sent via email within 24 hours</p>
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
import { ref, reactive, Transition, watch } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { ArrowPathIcon } from '@heroicons/vue/24/outline'
import BaseHeading from '@/components/ui/BaseHeading.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { voucherService, type VoucherData } from '@/services/voucherService'

interface Props {
  isOpen: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  close: []
}>()

const isSubmitting = ref(false)
const submitSuccess = ref(false)
const submitError = ref('')
const selectedVoucherType = ref<'gift' | 'sponsorship' | null>(null)

const formData = reactive({
  selectedPackage: '',
  purchaserFirstName: '',
  purchaserLastName: '',
  purchaserEmail: '',
  purchaserPhone: '',
  recipientName: '',
  recipientEmail: '',
  recipientPhone: '',
  message: ''
})

const errors = reactive({
  selectedPackage: '',
  purchaserFirstName: '',
  purchaserLastName: '',
  purchaserEmail: '',
  purchaserPhone: '',
  recipientName: ''
})

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
  
  // Validate purchaser first name
  if (!formData.purchaserFirstName.trim()) {
    errors.purchaserFirstName = 'First name is required'
    isValid = false
  }
  
  // Validate purchaser last name
  if (!formData.purchaserLastName.trim()) {
    errors.purchaserLastName = 'Last name is required'
    isValid = false
  }
  
  // Validate purchaser email
  if (!formData.purchaserEmail.trim()) {
    errors.purchaserEmail = 'Email is required'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.purchaserEmail)) {
    errors.purchaserEmail = 'Please enter a valid email address'
    isValid = false
  }
  
  // Validate purchaser phone
  if (!formData.purchaserPhone.trim()) {
    errors.purchaserPhone = 'Phone number is required'
    isValid = false
  } else if (!/^(\+27|0)[0-9]{9}$/.test(formData.purchaserPhone.replace(/\s+/g, ''))) {
    errors.purchaserPhone = 'Please enter a valid South African phone number'
    isValid = false
  }
  
  // Validate recipient name
  if (!formData.recipientName.trim()) {
    errors.recipientName = selectedVoucherType.value === 'sponsorship' ? 'Organisation name is required' : 'Recipient name is required'
    isValid = false
  }
  
  return isValid
}

const submitForm = async () => {
  if (!validateForm()) return
  
  isSubmitting.value = true
  submitError.value = ''
  
  try {
    const voucherData: VoucherData = {
      packageType: formData.selectedPackage,
      voucherType: selectedVoucherType.value as 'gift' | 'sponsorship',
      purchaserName: `${formData.purchaserFirstName} ${formData.purchaserLastName}`,
      purchaserEmail: formData.purchaserEmail,
      personalMessage: formData.message || undefined
    }

    // Add voucher type specific fields
    if (selectedVoucherType.value === 'gift') {
      voucherData.recipientName = formData.recipientName
      voucherData.recipientEmail = formData.recipientEmail || undefined
    } else {
      voucherData.organizationName = formData.recipientName
    }
    
    const result = await voucherService.createVoucher(voucherData)
    
    if (result.success) {
      submitSuccess.value = true
      // Don't reset form data yet - user might want to see what they submitted
    } else {
      submitError.value = result.message || 'Failed to create voucher. Please try again or contact me directly.'
    }
  } catch (error) {
    console.error('Voucher submission error:', error)
    submitError.value = 'Failed to create voucher. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}

// Watch for voucher type changes and reset package selection
watch(selectedVoucherType, (newType, oldType) => {
  if (newType !== oldType) {
    formData.selectedPackage = ''
    // Clear any validation errors
    errors.selectedPackage = ''
  }
})

const closeModal = () => {
  emit('close')
  submitSuccess.value = false
  submitError.value = ''
  selectedVoucherType.value = null // Reset to selection screen
  
  // Reset form
  Object.keys(formData).forEach(key => {
    formData[key as keyof typeof formData] = ''
  })
  
  // Reset errors
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })
}
</script>