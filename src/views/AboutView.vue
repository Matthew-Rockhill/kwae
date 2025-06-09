<template>
  <div>
    <!-- Page Header -->
    <section class="relative py-20 bg-[#F6F2ED]">
      <div class="container-custom">
        <div class="max-w-3xl mx-auto text-center">
          <h1 class="text-4xl md:text-5xl font-extralight text-[#33423C] mb-6">
            About Kristin – <span class="font-cormorant italic font-normal text-[#6A7D72]">Your Storyteller Behind the Lens</span>
          </h1>
          <p class="text-[#6A7D72] text-lg font-light leading-relaxed">
            Through my lens, I tell stories that matter, preserving memories that last a lifetime.
          </p>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <section class="py-16 md:py-24 bg-white">
      <div class="container-custom">
        <!-- First Content Block -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-24">
          <!-- Left Column: Image -->
          <div class="relative">
            <div class="aspect-[3/4] overflow-hidden rounded-lg">
              <img 
                src="@/assets/images/about-1.jpg" 
                alt="Kristin" 
                class="w-full h-full object-cover"
              />
            </div>
          </div>
          
          <!-- Right Column: Content -->
          <div class="flex flex-col justify-center">
            <div class="prose prose-lg max-w-none">
              <p class="text-[#33423C] text-lg font-light leading-relaxed mb-6">
                Hi, I'm Kristin, the heart and eyes behind Kristin With An Eye. I'm based in Cape Town but wander often, always seeking beauty in both people and places. I'm a wife to my incredible husband Matthew and mom to two very special boys. I'm passionate about exploring the world and capturing the quiet, meaningful moments that often go unnoticed.
              </p>
              
              <div class="pl-6 border-l-2 border-[#DCCDC3] py-2 mb-6">
                <p class="font-cormorant text-xl italic text-[#6A7D72]">
                  I believe storytelling has the power to connect hearts, expand understanding, and spark change.
                </p>
              </div>

              <p class="text-[#33423C] text-lg font-light leading-relaxed mb-6">
                My journey into photography and visual storytelling began with a deep curiosity and love for stories. Since I was a young girl, I've been drawn to the gold in people and the poetry in everyday life. I was always capturing moments, advocating for causes close to my heart, and eventually found myself in the world of community development.
              </p>
            </div>
          </div>
        </div>

        <!-- Second Content Block -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <!-- Left Column: Content -->
          <div class="flex flex-col justify-center order-2 lg:order-1">
            <div class="prose prose-lg max-w-none">
              <p class="text-[#33423C] text-lg font-light leading-relaxed mb-6">
                With a background in Print Journalism and Social Anthropology, and over a decade of experience in the NGO and EdTech sectors, storytelling has always been part of my path. Photography was a quiet passion that kept resurfacing - a gift God gently, persistently invited me to embrace. What began as a whisper became a calling I could no longer ignore.
              </p>

              <div class="pl-6 border-l-2 border-[#DCCDC3] py-2 mb-6">
                <p class="font-cormorant text-xl italic text-[#6A7D72]">
                  I'm drawn to humble beauty - the real, raw, and often overlooked parts of life. I believe every moment holds a story worth telling.
                </p>
              </div>

              <p class="text-[#33423C] text-lg font-light leading-relaxed mb-6">
                As a family, we made the bold and beautiful decision to pursue this vision wholeheartedly. I longed for more presence with our boys, space to create, and a way to build something soulful and sustainable. This time with them has been a sacred gift - a reminder of what truly matters.
              </p>

              <p class="text-[#33423C] text-lg font-light leading-relaxed mb-6">
                Through Kristin With An Eye, we capture beauty in humble places and tell stories that matter for individuals, families, and organisations.
              </p>

              <p class="text-[#33423C] text-lg font-light leading-relaxed mb-6">
                Whether it's a laugh shared around a kitchen table, the quiet strength of a community leader, or a landscape soaked in light, we are committed to capturing it with honesty, heart, and intention.
              </p>

              <p class="text-[#33423C] text-lg font-light leading-relaxed">
                Our approach is rooted in trust and connection. We walk closely with each client to ensure your story is told in a way that feels true to you.
              </p>
            </div>
          </div>

          <!-- Right Column: Image -->
          <div class="relative order-1 lg:order-2">
            <div class="aspect-[3/4] overflow-hidden rounded-lg">
              <img 
                src="@/assets/images/about-2.jpg" 
                alt="Kristin's work" 
                class="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 md:py-20 bg-[#F6F2ED] text-[#33423C]">
      <div class="container-custom text-center">
        <h2 class="text-3xl md:text-4xl font-extralight mb-6">
          Ready to <span class="font-cormorant italic font-normal text-[#6A7D72]">Tell Your Story?</span>
        </h2>
        <p class="text-lg md:text-xl max-w-2xl mx-auto mb-10 text-[#6A7D72] font-light">
          Let's work together to capture your authentic moments and create beautiful memories that last a lifetime.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <router-link to="/portfolio" class="btn-primary">
            See My Work
          </router-link>
          <router-link to="/contact" class="btn-secondary">
            Get in Touch
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// Remove unused variables
// const approaches = ref([])
// const milestones = ref([])

// Keep other necessary code
</script>