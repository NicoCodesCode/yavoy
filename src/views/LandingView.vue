<script setup lang="ts">
import Button from 'primevue/button'
import { AuthAction } from '@/types'
import { ref } from 'vue'
import AuthSelectorDialog from '@/components/AuthSelectorDialog.vue'

const action = ref<AuthAction | null>(null)
</script>

<template>
  <p>Una plataforma que conecta usuarios con prestadores de servicios verificados</p>
  <Button @click="action = AuthAction.LOGIN" label="Iniciar sesión" variant="text" />
  <Button @click="action = AuthAction.JOIN" label="Únete" variant="outlined" />
  <AuthSelectorDialog
    @closeDialog="action = null"
    @changeAction="(newAction) => (action = newAction)"
    :action
  />
</template>
