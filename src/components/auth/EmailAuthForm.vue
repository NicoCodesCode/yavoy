<script setup lang="ts">
import { useAuth } from '@/stores/auth'
import { computed, ref, watch } from 'vue'
import ErrorMessage from '@/components/ErrorMessage.vue'
import SubmitButton from '@/components/buttons/SubmitButton.vue'
import TextInput from '@/components/TextInput.vue'

const authStore = useAuth()

const props = defineProps<{ isVisible: boolean }>()

const email = ref('')
const password = ref('')

const isButtonDisabled = computed(
  () => !email.value.trim() || !password.value.trim() || authStore.isSubmitting,
)

function handleSubmit() {
  if (isButtonDisabled.value) return
  authStore.continueWithEmail(email.value.trim(), password.value.trim())
}

watch(
  () => props.isVisible,
  () => {
    if (!props.isVisible) {
      email.value = ''
      password.value = ''
    }
  },
)
</script>

<template>
  <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
    <TextInput label="Email" inputType="text" id="email" v-model="email" />
    <TextInput label="Contraseña" inputType="password" id="password" v-model="password" />
    <ErrorMessage :errorMessage="authStore.errorMessage" />
    <SubmitButton :isButtonDisabled :isSubmitting="authStore.isSubmitting">Continuar</SubmitButton>
  </form>
</template>
