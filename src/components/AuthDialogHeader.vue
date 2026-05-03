<script setup lang="ts">
import { useAuth } from '@/stores/auth'
import { computed } from 'vue'

const authStore = useAuth()

const isEmailStage = computed(() => (authStore.step.stage === 'email' ? true : false))

const header = computed(() => {
  if (isEmailStage.value) return 'Continuar con email'

  return authStore.isJoining ? 'Crear una cuenta nueva' : 'Inicia sesión en tu cuenta'
})
</script>

<template>
  <div class="flex items-start justify-between">
    <div>
      <p class="text-xs tracking-widest text-[#1dbf73] font-semibold mb-1">YaVoy!</p>
      <h2 class="text-xl font-semibold text-zinc-800 leading-snug">{{ header }}</h2>
    </div>
    <button
      v-if="isEmailStage"
      class="text-zinc-500 hover:text-zinc-700 transition-colors cursor-pointer"
      @click="authStore.goBackToSelector"
    >
      <i class="pi pi-arrow-left text-sm" />
    </button>
    <button
      v-else
      class="text-zinc-500 hover:text-zinc-700 transition-colors mt-0.5 cursor-pointer"
      @click="authStore.close"
    >
      <i class="pi pi-times text-sm" />
    </button>
  </div>
</template>
