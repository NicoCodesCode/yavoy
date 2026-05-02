<script setup lang="ts">
import Button from 'primevue/button'
import { AuthAction } from '@/types'
import { ref } from 'vue'
import AuthSelectorDialog from '@/components/AuthSelectorDialog.vue'
import EmailAuthDialog from '@/components/EmailAuthDialog.vue'

const action = ref<AuthAction | null>(null)
const emailAuthVisible = ref(false)

function closeAllDialogs() {
  action.value = null
  emailAuthVisible.value = false
}
</script>

<template>
  <p>Una plataforma que conecta usuarios con prestadores de servicios verificados</p>
  <Button @click="action = AuthAction.LOGIN" label="Iniciar sesión" variant="text" />
  <Button @click="action = AuthAction.JOIN" label="Únete" variant="outlined" />
  <AuthSelectorDialog
    @closeDialog="action = null"
    @changeAction="(newAction) => (action = newAction)"
    @openEmailAuthDialog="emailAuthVisible = true"
    :action
    :emailAuthVisible
  />
  <EmailAuthDialog
    @closeDialog="emailAuthVisible = false"
    @authCompleted="closeAllDialogs"
    :action
    :emailAuthVisible
  />
</template>
