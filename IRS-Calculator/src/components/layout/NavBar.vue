<template>
  <div class="w-[40rem] my-[1.5rem] p-2 flex justify-center mx-auto">
    <Menubar :model="items">
      <template #item="{ item }">
        <router-link
          :to="item.route"
          class="flex items-center px-4 py-2 rounded-md hover:bg-indigo-100 hover:text-indigo-700 transition-colors text-sm font-medium text-gray-700"
        >
          <span class="font-inter">{{ item.label }}</span>
        </router-link>
      </template>
    </Menubar>
  </div>
</template>

<script setup lang="ts">
import Menubar from 'primevue/menubar';
import type { MenuItem } from 'primevue/menuitem';

defineProps<{
  items: MenuItem[];
}>();
</script>

<style scoped></style>
