<script setup lang="ts">
defineProps<{ errorMessage: string }>()
</script>

<template>
  <div
    v-if="errorMessage"
    class="flex items-center gap-2 px-3 py-2.5 bg-red-50 border border-red-200 rounded-sm"
  >
    <i class="pi pi-exclamation-circle text-red-400 text-sm" />
    <span class="text-sm text-red-600">{{ errorMessage }}</span>
  </div>
</template>
