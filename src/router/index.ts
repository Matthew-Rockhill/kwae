import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      meta: {
        title: 'Kristin Mathilde - Cape Town Photographer | Professional Photography Services',
        description: 'Professional Cape Town photographer specializing in weddings, portraits & lifestyle photography. Book your photography session with Kristin Mathilde today.',
        keywords: 'Cape Town photographer, Cape Town photography, Kristin Mathilde'
      }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: {
        title: 'About | Kristin Mathilde - Professional Cape Town Photographer',
        description: 'Meet Kristin Mathilde, a passionate Cape Town photographer specializing in authentic storytelling through wedding, portrait, and lifestyle photography.',
        keywords: 'about Cape Town photographer, professional photographer Cape Town, Kristin Mathilde'
      }
    },
    {
      path: '/portfolio',
      name: 'portfolio',
      component: () => import('../views/PortfolioView.vue'),
      meta: {
        title: 'Photography Portfolio | Kristin Mathilde - Cape Town Photographer',
        description: 'Browse the stunning photography portfolio of Cape Town photographer Kristin Mathilde. View wedding, portrait, lifestyle & event photography galleries.',
        keywords: 'Cape Town photography portfolio, wedding photos Cape Town, portrait photography Cape Town'
      }
    },
    {
      path: '/packages',
      name: 'packages',
      component: () => import('../views/PackagesView.vue'),
      meta: {
        title: 'Photography Packages & Pricing | Cape Town Photographer - Kristin Mathilde',
        description: 'Affordable photography packages in Cape Town. Wedding, portrait, lifestyle & event photography services. Get a quote from Kristin Mathilde today.',
        keywords: 'Cape Town photography packages, wedding photographer prices Cape Town, photography services Cape Town'
      }
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('../views/ContactView.vue'),
      meta: {
        title: 'Contact | Book Your Cape Town Photographer - Kristin Mathilde',
        description: 'Contact Kristin Mathilde to book your Cape Town photography session. Professional wedding, portrait, and lifestyle photographer serving Cape Town and surrounds.',
        keywords: 'book Cape Town photographer, contact photographer Cape Town, hire photographer Cape Town'
      }
    }
  ],
  scrollBehavior(to, _, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth'
      }
    } else {
      return { top: 0 }
    }
  }
})

// Update page title
router.beforeEach((to, _from, next) => {
  document.title = to.meta.title as string || 'Kristin Mathilde - Cape Town Photographer'
  next()
})

export default router