<script setup lang="ts">
import type { AuthAction } from '@/composables/useAuth'
import type { User } from 'firebase/auth'

defineProps<{ currentUser: User | null }>()
defineEmits<{
  open: [action: AuthAction]
  logout: []
}>()
</script>

<template>
  <header class="flex items-center justify-between px-8 py-6 border-b border-zinc-200">
    <span class="text-2xl font-bold tracking-widest text-zinc-900">
      YaVoy<span class="text-[#1dbf73]">!</span>
    </span>
    <button
      v-if="currentUser"
      class="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-zinc-200 text-zinc-600 rounded-sm hover:border-red-500 hover:bg-red-100 transition-all cursor-pointer"
      @click="$emit('logout')"
    >
      <i class="pi pi-sign-out text-sm" />
      Cerrar sesión
    </button>
    <div v-else class="flex items-center gap-3">
      <button
        class="px-4 py-2 text-sm font-semibold text-zinc-900 rounded-sm cursor-pointer hover:text-[#1dbf73] transition-colors"
        @click="$emit('open', 'login')"
      >
        Iniciar sesión
      </button>
      <button
        class="px-4 py-2 text-sm font-semibold border-2 border-[#1dbf73] text-zinc-900 rounded-sm cursor-pointer hover:text-white hover:bg-[#1dbf73] transition-colors"
        @click="$emit('open', 'join')"
      >
        Únete
      </button>
    </div>
  </header>
</template>
