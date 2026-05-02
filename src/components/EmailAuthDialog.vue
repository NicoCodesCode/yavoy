<script setup lang="ts">
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import Message from 'primevue/message'
import { computed, ref } from 'vue'
import IftaLabel from 'primevue/iftalabel'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import { AuthAction } from '@/types'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/firebase'
import type { FirebaseError } from 'firebase/app'
import getErrorMessage from '@/utils/getErrorMessage'

const emit = defineEmits(['closeDialog', 'authCompleted'])
const props = defineProps<{ action: AuthAction | null; emailAuthVisible: boolean }>()

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const isButtonDisabled = computed(() => !(!!email.value.trim() && !!password.value.trim()))
const visible = computed(() => props.emailAuthVisible)

async function continueWithEmail() {
  errorMessage.value = ''
  try {
    if (props.action === AuthAction.LOGIN) {
      await signInWithEmailAndPassword(auth, email.value, password.value)
    } else {
      await createUserWithEmailAndPassword(auth, email.value, password.value)
    }
    emit('authCompleted')
  } catch (error) {
    errorMessage.value = getErrorMessage((error as FirebaseError).code)
  }
}

function handleClose() {
  email.value = ''
  password.value = ''
  errorMessage.value = ''
  emit('closeDialog')
}
</script>

<template>
  <Dialog v-model:visible="visible" modal :closable="false">
    <template #header>
      <Button @click="handleClose" label="Volver" icon="pi pi-arrow-left" variant="link" />
    </template>
    <h2>Continuar con tu correo electrónico</h2>
    <form @submit.prevent="continueWithEmail">
      <IftaLabel>
        <InputText id="email" v-model="email" />
        <label for="email">Correo electrónico</label>
      </IftaLabel>
      <IftaLabel>
        <Password id="password" v-model="password" :feedback="false" toggleMask />
        <label for="password">Contraseña</label>
      </IftaLabel>
      <Message v-if="errorMessage" severity="error">{{ errorMessage }}</Message>
      <Button type="submit" label="Continuar" :disabled="isButtonDisabled" />
    </form>
  </Dialog>
</template>
