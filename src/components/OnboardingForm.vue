<script setup lang="ts">
import { useAuth } from '@/stores/auth'
import DialogError from './DialogError.vue'
import SubmitButton from './SubmitButton.vue'
import { computed, ref, watch } from 'vue'
import AuthTextInput from './AuthTextInput.vue'

const authStore = useAuth()

const props = defineProps<{ isVisible: boolean }>()

const name = ref('')

const isButtonDisabled = computed(() => !name.value.trim() || authStore.isSubmitting)

async function handleSubmit() {
  if (isButtonDisabled.value) return
  authStore.completeOnboarding(name.value.trim())
}

watch(
  () => props.isVisible,
  () => {
    if (!props.isVisible) {
      name.value = ''
    }
  },
)
</script>

<template>
  <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
    <AuthTextInput label="Nombre completo" inputType="text" id="name" v-model="name" />
    <DialogError />
    <SubmitButton :isButtonDisabled />
  </form>
</template>
