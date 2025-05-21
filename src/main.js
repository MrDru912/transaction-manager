import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createRouter, createWebHashHistory } from 'vue-router';
import Transactions from './views/Transactions.vue';
import Statistics from './views/Statistics.vue';
import BudgetAndGoals from './views/BudgetAndGoals.vue';
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'
import { createPinia } from 'pinia';

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {path: '/', redirect: '/Transactions'},
        {path: '/Transactions', name: 'Transactions', component: Transactions},
        {path: '/Statistics', name: 'Statistics', component: Statistics, props: (route) => ({
            categories: route.params.categories,
            transactions: route.params.transactions
          })},
        {path: '/BudgetAndGoals', name: 'BudgetAndGoals', component: BudgetAndGoals}
    ]
})

const vuetify = createVuetify({
    components,
    directives,
  })

createApp(App).use(vuetify).use(router).use(createPinia()).mount('#app')
