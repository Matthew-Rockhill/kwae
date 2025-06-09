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
                <div v-if="submitSuccess" class="bg-[#F6F2ED] text-[#33423C] p-4 mb-6 border border-[#DCCDC3]">
                  <div class="flex">
                    <CheckCircleIcon class="h-6 w-6 text-[#33423C] mr-2" />
                    <div>
                      <p class="font-medium">Message sent successfully!</p>
                      <p class="text-sm mt-1">Thank you for reaching out. I'll get back to you as soon as possible.</p>
                    </div>
                  </div>
                </div>
                
                <!-- Contact Form -->
                <form @submit.prevent="handleSubmit" v-if="!submitSuccess">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <!-- First Name Input -->
                    <div>
                      <label for="name" class="block text-[#33423C] font-medium mb-2">Name *</label>
                      <input 
                        type="text" 
                        id="name"
                        v-model="formData.name"
                        required
                        class="w-full px-4 py-2 border border-[#DCCDC3] focus:outline-none focus:ring-2 focus:ring-[#33423C] focus:border-transparent"
                        :class="{ 'border-red-500': errors.name }"
                      />
                      <p v-if="errors.name" class="text-red-500 text-sm mt-1">{{ errors.name }}</p>
                    </div>
                    
                    <!-- Email Input -->
                    <div>
                      <label for="email" class="block text-[#33423C] font-medium mb-2">Email *</label>
                      <input 
                        type="email" 
                        id="email"
                        v-model="formData.email"
                        required
                        class="w-full px-4 py-2 border border-[#DCCDC3] focus:outline-none focus:ring-2 focus:ring-[#33423C] focus:border-transparent"
                        :class="{ 'border-red-500': errors.email }"
                      />
                      <p v-if="errors.email" class="text-red-500 text-sm mt-1">{{ errors.email }}</p>
                    </div>
                  </div>
                  
                  <!-- Message Input -->
                  <div class="mb-6">
                    <label for="message" class="block text-[#33423C] font-medium mb-2">Your Message *</label>
                    <textarea 
                      id="message"
                      v-model="formData.message"
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
                    :disabled="isSubmitting"
                  >
                    <span v-if="isSubmitting">
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
  import { EnvelopeIcon, ClockIcon, MapPinIcon, CheckCircleIcon, ArrowPathIcon } from '@heroicons/vue/24/outline'
  
  const formData = reactive({
    name: '',
    email: '',
    message: ''
  })
  
  const errors = reactive({
    name: '',
    email: '',
    message: ''
  })
  
  const isSubmitting = ref(false)
  const submitSuccess = ref(false)
  const submitError = ref('')
  
  const validateForm = () => {
    let isValid = true
    
    // Reset errors
    errors.name = ''
    errors.email = ''
    errors.message = ''
    
    // Validate name
    if (!formData.name.trim()) {
      errors.name = 'Name is required'
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
      formData.name = ''
      formData.email = ''
      formData.message = ''
    } catch (error) {
      submitError.value = 'Failed to send message. Please try again.'
    } finally {
      isSubmitting.value = false
    }
  }
  </script>