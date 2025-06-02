<template>
  <div class="relative min-h-screen">
    <NavBar :items="navBarItems" />
    <div class="absolute top-3 right-6 flex space-x-4 z-50">
      <a href="https://github.com/RuiDias24PT/portefolio/tree/main/IRS-Calculator" target="_blank"
        rel="noopener noreferrer" class="text-gray-600 hover:text-black text-[2rem]">
        <i class="mdi mdi-github"></i>
      </a>
      <a href="https://www.linkedin.com/in/rui-dias-00350b25a/" target="_blank" rel="noopener noreferrer"
        class="text-blue-600 hover:text-blue-800 text-[2rem]">
        <i class="mdi mdi-linkedin"></i>
      </a>
    </div>
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import NavBar from '@/components/NavBar.vue';
import { ref } from 'vue';

const navBarItems = ref([
  {
    label: 'Simulador IRS',
    route: { name: 'calculator' },
  },
  {
    label: 'Tabela escalões IRS',
    route: { name: 'tabelaIRS' },
  },
  {
    label: 'FAQ',
    route: { name: 'faq' },
  },
]);
</script>
