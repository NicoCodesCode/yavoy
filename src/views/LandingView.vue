<script setup lang="ts">
import Button from 'primevue/button'
import JoinDialog from '@/components/JoinDialog.vue'
import { AuthAction } from '@/types'

import { ref } from 'vue'

const action = ref<AuthAction | null>(null)

// const signInVisible = computed(() => (action.value === AuthAction.LOGIN ? true : false))
</script>

<template>
  <p>Una plataforma que conecta usuarios con prestadores de servicios verificados</p>
  <Button @click="action = AuthAction.LOGIN" label="Iniciar sesión" variant="text" />
  <Button @click="action = AuthAction.JOIN" label="Únete" variant="outlined" />
  <JoinDialog @closeDialog="action = null" :action />
</template>
