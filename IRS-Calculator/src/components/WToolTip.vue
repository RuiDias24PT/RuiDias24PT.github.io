<template>
  <i
    v-if="toolTip"
    class="text-[var(--primary-color)] pi pi-info-circle"
    v-tooltip.right="{
      value: toolTip,
      pt: {
        text: 'text-xs',
      },
    }"
  />
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

defineProps({
    toolTip: {
        type: String,
        required: true
    }
});
</script>

<style scoped></style>
