<template>
    <button :class="[
        'w-full px-6 py-2 font-semibold border-2 rounded-md cursor-pointer transition-colors duration-200',
        disabled
            ? 'text-[var(--primary-color)] border-[var(--primary-color)] opacity-50 cursor-not-allowed'
            : 'bg-[var(--primary-color)] text-white border-[var(--primary-color)] hover:opacity-90'
    ]" :disabled="disabled" @click="$emit('click')">
        {{ label }}
    </button>
</template>

<script setup>
defineProps({
    label: {
        type: String,
        required: true
    },
    disabled: {
        type: Boolean,
        default: false
    }
});
</script>