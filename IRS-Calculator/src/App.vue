<template>
  <NavBar :items="navBarItems"></NavBar>
  <RouterView />
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue';
import { ref } from "vue";

const navBarItems = ref([
  {
    label: 'Simulador IRS',
    route: { name: 'calculator' }

  },
  {
    label: 'Tabela escalões IRS',
    route: { name: 'tabelaIRS' }
  },
  {
    label: 'FAQ',
    route: { name: 'about' }
  }
]);
</script>

<style scoped>
  
</style>
