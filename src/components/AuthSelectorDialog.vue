<script setup lang="ts">
import { computed } from 'vue'
import Dialog from 'primevue/dialog'
import DialogError from './DialogError.vue'
import { useAuth } from '@/stores/auth'
import AuthDialogHeader from './AuthDialogHeader.vue'
import AuthOptions from './AuthOptions.vue'
import SwitchAuthActionText from './SwitchAuthActionText.vue'

const authStore = useAuth()

const isVisible = computed(() => authStore.step.stage === 'selector')
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
      <AuthOptions />
      <DialogError />
      <SwitchAuthActionText />
    </div>
  </Dialog>
</template>
