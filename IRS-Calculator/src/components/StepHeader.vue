<template>
  <div class="flex items-center text-[1.2rem] pt-[2.5rem] pl-[2.5rem] gap-[2rem]">
    <span :class="['pi', icon, 'text-[var(--primary-color)]', '!text-2xl']"></span>
    <p class="font-bold">{{ title }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
});
</script>
