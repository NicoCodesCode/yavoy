<script setup lang="ts">
import ExploreView from './ExploreView.vue'
import LandingView from './LandingView.vue'
import AuthSelectorDialog from '@/components/AuthSelectorDialog.vue'
import EmailAuthDialog from '@/components/EmailAuthDialog.vue'
import { useAuth } from '@/composables/useAuth'
import { AuthAction } from '@/types'
import LoadingScreen from '@/components/LoadingScreen.vue'

const {
  step,
  errorMessage,
  open,
  goToEmail,
  goBackToSelector,
  close,
  continueWithGoogle,
  continueWithEmail,
  currentUser,
  isLoading,
  logout,
} = useAuth()
</script>

<template>
  <div class="min-h-screen bg-white flex flex-col">
    <LoadingScreen v-if="isLoading" />

    <template v-else>
      <!-- Nav -->
      <header class="flex items-center justify-between px-8 py-6 border-b border-zinc-200">
        <span class="text-2xl font-bold tracking-widest text-zinc-900">
          YaVoy<span class="text-[#1dbf73]">!</span>
        </span>
        <button
          v-if="currentUser"
          class="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-zinc-200 text-zinc-600 rounded-sm hover:border-red-500 hover:bg-red-100 transition-all cursor-pointer"
          @click="logout"
        >
          <i class="pi pi-sign-out text-sm" />
          Cerrar sesión
        </button>
        <div v-else class="flex items-center gap-3">
          <button
            class="px-4 py-2 text-sm font-semibold text-zinc-900 rounded-sm cursor-pointer hover:text-[#1dbf73] transition-colors"
            @click="open(AuthAction.LOGIN)"
          >
            Iniciar sesión
          </button>
          <button
            class="px-4 py-2 text-sm font-semibold border-2 border-[#1dbf73] text-zinc-900 rounded-sm cursor-pointer hover:text-white hover:bg-[#1dbf73] transition-colors"
            @click="open(AuthAction.JOIN)"
          >
            Únete
          </button>
        </div>
      </header>

      <!-- Views -->
      <ExploreView v-if="currentUser" :currentUser />
      <LandingView v-else @open="open" />

      <footer class="px-8 py-5 border-t border-zinc-100">
        <p class="text-xs text-zinc-400 text-center tracking-wide">© 2026 YaVoy</p>
      </footer>
    </template>
  </div>

  <!-- Dialogs -->
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
