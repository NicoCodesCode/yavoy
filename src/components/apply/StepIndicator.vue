<script setup lang="ts">
import { useApplication } from '@/stores/application'

const appStore = useApplication()
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="flex items-center justify-between">
      <span class="text-xs font-medium text-zinc-500 uppercase tracking-wide">
        Paso {{ appStore.currentStep }} de {{ appStore.totalSteps }}
      </span>
    </div>
    <div class="w-full h-1 bg-zinc-100 rounded-full overflow-hidden">
      <div
        class="h-full bg-[#1dbf73] rounded-full transition-all duration-300"
        :style="{ width: `${appStore.progressPercent}%` }"
      />
    </div>
  </div>
</template>
