<script setup lang="ts">
import { useAuth } from '@/stores/auth'
import { computed } from 'vue'

const authStore = useAuth()

const spanText = computed(() =>
  authStore.isJoining
    ? { question: '¿Ya tienes una cuenta?', action: 'Iniciar sesión' }
    : { question: '¿No tienes una cuenta?', action: 'Únete aquí' },
)

const oppositeAction = computed(() => (authStore.isJoining ? 'login' : 'join'))
</script>

<template>
  <p class="text-sm text-zinc-600 text-center">
    {{ spanText.question }}
    <button
      class="underline underline-offset-2 cursor-pointer hover:text-[#1dbf73] transition-colors ml-1"
      @click="authStore.open(oppositeAction)"
    >
      {{ spanText.action }}
    </button>
  </p>
</template>
