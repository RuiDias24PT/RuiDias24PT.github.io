<template>
  <i
    v-if="toolTip"
    v-tooltip.right="{
      value: toolTip,
      pt: {
        text: 'text-xs',
      },
    }"
    class="text-[var(--primary-color)] pi pi-info-circle"
  />
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

defineProps({
  toolTip: {
    type: String,
    required: true,
  },
});
</script>

<style scoped></style>
