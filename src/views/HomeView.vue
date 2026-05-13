<script setup lang="ts">
import BrowseView from './BrowseView.vue'
import LandingView from './LandingView.vue'
import AuthSelectorDialog from '@/components/auth/AuthSelectorDialog.vue'
import EmailAuthDialog from '@/components/auth/EmailAuthDialog.vue'
import OnboardingDialog from '@/components/auth/OnboardingDialog.vue'
import { useAuth } from '@/stores/auth'

const authStore = useAuth()
</script>

<template>
  <BrowseView v-if="authStore.currentUser" />
  <LandingView v-else />

  <AuthSelectorDialog />
  <EmailAuthDialog />
  <OnboardingDialog />
</template>
