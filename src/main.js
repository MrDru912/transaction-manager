import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { createPinia } from 'pinia';

// const router = createRouter({
//     history: createWebHashHistory(),
//     routes: [
//         {path: '/', redirect: '/Transactions'},
//         {path: '/Transactions', name: 'Transactions', component: Transactions},
//         {path: '/Statistics', name: 'Statistics', component: Statistics, props: (route) => ({
//             categories: route.params.categories,
//             transactions: route.params.transactions
//           })},
//         {path: '/BudgetAndGoals', name: 'BudgetAndGoals', component: BudgetAndGoals}
//     ]
// })

const vuetify = createVuetify({
    components,
    directives,
    theme: {
      themes: {
        light: {
          dark: false,
          colors: {
            primary: '#43c6ac', // Set your primary color here
            secondary: '#424242',
          },
        },
        dark: {
          dark: true,
          colors: {
            primary: '#2fe084', // Set your dark theme primary color
          },
        },
      },
    },
  })

createApp(App)
.use(vuetify)
// .use(router)
.use(createPinia())
.use(VueQueryPlugin)
.mount('#app')
