<script setup lang="ts">
import { computed } from 'vue'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Message from 'primevue/message'
import { AuthAction } from '@/types'

const props = defineProps<{
  visible: boolean
  action: AuthAction
  errorMessage: string
}>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
  open: [action: AuthAction]
  goToEmail: []
  continueWithGoogle: []
}>()

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
</script>

<template>
  <Dialog :visible modal :header @update:visible="emit('update:visible', $event)">
    <Message v-if="errorMessage" severity="error">{{ errorMessage }}</Message>
    <span>
      {{ spanText.question }}
      <Button :label="spanText.action" variant="link" @click="emit('open', oppositeAction)" />
    </span>
    <div>
      <Button
        label="Continuar con Google"
        icon="pi pi-google"
        @click="emit('continueWithGoogle')"
      />
    </div>
    <div>
      <Button
        :label="emailButtonAttributes.label"
        :variant="emailButtonAttributes.variant"
        @click="emit('goToEmail')"
      />
    </div>
  </Dialog>
</template>
