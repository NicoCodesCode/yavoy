<script setup lang="ts">
import Button from 'primevue/button'
import AuthSelectorDialog from '@/components/AuthSelectorDialog.vue'
import EmailAuthDialog from '@/components/EmailAuthDialog.vue'
import { useAuthDialog } from '@/composables/useAuthDialog'
import { AuthAction } from '@/types'

const authDialog = useAuthDialog()
</script>

<template>
  <p>Una plataforma que conecta usuarios con prestadores de servicios verificados</p>
  <Button label="Iniciar sesión" variant="text" @click="authDialog.open(AuthAction.LOGIN)" />
  <Button label="Únete" variant="outlined" @click="authDialog.open(AuthAction.JOIN)" />

  <AuthSelectorDialog
    :visible="authDialog.step.value.stage === 'selector'"
    :action="authDialog.step.value.action!"
    :errorMessage="authDialog.errorMessage.value"
    @update:visible="authDialog.close"
    @open="authDialog.open"
    @goToEmail="authDialog.goToEmail"
    @continueWithGoogle="authDialog.continueWithGoogle"
  />

  <EmailAuthDialog
    :visible="authDialog.step.value.stage === 'email'"
    :errorMessage="authDialog.errorMessage.value"
    @goBack="authDialog.goBackToSelector"
    @continueWithEmail="authDialog.continueWithEmail"
  />
</template>
