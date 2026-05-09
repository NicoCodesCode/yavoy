<script setup lang="ts">
import { computed } from 'vue'
import Dialog from 'primevue/dialog'
import { useAuth } from '@/stores/auth'
import AuthDialogHeader from './AuthDialogHeader.vue'
import OnboardingForm from './OnboardingForm.vue'

const authStore = useAuth()

const isVisible = computed(() => authStore.step.stage === 'onboarding')
</script>

<template>
  <Dialog
    :visible="isVisible"
    modal
    :showHeader="false"
    :closable="false"
    class="rounded-none! shadow-2xl! bg-zinc-100! border-0! p-0! w-full! max-w-sm!"
  >
    <div class="flex flex-col px-8 pt-8 pb-10 gap-6">
      <AuthDialogHeader>
        <p class="text-sm text-zinc-500 mt-1">¿Cómo te llamas?</p>
      </AuthDialogHeader>
      <OnboardingForm :isVisible />
    </div>
  </Dialog>
</template>
