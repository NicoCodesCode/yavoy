<script setup lang="ts">
import { computed, ref } from 'vue'
import { AuthErrorCodes, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import type { FirebaseError } from 'firebase/app'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Message from 'primevue/message'
import { auth } from '@/firebase'
import { AuthAction } from '@/types'
import getErrorMessage from '@/utils/getErrorMessage'

const props = defineProps<{
  action: AuthAction | null
  emailAuthVisible: boolean
}>()

const emit = defineEmits<{
  closeDialog: []
  changeAction: [newAction: AuthAction]
  openEmailAuthDialog: []
}>()

const errorMessage = ref('')

const visible = computed(() => !!props.action && !props.emailAuthVisible)

const isJoining = computed(() => props.action === AuthAction.JOIN)

const header = computed(() =>
  isJoining.value ? 'Crear una cuenta nueva' : 'Inicia sesión en tu cuenta',
)

const spanText = computed(() =>
  isJoining.value
    ? { question: '¿Ya tienes una cuenta?', action: 'Iniciar sesión' }
    : { question: '¿No tienes una cuenta?', action: 'Únete aquí' },
)

const emailButtonAttributes = computed(() =>
  isJoining.value
    ? { label: 'O regístrate con el correo electrónico', variant: 'link' }
    : { label: 'Continuar con correo electrónico', variant: 'outlined' },
)

const oppositeAction = computed(() => (isJoining.value ? AuthAction.LOGIN : AuthAction.JOIN))

async function continueWithGoogle() {
  errorMessage.value = ''
  try {
    await signInWithPopup(auth, new GoogleAuthProvider())
    emit('closeDialog')
  } catch (error) {
    const { code } = error as FirebaseError

    const isIgnoredError =
      code === AuthErrorCodes.POPUP_CLOSED_BY_USER || code === AuthErrorCodes.EXPIRED_POPUP_REQUEST

    if (!isIgnoredError) {
      errorMessage.value = getErrorMessage(code)
    }
  }
}

function handleClose() {
  errorMessage.value = ''
  emit('closeDialog')
}
</script>

<template>
  <Dialog v-model:visible="visible" modal :header @update:visible="handleClose">
    <Message v-if="errorMessage" severity="error">{{ errorMessage }}</Message>
    <span>
      {{ spanText.question }}
      <Button
        :label="spanText.action"
        variant="link"
        @click="emit('changeAction', oppositeAction)"
      />
    </span>
    <div>
      <Button label="Continuar con Google" icon="pi pi-google" @click="continueWithGoogle" />
    </div>
    <div>
      <Button
        :label="emailButtonAttributes.label"
        :variant="emailButtonAttributes.variant"
        @click="emit('openEmailAuthDialog')"
      />
    </div>
  </Dialog>
</template>
