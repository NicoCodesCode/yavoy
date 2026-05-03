<script setup lang="ts">
defineProps<{ isButtonDisabled: boolean; isSubmitting: boolean }>()
</script>

<template>
  <button
    type="submit"
    :disabled="isButtonDisabled"
    class="w-full mt-1 px-4 py-2.5 text-sm font-medium rounded-sm transition-colors"
    :class="
      isButtonDisabled
        ? 'bg-zinc-300 text-zinc-500'
        : ' bg-zinc-900 text-zinc-100 hover:bg-zinc-700 cursor-pointer'
    "
  >
    <span v-if="isSubmitting" class="flex items-center justify-center gap-2">
      <i class="pi pi-spin pi-spinner text-sm" />
      Guardando...
    </span>
    <span v-else>Continuar</span>
  </button>
</template>
