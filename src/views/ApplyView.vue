<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useApplication } from '@/stores/application'
import { useProfile } from '@/stores/profile'
import { useRequireAuth } from '@/composables/useRequireAuth'
import StepIndicator from '@/components/apply/StepIndicator.vue'
import StepPersonalInfo from '@/components/apply/StepPersonalInfo.vue'
import StepCategories from '@/components/apply/StepCategories.vue'
import StepServiceInfo from '@/components/apply/StepServiceInfo.vue'
import StepReview from '@/components/apply/StepReview.vue'

useRequireAuth()

const appStore = useApplication()
const profileStore = useProfile()
const router = useRouter()

onMounted(async () => {
  appStore.initFormData(profileStore.userProfile?.fullName ?? null)

  await appStore.fetchExistingApplication()
  if (appStore.existingApplication) {
    router.push({ name: 'profile', params: { username: profileStore.userProfile?.username } })
  }
})

async function handleSubmit() {
  await appStore.submitApplication()
  if (!appStore.errorMessage) {
    router.push({ name: 'profile', params: { username: profileStore.userProfile?.username } })
  }
}
</script>

<template>
  <main class="flex-1 max-w-xl mx-auto w-full px-6 py-12">
    <div class="flex flex-col gap-8">
      <div>
        <p class="text-xs tracking-widest text-[#1dbf73] font-medium mb-1">YaVoy!</p>
        <h2 class="text-3xl font-semibold text-zinc-900">Conviértete en prestador</h2>
        <p class="text-sm text-zinc-400 mt-2">
          Completa tu solicitud para ofrecer tus servicios en YaVoy. La revisaremos y te
          notificaremos pronto.
        </p>
      </div>

      <StepIndicator />

      <StepPersonalInfo v-if="appStore.currentStep === 1" />
      <StepCategories v-else-if="appStore.currentStep === 2" />
      <StepServiceInfo v-else-if="appStore.currentStep === 3" />
      <StepReview v-else-if="appStore.currentStep === 4" />

      <div class="flex items-center justify-between pt-2">
        <button
          v-if="appStore.currentStep > 1"
          class="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer"
          @click="appStore.prevStep"
        >
          <i class="pi pi-arrow-left text-sm" />
          Atrás
        </button>
        <button
          v-else
          class="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer"
          @click="
            router.push({
              name: 'profile',
              params: { username: profileStore.userProfile?.username },
            })
          "
        >
          Volver al perfil
        </button>
        <div />

        <button
          v-if="appStore.currentStep < appStore.totalSteps"
          class="flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-sm transition-colors cursor-pointer"
          :class="
            appStore.canProceed
              ? 'bg-zinc-900 text-white hover:bg-zinc-700'
              : 'bg-zinc-100 text-zinc-300 cursor-not-allowed'
          "
          :disabled="!appStore.canProceed"
          @click="appStore.nextStep"
        >
          Continuar
          <i class="pi pi-arrow-right text-sm" />
        </button>

        <button
          v-else
          class="flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-sm transition-colors cursor-pointer"
          :class="
            appStore.isSubmitting
              ? 'bg-zinc-100 text-zinc-300 cursor-not-allowed'
              : 'bg-[#1dbf73] text-white hover:bg-[#19a863]'
          "
          :disabled="appStore.isSubmitting"
          @click="handleSubmit"
        >
          <span v-if="appStore.isSubmitting" class="flex items-center gap-2">
            <i class="pi pi-spin pi-spinner text-sm" />
            Enviando...
          </span>
          <span v-else>Enviar solicitud</span>
        </button>
      </div>
    </div>
  </main>
</template>
