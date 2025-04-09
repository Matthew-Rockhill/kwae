<template>
    <div>
      <!-- Page Header -->
      <section class="relative py-20 bg-[#F6F2ED]">
        <div class="container-custom text-center">
          <h1 class="font-montserrat font-extralight text-4xl md:text-5xl text-[#33423C] mb-4">Let's Connect!</h1>
          <p class="text-lg text-[#6A7D72] max-w-3xl mx-auto">
            I'm excited to hear about your story, your project, or the memories you want to capture. 
            Please fill out the form below, and I'll be in touch soon!
          </p>
        </div>
      </section>
  
      <!-- Contact Section -->
      <section class="py-16 md:py-24 bg-white">
        <div class="container-custom">
          <div class="grid grid-cols-1 lg:grid-cols-5 gap-12">
            <!-- Contact Form Column -->
            <div class="lg:col-span-3">
              <div class="bg-white p-8 md:p-10 border border-[#DCCDC3]">
                <h2 class="font-montserrat font-extralight text-2xl text-[#33423C] mb-6">Send Me a Message</h2>
                
                <!-- Success Message -->
                <div v-if="formSubmitted" class="bg-[#F6F2ED] text-[#33423C] p-4 mb-6 border border-[#DCCDC3]">
                  <div class="flex">
                    <CheckCircleIcon class="h-6 w-6 text-[#33423C] mr-2" />
                    <div>
                      <p class="font-medium">Message sent successfully!</p>
                      <p class="text-sm mt-1">Thank you for reaching out. I'll get back to you as soon as possible.</p>
                    </div>
                  </div>
                </div>
                
                <!-- Contact Form -->
                <form @submit.prevent="submitForm" v-if="!formSubmitted">
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
                    <label for="phone" class="block text-[#33423C] font-medium mb-2">Phone Number</label>
                    <input 
                      type="tel" 
                      id="phone"
                      v-model="form.phone"
                      class="w-full px-4 py-2 border border-[#DCCDC3] focus:outline-none focus:ring-2 focus:ring-[#33423C] focus:border-transparent"
                    />
                  </div>
                  
                  <!-- Inquiry Type -->
                  <div class="mb-6">
                    <label for="inquiryType" class="block text-[#33423C] font-medium mb-2">What are you interested in? *</label>
                    <select 
                      id="inquiryType"
                      v-model="form.inquiryType"
                      required
                      class="w-full px-4 py-2 border border-[#DCCDC3] focus:outline-none focus:ring-2 focus:ring-[#33423C] focus:border-transparent"
                      :class="{ 'border-red-500': errors.inquiryType }"
                    >
                      <option value="" disabled>Please select an option</option>
                      <option v-for="(option, index) in inquiryOptions" :key="index" :value="option">
                        {{ option }}
                      </option>
                    </select>
                    <p v-if="errors.inquiryType" class="text-red-500 text-sm mt-1">{{ errors.inquiryType }}</p>
                  </div>
                  
                  <!-- Message Input -->
                  <div class="mb-6">
                    <label for="message" class="block text-[#33423C] font-medium mb-2">Your Message *</label>
                    <textarea 
                      id="message"
                      v-model="form.message"
                      required
                      rows="5"
                      class="w-full px-4 py-2 border border-[#DCCDC3] focus:outline-none focus:ring-2 focus:ring-[#33423C] focus:border-transparent"
                      :class="{ 'border-red-500': errors.message }"
                    ></textarea>
                    <p v-if="errors.message" class="text-red-500 text-sm mt-1">{{ errors.message }}</p>
                  </div>
                  
                  <!-- Submit Button -->
                  <button 
                    type="submit"
                    class="btn-primary w-full py-3"
                    :disabled="submitting"
                  >
                    <span v-if="submitting">
                      <ArrowPathIcon class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" />
                      Sending...
                    </span>
                    <span v-else>Send Message</span>
                  </button>
                </form>
              </div>
            </div>
            
            <!-- Contact Info Column -->
            <div class="lg:col-span-2">
              <!-- Contact Information -->
              <div class="bg-[#F6F2ED] rounded-lg shadow-lg p-8 md:p-10 mb-8">
                <h2 class="text-2xl font-semibold mb-6 text-[#33423C]">Contact Information</h2>
                
                <div class="space-y-6">
                  <div class="flex items-start">
                    <EnvelopeIcon class="h-6 w-6 text-[#33423C] mr-3 mt-0.5" />
                    <div>
                      <h3 class="font-medium text-[#33423C]">Email</h3>
                      <a href="mailto:contact@kristinwithaneyephotography.com" class="text-[#6A7D72] hover:text-[#33423C] transition-colors">
                        contact@kristinwithaneyephotography.com
                      </a>
                    </div>
                  </div>
                  
                  <div class="flex items-start">
                    <ClockIcon class="h-6 w-6 text-[#33423C] mr-3 mt-0.5" />
                    <div>
                      <h3 class="font-medium text-[#33423C]">Response Time</h3>
                      <p class="text-[#6A7D72]">I typically respond within 24-48 hours on business days.</p>
                    </div>
                  </div>
                  
                  <div class="flex items-start">
                    <MapPinIcon class="h-6 w-6 text-[#33423C] mr-3 mt-0.5" />
                    <div>
                      <h3 class="font-medium text-[#33423C]">Location</h3>
                      <p class="text-[#6A7D72]">Based in Cape Town, South Africa</p>
                      <p class="text-[#6A7D72] text-sm">(Available for travel throughout South Africa)</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Social Media Links -->
              <div class="bg-white rounded-lg shadow-lg p-8 md:p-10">
                <h2 class="text-2xl font-semibold mb-6 text-[#33423C]">Follow Along</h2>
                
                <div class="flex space-x-4">
                  <a href="https://instagram.com/kristinwithaneye" target="_blank" class="bg-[#33423C] text-[#F6F2ED] p-4 rounded-full hover:bg-[#6A7D72] hover:shadow-lg transition-all flex items-center justify-center">
                    <font-awesome-icon :icon="['fab', 'instagram']" class="text-3xl" />
                  </a>
                  
                  <a href="https://facebook.com/kristinwithaneye" target="_blank" class="bg-[#33423C] text-[#F6F2ED] p-4 rounded-full hover:bg-[#6A7D72] hover:shadow-lg transition-all flex items-center justify-center">
                    <font-awesome-icon :icon="['fab', 'facebook']" class="text-3xl" />
                  </a>
                  
                  <a href="https://pinterest.com/kristinwithaneye" target="_blank" class="bg-[#33423C] text-[#F6F2ED] p-4 rounded-full hover:bg-[#6A7D72] hover:shadow-lg transition-all flex items-center justify-center">
                    <font-awesome-icon :icon="['fab', 'pinterest']" class="text-3xl" />
                  </a>
                </div>
                
                <p class="text-[#6A7D72] mt-6">
                  Follow along for behind-the-scenes content, photography tips, and to see my latest work!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, reactive } from 'vue'
  import { contactService } from '@/services/supabase'
  import { 
    EnvelopeIcon, 
    ClockIcon, 
    MapPinIcon,
    CheckCircleIcon,
    ArrowPathIcon
  } from '@heroicons/vue/24/outline'
  
  // Form state
  const form = reactive({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    inquiryType: '',
    message: ''
  })
  
  const errors = reactive({
    firstName: '',
    lastName: '',
    email: '',
    inquiryType: '',
    message: ''
  })
  
  const submitting = ref(false)
  const formSubmitted = ref(false)
  
  // Inquiry options
  const inquiryOptions = [
    'Personal Photography Session',
    'Event Coverage',
    'NGO/Business Storytelling',
    'Other'
  ]
  
  // Form validation
  const validateForm = () => {
    let isValid = true
    
    // Reset errors
    errors.firstName = ''
    errors.lastName = ''
    errors.email = ''
    errors.inquiryType = ''
    errors.message = ''
    
    // Validate first name
    if (!form.firstName.trim()) {
      errors.firstName = 'First name is required'
      isValid = false
    }
    
    // Validate last name
    if (!form.lastName.trim()) {
      errors.lastName = 'Last name is required'
      isValid = false
    }
    
    // Validate email
    if (!form.email.trim()) {
      errors.email = 'Email is required'
      isValid = false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = 'Please enter a valid email address'
      isValid = false
    }
    
    // Validate inquiry type
    if (!form.inquiryType) {
      errors.inquiryType = 'Please select an inquiry type'
      isValid = false
    }
    
    // Validate message
    if (!form.message.trim()) {
      errors.message = 'Message is required'
      isValid = false
    }
    
    return isValid
  }
  
  // Form submission
  const submitForm = async () => {
    if (!validateForm()) return
    
    submitting.value = true
    
    try {
      const formData = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        inquiryType: form.inquiryType,
        message: form.message,
        created_at: new Date().toISOString()
      }

      await contactService.submitContactForm(formData)
      formSubmitted.value = true

      // Reset form
      form.firstName = ''
      form.lastName = ''
      form.email = ''
      form.phone = ''
      form.inquiryType = ''
      form.message = ''
    } catch (error) {
      console.error('Error submitting form:', error)
      // You might want to show an error message to the user here
    } finally {
      submitting.value = false
    }
  }
  </script>