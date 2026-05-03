<script setup lang="ts">
import { useAuth } from '@/stores/auth'

const authStore = useAuth()
</script>

<template>
  <main class="flex-1 flex flex-col items-center justify-center px-6 text-center">
    <div class="max-w-md">
      <div
        class="w-12 h-12 rounded-full bg-[#1dbf73]/20 flex items-center justify-center mx-auto mb-6"
      >
        <i class="pi pi-user text-[#1dbf73] text-lg" />
      </div>
      <h2 class="text-2xl font-semibold text-zinc-900 mb-2">Bienvenido de vuelta</h2>
      <p class="text-sm text-zinc-400">{{ authStore.currentUser?.email }}</p>
    </div>
  </main>
</template>
