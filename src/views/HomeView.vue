<script setup lang="ts">
import ExploreView from './ExploreView.vue'
import LandingView from './LandingView.vue'
import AuthSelectorDialog from '@/components/AuthSelectorDialog.vue'
import EmailAuthDialog from '@/components/EmailAuthDialog.vue'
import OnboardingDialog from '@/components/OnboardingDialog.vue'
import { useAuth } from '@/composables/useAuth'
import LoadingScreen from '@/components/LoadingScreen.vue'
import NavBar from '@/components/NavBar.vue'
import AppFooter from '@/components/AppFooter.vue'

const {
  step,
  errorMessage,
  open,
  goToEmail,
  goBackToSelector,
  close,
  continueWithGoogle,
  continueWithEmail,
  completeOnboarding,
  logout,
  currentUser,
  isLoading,
} = useAuth()
</script>

<template>
  <div class="min-h-screen bg-white flex flex-col">
    <LoadingScreen v-if="isLoading" />

    <template v-else>
      <NavBar @open="open" @logout="logout" :currentUser />

      <ExploreView v-if="currentUser" :currentUser />
      <LandingView v-else @open="open" />

      <AppFooter />
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
  <OnboardingDialog
    :visible="step.stage === 'onboarding'"
    :errorMessage
    @completeOnboarding="completeOnboarding"
  />
</template>
