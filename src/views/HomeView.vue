<script setup lang="ts">
import ExploreView from './ExploreView.vue'
import LandingView from './LandingView.vue'
import AuthSelectorDialog from '@/components/AuthSelectorDialog.vue'
import EmailAuthDialog from '@/components/EmailAuthDialog.vue'
import OnboardingDialog from '@/components/OnboardingDialog.vue'
import { useAuth } from '@/stores/auth'

const authStore = useAuth()
</script>

<template>
  <ExploreView v-if="authStore.currentUser" />
  <LandingView v-else />

  <AuthSelectorDialog />
  <EmailAuthDialog />
  <OnboardingDialog />
</template>
