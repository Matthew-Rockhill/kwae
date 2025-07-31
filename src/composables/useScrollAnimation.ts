import { onMounted, onUnmounted } from 'vue'

export function useScrollAnimation() {
  let observer: IntersectionObserver | null = null

  const initScrollAnimation = () => {
    // Check if user prefers reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view')
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    )

    // Observe all elements with animation classes
    const animatedElements = document.querySelectorAll('.animate-on-scroll')
    animatedElements.forEach((el) => {
      if (observer) {
        observer.observe(el)
      }
    })
  }

  const cleanup = () => {
    if (observer) {
      observer.disconnect()
      observer = null
    }
  }

  onMounted(() => {
    // Wait for DOM to be ready
    setTimeout(initScrollAnimation, 100)
  })

  onUnmounted(cleanup)

  return {
    initScrollAnimation,
    cleanup
  }
}