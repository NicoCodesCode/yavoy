<script setup lang="ts">
import AuthSelectorDialog from '@/components/AuthSelectorDialog.vue'
import EmailAuthDialog from '@/components/EmailAuthDialog.vue'
import { useAuthDialog } from '@/composables/useAuthDialog'
import { AuthAction } from '@/types'

const {
  step,
  errorMessage,
  open,
  goToEmail,
  goBackToSelector,
  close,
  continueWithGoogle,
  continueWithEmail,
} = useAuthDialog()
</script>

<template>
  <!-- Hero -->
  <main class="flex-1 flex flex-col items-center justify-center px-6 text-center">
    <div class="max-w-xl">
      <div class="inline-block mb-8 px-3 py-1 border border-[#1dbf73] rounded-full">
        <span class="text-xs tracking-widest uppercase text-[#1dbf73] font-semibold"
          >Servicios verificados</span
        >
      </div>
      <h1 class="text-5xl font-light text-zinc-900 leading-tight tracking-tight mb-5">
        Conecta con quien<br />
        <em class="not-italic font-semibold">realmente</em> sabe hacer su trabajo.
      </h1>
      <p class="text-base text-zinc-500 leading-relaxed mb-10 max-w-sm mx-auto">
        Una plataforma que conecta usuarios con prestadores de servicios verificados.
      </p>
      <button
        class="px-8 py-3 text-sm font-medium bg-zinc-900 text-white rounded-sm cursor-pointer hover:bg-zinc-700 transition-colors"
        @click="open(AuthAction.JOIN)"
      >
        Comenzar gratis
      </button>
    </div>
  </main>

  <AuthSelectorDialog
    :visible="step.stage === 'selector'"
    :action="step.action!"
    :errorMessage
    @update:visible="close"
    @open="open"
    @goToEmail="goToEmail"
    @continueWithGoogle="continueWithGoogle"
  />

  <EmailAuthDialog
    :visible="step.stage === 'email'"
    :errorMessage
    @goBack="goBackToSelector"
    @continueWithEmail="continueWithEmail"
  />
</template>
