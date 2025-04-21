<template>
    <nav class="w-full bg-white shadow-md py-4 px-8 flex items-center justify-between">
        <!-- Logo / Title -->
        <div class="text-xl font-semibold text-indigo-700">
            Simulador IRS
        </div>

        <!-- Nav links -->
        <ul class="flex space-x-6 text-sm font-medium text-gray-700">
            <li v-for="(item, idx) in navItems" :key="idx" class="hover:text-indigo-700 cursor-pointer transition">
                {{ item }}
            </li>
        </ul>
    </nav>
</template>

<script setup>
const navItems = [
    'Simulador IRS',
    'Tabela escalões IRS',
    'FAQ'
];
</script>
