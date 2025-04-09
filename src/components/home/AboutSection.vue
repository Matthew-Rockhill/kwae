<template>
    <section id="about" class="py-24 md:py-32 bg-[#F6F2ED]">
      <div class="container-custom">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <!-- Left Column: Content -->
          <div class="order-2 lg:order-1">
            <h2 class="text-3xl md:text-4xl font-extralight text-[#33423C] mb-6">
              The Heart Behind <span class="font-cormorant italic font-normal text-[#6A7D72]">Kristin With An Eye</span>
            </h2>
            
            <div class="mt-10 space-y-6">
              <p class="text-[#33423C] text-lg font-light leading-relaxed">
                As a photographer and storyteller, my mission is simple: to capture authentic moments, 
                to find beauty in humble places, and to share stories that connect us all.
              </p>
              
              <div class="pl-6 border-l-2 border-[#DCCDC3] py-2">
                <p class="font-cormorant text-xl italic text-[#6A7D72]">
                  "I aim to help individuals, families, and organisations expand their reach and make 
                  an impact through visual storytelling."
                </p>
              </div>
              
              <p class="text-[#33423C] text-lg font-light leading-relaxed">
                My approach is earthy, natural, and raw. I want you to feel comfortable, seen, and heard. 
                Whether you're booking a personal photography session or seeking to share the heart of your 
                business or NGO, I am committed to showcasing your unique story in a way that resonates with 
                your audience.
              </p>
              
              <div class="mt-10">
                <router-link to="/about">
                  <button class="btn-secondary">
                    DISCOVER MY APPROACH
                  </button>
                </router-link>
              </div>
            </div>
          </div>
          
          <!-- Right Column: Image -->
          <div class="order-1 lg:order-2 relative">
            <div class="relative overflow-hidden">
              <!-- <img 
                src="/images/about-home.jpg" 
                alt="Kristin, the photographer" 
                class="w-full h-auto object-cover"
              /> -->
              
              <!-- Decorative elements -->
              <div class="absolute -bottom-4 -right-4 w-24 h-24 bg-[#DCCDC3] -z-10"></div>
            </div>
            <div class="absolute -top-4 -left-4 w-24 h-24 bg-[#6A7D72] -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  </template>
  
  <script setup lang="ts">
  // No special logic needed
  </script>