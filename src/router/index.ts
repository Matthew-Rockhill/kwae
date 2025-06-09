import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      meta: {
        title: 'Kristin With An Eye - Storytelling Photography'
      }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: {
        title: 'About - Kristin With An Eye'
      }
    },
    {
      path: '/portfolio',
      name: 'portfolio',
      component: () => import('../views/PortfolioView.vue'),
      meta: {
        title: 'Portfolio - Kristin With An Eye'
      }
    },
    {
      path: '/packages',
      name: 'packages',
      component: () => import('../views/PackagesView.vue'),
      meta: {
        title: 'Photography Packages - Kristin With An Eye'
      }
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('../views/ContactView.vue'),
      meta: {
        title: 'Contact - Kristin With An Eye'
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
  document.title = to.meta.title as string || 'Kristin With An Eye'
  next()
})

export default router