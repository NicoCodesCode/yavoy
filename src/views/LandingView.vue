<script setup lang="ts">
import { ref } from 'vue'
import Button from 'primevue/button'
import AuthSelectorDialog from '@/components/AuthSelectorDialog.vue'
import EmailAuthDialog from '@/components/EmailAuthDialog.vue'
import { AuthAction } from '@/types'

const action = ref<AuthAction | null>(null)
const emailAuthVisible = ref(false)

function closeAllDialogs() {
  action.value = null
  emailAuthVisible.value = false
}
</script>

<template>
  <p>Una plataforma que conecta usuarios con prestadores de servicios verificados</p>
  <Button label="Iniciar sesión" variant="text" @click="action = AuthAction.LOGIN" />
  <Button label="Únete" variant="outlined" @click="action = AuthAction.JOIN" />
  <AuthSelectorDialog
    :action
    :emailAuthVisible
    @closeDialog="action = null"
    @changeAction="(newAction) => (action = newAction)"
    @openEmailAuthDialog="emailAuthVisible = true"
  />
  <EmailAuthDialog
    :action
    :emailAuthVisible
    @closeDialog="emailAuthVisible = false"
    @authCompleted="closeAllDialogs"
  />
</template>
