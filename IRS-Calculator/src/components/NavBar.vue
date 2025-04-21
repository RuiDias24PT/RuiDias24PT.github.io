<template>
    <div class="w-[50rem] mx-auto my-6 border border-gray-300 rounded-xl p-2 flex justify-center">
        <Menubar :model="items">
            <template #item="{ item }">
                <router-link :to="item.route"
                    class="flex items-center px-4 py-2 rounded-md hover:bg-indigo-100 hover:text-indigo-700 transition-colors text-sm font-medium text-gray-700">
                    <span class="font-inter">{{ item.label }}</span>
                </router-link>
            </template>
        </Menubar>
    </div>
</template>

<script setup lang="ts"> 
import { defineProps } from 'vue';
import Menubar from 'primevue/menubar';
const props = defineProps({
    items: {
        type: Array,
        required: true,
    },
});
</script>

<style scoped>
</style>
