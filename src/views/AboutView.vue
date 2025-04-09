<template>
    <div>
      <!-- Page Header -->
      <section class="relative py-20 bg-[#F6F2ED]">
        <div class="container-custom text-center">
          <h1 class="font-montserrat font-extralight text-4xl md:text-5xl text-[#33423C] mb-4">About Kristin – Your Storyteller Behind the Lens</h1>
          <p class="text-lg text-[#6A7D72] max-w-3xl mx-auto">
            The heart and eyes behind Kristin With An Eye
          </p>
        </div>
      </section>
      
      <!-- About Content -->
      <section class="py-16 md:py-24 bg-white">
        <div class="container-custom">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <!-- About Image -->
            <div class="relative">
              <div class="overflow-hidden">
                <!-- <img 
                  src="/images/about-main.jpg" 
                  alt="Kristin with her family" 
                  class="w-full h-auto"
                /> -->
              </div>
              <div class="absolute -bottom-6 -right-6 w-56 h-56 bg-[#DCCDC3]/20 rounded-full -z-10"></div>
              <div class="absolute -top-6 -left-6 w-40 h-40 bg-[#33423C]/10 rounded-full -z-10"></div>
            </div>
            
            <!-- About Content -->
            <div class="space-y-6">
              <p class="text-lg text-[#33423C] leading-relaxed">
                Hi, I'm Kristin, the heart and eyes behind Kristin With An Eye. My journey as a photographer is
                self taught and began with a passion for storytelling. Since I was a little girl I have always been
                intrigued by capturing moments and advocating for issues that are close to my heart.
              </p>
              
              <p class="text-lg text-[#33423C] leading-relaxed">
                As my family has grown, with my talented husband Matt and my two precious special boys, so too has
                my passion for capturing beauty in humble places. I've always been drawn to the beauty of the
                simple, everyday moments - those often overlooked, yet deeply meaningful parts of life. I
                believe every moment has a story, and I'm here to help you tell yours.
              </p>
              
              <div class="border-l-4 border-[#DCCDC3] pl-6 py-2 my-8">
                <p class="text-xl italic text-[#33423C] font-cormorant">
                  "I am committed to capturing authentic moments - whether it's a laugh shared with family, the
                  quiet beauty of nature, or the passionate work of purpose-driven organisations."
                </p>
              </div>
              
              <p class="text-lg text-[#33423C] leading-relaxed">
                My approach is grounded in trust and connection. I work closely with my clients to ensure their stories are told in
                a way that feels true to them. I believe that storytelling has the power to expand our reach, to connect people, and to inspire
                change.
              </p>
              
              <router-link to="/contact" class="btn-primary inline-block mt-4">
                Work With Me
              </router-link>
            </div>
          </div>
        </div>
      </section>
      
      <!-- My Approach -->
      <section class="py-16 md:py-24 bg-gray-50">
        <div class="container-custom">
          <div class="text-center max-w-3xl mx-auto mb-16">
            <h2 class="section-title">My Approach</h2>
            <p class="section-subtitle">
              What makes my photography unique is the way I approach each session and story.
            </p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div v-for="approach in approaches" :key="approach.title" class="flex flex-col items-center text-center">
              <div class="mb-4 text-[#33423C]">
                <component :is="approach.icon" class="h-12 w-12" />
              </div>
              <h3 class="text-xl font-serif mb-2">{{ approach.title }}</h3>
              <p class="text-[#6A7D72]">{{ approach.description }}</p>
            </div>
          </div>
        </div>
      </section>
      
      <!-- My Journey Section -->
      <section class="py-16 md:py-20 bg-[#F6F2ED]">
        <div class="container-custom">
          <h2 class="text-3xl md:text-4xl font-bold text-center mb-12 text-[#33423C]">My Journey</h2>
          <div class="relative max-w-3xl mx-auto">
            <!-- Timeline line -->
            <div class="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-[#33423C]/20"></div>
            
            <!-- Timeline items -->
            <div class="space-y-12">
              <div v-for="(milestone, index) in milestones" :key="milestone.year" 
                   class="relative flex items-center">
                <!-- Timeline dot -->
                <div class="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-[#33423C] z-10"></div>
                
                <!-- Content -->
                <div :class="[
                  'w-5/12 p-6 rounded-lg shadow-md',
                  index % 2 === 0 ? 'mr-auto' : 'ml-auto',
                  'bg-white'
                ]">
                  <div class="flex flex-col items-center text-center">
                    <div class="mb-4 text-[#33423C]">
                      <component :is="milestone.icon" class="h-12 w-12" />
                    </div>
                    <h3 class="text-xl font-serif mb-2">{{ milestone.title }}</h3>
                    <p class="text-[#6A7D72]">{{ milestone.description }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- CTA Section -->
      <section class="py-16 md:py-20 bg-white text-[#33423C]">
        <div class="container-custom text-center">
          <h2 class="text-3xl md:text-4xl font-bold mb-6">Let's Create Beautiful Stories Together</h2>
          <p class="text-lg md:text-xl max-w-2xl mx-auto mb-10 text-[#6A7D72]">
            I'd love to work with you to capture your special moments and tell your unique story.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <router-link to="/portfolio" class="bg-[#33423C] text-[#F6F2ED] hover:bg-[#6A7D72] font-medium py-3 px-8 rounded-md transition duration-300 text-lg">
              See My Work
            </router-link>
            <router-link to="/contact" class="bg-transparent border-2 border-[#33423C] text-[#33423C] hover:bg-[#33423C] hover:text-[#F6F2ED] font-medium py-3 px-8 rounded-md transition duration-300 text-lg">
              Contact Me
            </router-link>
          </div>
        </div>
      </section>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { 
    HeartIcon,
    BookOpenIcon,
    HomeIcon,
    ClockIcon,
    UserGroupIcon,
    MapPinIcon,
    CheckCircleIcon
  } from '@heroicons/vue/24/outline'
  
  // Sample approaches (replace with real data later)
  const approaches = ref([
    {
      title: "Authentic Moments",
      description: "I focus on genuine emotions and real connections, creating images that reflect who you truly are and the beauty of your relationships.",
      icon: HeartIcon
    },
    {
      title: "Natural Storytelling",
      description: "I tell stories through images, focusing on the narrative elements that make your session unique and meaningful to you.",
      icon: BookOpenIcon
    },
    {
      title: "Comfortable Experience",
      description: "I create a relaxed environment where you can be yourself, resulting in photographs that capture your genuine personality.",
      icon: HomeIcon
    }
  ])
  
  // Sample milestones (replace with real data later)
  const milestones = ref([
    {
      year: "2016",
      title: "Beginning of the Journey",
      description: "Started self-teaching photography after the birth of my first son, wanting to capture every precious moment of his growth and development.",
      icon: ClockIcon
    },
    {
      year: "2018",
      title: "First Client Sessions",
      description: "Started taking photos for friends and family, developing my style and approach to capturing authentic moments.",
      icon: UserGroupIcon
    },
    {
      year: "2020",
      title: "NGO Collaborations",
      description: "Began partnering with local non-profits to tell their stories through photography, combining my passion for social causes with my love of visual storytelling.",
      icon: MapPinIcon
    },
    {
      year: "2022",
      title: "Kristin With An Eye Launch",
      description: "Officially launched my photography business, focusing on authentic storytelling for families and purpose-driven organizations.",
      icon: CheckCircleIcon
    }
  ])
  </script>