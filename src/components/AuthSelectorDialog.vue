<script setup lang="ts">
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import { AuthAction } from '@/types'
import { computed } from 'vue'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { auth } from '@/firebase'

const emit = defineEmits<{ closeDialog: []; changeAction: [newAction: AuthAction] }>()
const props = defineProps<{ action: AuthAction | null }>()

const visible = computed(() => !!props.action)
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
  try {
    await signInWithPopup(auth, new GoogleAuthProvider())
    emit('closeDialog')
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <Dialog v-model:visible="visible" modal :header @update:visible="$emit('closeDialog')">
    <span
      >{{ spanText.question }}
      <Button
        @click="
          $emit('changeAction', action === AuthAction.JOIN ? AuthAction.LOGIN : AuthAction.JOIN)
        "
        :label="spanText.action"
        variant="link"
    /></span>
    <div>
      <Button @click="continueWithGoogle" label="Continuar con Google" icon="pi pi-google" />
    </div>
    <div>
      <Button :label="emailButtonAttributes.label" :variant="emailButtonAttributes.variant" />
    </div>
  </Dialog>
</template>
