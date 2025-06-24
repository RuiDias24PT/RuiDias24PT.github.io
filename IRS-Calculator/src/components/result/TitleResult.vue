<template>
  <div class="pt-[2rem] pb-[1rem] text-2xl !font-bold text-[var(--primary-color)] text-center">
    <p v-if="reimbursement > 0">Vais receber {{ reimbursement.toFixed(2) }}€ de reembolso!</p>
    <p v-else-if="reimbursement < 0" class="text-red-600">
      Vais pagar {{ absoluteValue.toFixed(2) }}€
    </p>
    <p v-else>Não vais receber nada</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  reimbursement: number;
}>();

const absoluteValue = computed(() => {
  return Math.abs(props.reimbursement);
});
</script>

<style scoped></style>
