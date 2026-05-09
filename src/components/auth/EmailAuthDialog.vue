<script setup lang="ts">
import { computed } from 'vue'
import Dialog from 'primevue/dialog'
import { useAuth } from '@/stores/auth'
import AuthDialogHeader from './AuthDialogHeader.vue'
import EmailAuthForm from './EmailAuthForm.vue'

const authStore = useAuth()

const isVisible = computed(() => authStore.step.stage === 'email')
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
      <AuthDialogHeader />
      <EmailAuthForm :isVisible />
    </div>
  </Dialog>
</template>
