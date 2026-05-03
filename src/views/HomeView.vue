<script setup lang="ts">
import ExploreView from './ExploreView.vue'
import LandingView from './LandingView.vue'
import AuthSelectorDialog from '@/components/AuthSelectorDialog.vue'
import EmailAuthDialog from '@/components/EmailAuthDialog.vue'
import { useAuth } from '@/composables/useAuth'
import LoadingScreen from '@/components/LoadingScreen.vue'
import NavBar from '@/components/NavBar.vue'

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
} = useAuth()
</script>

<template>
  <div class="min-h-screen bg-white flex flex-col">
    <LoadingScreen v-if="isLoading" />

    <template v-else>
      <NavBar @open="open" />

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
