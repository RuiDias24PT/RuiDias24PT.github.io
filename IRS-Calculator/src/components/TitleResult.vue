<template>
    <div class="pt-[2rem] pb-[1rem] text-2xl !font-bold text-[var(--primary-color)] text-center">
        <p v-if="reimbursement > 0">
            Vais receber {{ reimbursement }}€ de reembolso!
        </p>
        <p v-else-if="reimbursement < 0">
            Vais pagar {{ absoluteValue }}€
        </p>
        <p v-else>
            Não vais receber nada
        </p>
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