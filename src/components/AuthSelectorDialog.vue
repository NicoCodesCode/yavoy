<script setup lang="ts">
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Message from 'primevue/message'
import { AuthAction } from '@/types'
import { computed, ref } from 'vue'
import { AuthErrorCodes, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { auth } from '@/firebase'
import type { FirebaseError } from 'firebase/app'
import getErrorMessage from '@/utils/getErrorMessage'

const props = defineProps<{ action: AuthAction | null; emailAuthVisible: boolean }>()
const emit = defineEmits<{
  closeDialog: []
  changeAction: [newAction: AuthAction]
  openEmailAuthDialog: []
}>()

const errorMessage = ref<string | null>(null)
const visible = computed(() => !!props.action && !props.emailAuthVisible)
const header = computed(() =>
  props.action === AuthAction.JOIN ? 'Crear una cuenta nueva' : 'Inicia sesión en tu cuenta',
)
const spanText = computed(() =>
  props.action === AuthAction.JOIN
    ? { question: '¿Ya tienes una cuenta?', action: 'Iniciar sesión' }
    : { question: '¿No tienes una cuenta?', action: 'Únete aquí' },
)
const emailButtonAttributes = computed(() =>
  props.action === AuthAction.JOIN
    ? { label: 'O regístrate con el correo electrónico', variant: 'link' }
    : { label: 'Continuar con correo electrónico', variant: 'outlined' },
)

async function continueWithGoogle() {
  errorMessage.value = null
  try {
    await signInWithPopup(auth, new GoogleAuthProvider())
    emit('closeDialog')
  } catch (error) {
    const errorCode = (error as FirebaseError).code

    if (
      !(
        errorCode === AuthErrorCodes.POPUP_CLOSED_BY_USER ||
        errorCode === AuthErrorCodes.EXPIRED_POPUP_REQUEST
      )
    ) {
      errorMessage.value = getErrorMessage(errorCode)
    }
  }
}

function handleClose() {
  errorMessage.value = null
  emit('closeDialog')
}
</script>

<template>
  <Dialog v-model:visible="visible" modal :header @update:visible="handleClose">
    <Message v-if="errorMessage" severity="error">{{ errorMessage }}</Message>
    <span>
      {{ spanText.question }}
      <Button
        @click="
          $emit('changeAction', action === AuthAction.JOIN ? AuthAction.LOGIN : AuthAction.JOIN)
        "
        :label="spanText.action"
        variant="link"
      />
    </span>
    <div>
      <Button @click="continueWithGoogle" label="Continuar con Google" icon="pi pi-google" />
    </div>
    <div>
      <Button
        @click="$emit('openEmailAuthDialog')"
        :label="emailButtonAttributes.label"
        :variant="emailButtonAttributes.variant"
      />
    </div>
  </Dialog>
</template>
