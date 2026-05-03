<script setup lang="ts">
import { signOut, type User } from 'firebase/auth'
import { auth } from '@/firebase'

defineProps<{ currentUser: User }>()

async function logout() {
  try {
    await signOut(auth)
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <div class="min-h-screen bg-white flex flex-col">
    <!-- Nav -->
    <header class="flex items-center justify-between px-8 py-6 border-b border-zinc-100">
      <span class="text-2xl font-bold tracking-widest text-zinc-900">
        YaVoy<span class="text-[#1dbf73]">!</span>
      </span>
      <button
        class="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-zinc-200 text-zinc-600 rounded-sm hover:border-red-500 hover:bg-red-100 transition-all cursor-pointer"
        @click="logout"
      >
        <i class="pi pi-sign-out text-sm" />
        Cerrar sesión
      </button>
    </header>

    <!-- Content -->
    <main class="flex-1 flex flex-col items-center justify-center px-6 text-center">
      <div class="max-w-md">
        <div
          class="w-12 h-12 rounded-full bg-[#1dbf73]/20 flex items-center justify-center mx-auto mb-6"
        >
          <i class="pi pi-user text-[#1dbf73] text-lg" />
        </div>
        <h2 class="text-2xl font-semibold text-zinc-900 mb-2">Bienvenido de vuelta</h2>
        <p class="text-sm text-zinc-400">{{ currentUser.email }}</p>
      </div>
    </main>
  </div>
</template>
