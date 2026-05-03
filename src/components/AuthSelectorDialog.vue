<script setup lang="ts">
import { computed } from 'vue'
import Dialog from 'primevue/dialog'
import { AuthAction } from '@/types'
import DialogError from './DialogError.vue'

const props = defineProps<{
  visible: boolean
  action: AuthAction
  errorMessage: string
}>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
  open: [action: AuthAction]
  goToEmail: []
  continueWithGoogle: []
}>()

const isJoining = computed(() => props.action === AuthAction.JOIN)

const header = computed(() =>
  isJoining.value ? 'Crear una cuenta nueva' : 'Inicia sesión en tu cuenta',
)

const spanText = computed(() =>
  isJoining.value
    ? { question: '¿Ya tienes una cuenta?', action: 'Iniciar sesión' }
    : { question: '¿No tienes una cuenta?', action: 'Únete aquí' },
)

const oppositeAction = computed(() => (isJoining.value ? AuthAction.LOGIN : AuthAction.JOIN))
</script>

<template>
  <Dialog
    :visible
    modal
    :showHeader="false"
    :closable="false"
    @update:visible="emit('update:visible', $event)"
    class="rounded-none! shadow-2xl! bg-zinc-100! border-0! p-0! w-full! max-w-sm!"
  >
    <div class="flex flex-col px-8 pt-8 pb-10 gap-6">
      <!-- Header -->
      <div class="flex items-start justify-between">
        <div>
          <p class="text-xs tracking-widest text-[#1dbf73] font-semibold mb-1">YaVoy!</p>
          <h2 class="text-xl font-semibold text-zinc-800 leading-snug">{{ header }}</h2>
        </div>
        <button
          class="text-zinc-500 hover:text-zinc-700 transition-colors mt-0.5 cursor-pointer"
          @click="emit('update:visible', false)"
        >
          <i class="pi pi-times text-sm" />
        </button>
      </div>

      <!-- Actions -->
      <div class="flex flex-col gap-3">
        <button
          class="px-4 py-2 text-sm font-semibold border-2 border-[#1dbf73] text-zinc-900 rounded-sm cursor-pointer hover:text-white hover:bg-[#1dbf73] transition-colors"
          @click="emit('continueWithGoogle')"
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
          @click="emit('goToEmail')"
        >
          <i class="pi pi-envelope text-base mr-2" />
          {{ isJoining ? 'Regístrate con email' : 'Continuar con email' }}
        </button>
      </div>

      <!-- Error -->
      <DialogError :errorMessage />

      <!-- Switch action -->
      <p class="text-sm text-zinc-600 text-center">
        {{ spanText.question }}
        <button
          class="underline underline-offset-2 cursor-pointer hover:text-[#1dbf73] transition-colors ml-1"
          @click="emit('open', oppositeAction)"
        >
          {{ spanText.action }}
        </button>
      </p>
    </div>
  </Dialog>
</template>
