import { createRouter, createWebHistory } from 'vue-router';
import FAQ from '@/views/FAQ.vue';
import IRSCalculator from '@/views/IRSCalculator.vue';
import IRSTable from '@/views/IRSTable.vue';
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'calculator',
      component: IRSCalculator,
    },
    {
      path: '/faq',
      name: 'faq',
      component: FAQ,
    },
    {
      path: '/tabela-irs',
      name: 'tabelaIRS',
      component: IRSTable,
    },
  ],
});

export default router;
