<template>
  <Transition
    enter-active-class="transform ease-out duration-300 transition"
    enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
    enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
    leave-active-class="transition ease-in duration-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="show"
      class="fixed bottom-0 right-0 m-6 z-50 max-w-sm w-full"
    >
      <div
        class="bg-white rounded-2xl shadow-2xl border overflow-hidden"
        :class="borderClass"
      >
        <div class="p-6">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <!-- Success Icon -->
              <svg 
                v-if="type === 'success'" 
                class="h-6 w-6 text-green-600" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
              
              <!-- Error Icon -->
              <svg 
                v-if="type === 'error'" 
                class="h-6 w-6 text-red-600" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
              
              <!-- Info Icon -->
              <svg 
                v-if="type === 'info'" 
                class="h-6 w-6 text-[var(--color-secondary)]" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
            </div>
            
            <div class="ml-3 flex-1">
              <h3 v-if="title" class="text-sm font-medium text-[var(--color-text)]">
                {{ title }}
              </h3>
              <div class="mt-1 text-sm text-[var(--color-text)]/70">
                {{ message }}
              </div>
            </div>
            
            <div class="ml-4 flex-shrink-0 flex">
              <button
                @click="$emit('close')"
                class="inline-flex text-[var(--color-text)]/40 hover:text-[var(--color-text)]/60 transition-colors"
              >
                <span class="sr-only">Close</span>
                <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path 
                    fill-rule="evenodd" 
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" 
                    clip-rule="evenodd" 
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Progress bar for auto-dismiss -->
        <div v-if="autoDismiss" class="h-1 bg-gray-100 relative overflow-hidden">
          <div 
            class="absolute left-0 top-0 h-full transition-all duration-100"
            :class="progressBarClass"
            :style="{ width: `${progress}%` }"
          />
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'

interface Props {
  show: boolean
  type?: 'success' | 'error' | 'info'
  title?: string
  message: string
  autoDismiss?: boolean
  duration?: number
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  autoDismiss: true,
  duration: 5000
})

const emit = defineEmits(['close'])

const progress = ref(100)
let progressInterval: number | null = null

const borderClass = computed(() => {
  switch (props.type) {
    case 'success':
      return 'border-green-200'
    case 'error':
      return 'border-red-200'
    default:
      return 'border-[var(--color-secondary)]/20'
  }
})

const progressBarClass = computed(() => {
  switch (props.type) {
    case 'success':
      return 'bg-green-500'
    case 'error':
      return 'bg-red-500'
    default:
      return 'bg-[var(--color-secondary)]'
  }
})

watch(() => props.show, (newVal) => {
  if (newVal && props.autoDismiss) {
    progress.value = 100
    const updateInterval = 50
    const decrementAmount = (updateInterval / props.duration) * 100
    
    progressInterval = setInterval(() => {
      progress.value -= decrementAmount
      if (progress.value <= 0) {
        if (progressInterval !== null) {
          clearInterval(progressInterval)
          progressInterval = null
        }
        emit('close')
      }
    }, updateInterval)
  } else {
    if (progressInterval !== null) {
      clearInterval(progressInterval)
      progressInterval = null
    }
  }
})

onMounted(() => {
  if (props.show && props.autoDismiss) {
    watch(() => props.show, () => {}, { immediate: true })
  }
})
</script>