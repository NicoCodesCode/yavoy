<script setup lang="ts">
import { useAuth } from '@/stores/auth'
import ErrorMessage from './ErrorMessage.vue'
import SubmitButton from './SubmitButton.vue'
import { computed, ref, watch } from 'vue'
import TextInput from './TextInput.vue'

const authStore = useAuth()

const props = defineProps<{ isVisible: boolean }>()

const username = ref('')

const isButtonDisabled = computed(() => !username.value.trim() || authStore.isSubmitting)

async function handleSubmit() {
  if (isButtonDisabled.value) return
  authStore.completeOnboarding(username.value.trim())
}

watch(
  () => props.isVisible,
  () => {
    if (!props.isVisible) {
      username.value = ''
    }
  },
)
</script>

<template>
  <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
    <TextInput label="Nombre de usuario" inputType="text" id="username" v-model="username" />
    <ErrorMessage :errorMessage="authStore.errorMessage" />
    <SubmitButton :isButtonDisabled :isSubmitting="authStore.isSubmitting">Continuar</SubmitButton>
  </form>
</template>
