import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import VueLazyload from 'vue-lazyload'
import { createMetaManager } from 'vue-meta'

// Import styles
import './styles/main.css'

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import { faInstagram, faFacebook, faPinterest } from '@fortawesome/free-brands-svg-icons'

/* add icons to the library */
library.add(faInstagram, faFacebook, faPinterest)

// Create application
const app = createApp(App)

// Use plugins
app.use(createPinia())
app.use(router)
app.use(createMetaManager())
app.use(VueLazyload, {
  preLoad: 1.3,
  error: '/images/error-placeholder.jpg',
  loading: '/images/loading-placeholder.jpg',
  attempt: 1
})

app.component('font-awesome-icon', FontAwesomeIcon)

// Mount application
app.mount('#app')