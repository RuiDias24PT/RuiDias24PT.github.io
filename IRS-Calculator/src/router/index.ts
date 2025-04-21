import { createRouter, createWebHistory } from 'vue-router'
import AboutView from '../views/AboutView.vue'
import IRSCalculator from '@/views/IRSCalculator.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'calculator',
      component: IRSCalculator,
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
    },
    {
      path: '/tabela-irs',
      name: 'tabelaIRS',
      component: AboutView,
    },
  ],
})

export default router
