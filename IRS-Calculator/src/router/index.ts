import { createRouter, createWebHistory } from 'vue-router'
import AboutView from '../views/AboutView.vue'
import IRSCalculator from '@/views/IRSCalculator.vue'
import IRSTable from '@/views/IRSTable.vue'
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
      component: IRSTable,
    },
  ],
})

export default router
