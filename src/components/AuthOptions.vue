<script setup lang="ts">
import { useAuth } from '@/stores/auth'
import { computed } from 'vue'

const authStore = useAuth()

const buttonText = computed(() =>
  authStore.isJoining ? 'Regístrate con email' : 'Continuar con email',
)
</script>

<template>
  <div class="flex flex-col gap-3">
    <button
      class="px-4 py-2 text-sm font-semibold border-2 border-[#1dbf73] text-zinc-900 rounded-sm cursor-pointer hover:text-white hover:bg-[#1dbf73] transition-colors"
      @click="authStore.continueWithGoogle"
    >
      <i class="pi pi-google text-base mr-2" />
      Continuar con Google
    </button>

    <div class="flex items-center gap-3">
      <span class="flex-1 h-px bg-zinc-900" />
      <span class="text-xs text-zinc-700 tracking-wide">o</span>
      <span class="flex-1 h-px bg-zinc-900" />
    </div>

    <button
      class="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 border-2 border-zinc-700 rounded-sm text-sm font-medium text-zinc-700 hover:border-zinc-500 hover:text-zinc-500 hover:bg-zinc-200 transition-all cursor-pointer"
      @click="authStore.goToEmail"
    >
      <i class="pi pi-envelope text-base mr-2" />
      {{ buttonText }}
    </button>
  </div>
</template>
