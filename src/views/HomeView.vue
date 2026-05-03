<script setup lang="ts">
import ExploreView from './ExploreView.vue'
import LandingView from './LandingView.vue'
import AuthSelectorDialog from '@/components/AuthSelectorDialog.vue'
import EmailAuthDialog from '@/components/EmailAuthDialog.vue'
import OnboardingDialog from '@/components/OnboardingDialog.vue'
import { useAuth } from '@/stores/auth'
import LoadingScreen from '@/components/LoadingScreen.vue'
import NavBar from '@/components/NavBar.vue'
import AppFooter from '@/components/AppFooter.vue'

const authStore = useAuth()
</script>

<template>
  <div class="min-h-screen bg-white flex flex-col">
    <LoadingScreen v-if="authStore.isLoading" />

    <template v-else>
      <NavBar />

      <ExploreView v-if="authStore.currentUser" />
      <LandingView v-else />

      <AppFooter />
    </template>
  </div>

  <AuthSelectorDialog />
  <EmailAuthDialog />
  <OnboardingDialog />
</template>
