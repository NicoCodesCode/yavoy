<script setup lang="ts">
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import { AuthAction } from '@/types'
import { computed } from 'vue'

defineEmits(['closeDialog'])
const props = defineProps<{ action: AuthAction | null }>()

const visible = computed(() => (props.action === AuthAction.JOIN ? true : false))
</script>

<template>
  <Dialog
    v-model:visible="visible"
    modal
    header="Crear una cuenta nueva"
    @update:visible="$emit('closeDialog')"
  >
    <span>¿Ya tienes una cuenta? <Button label="Iniciar sesión" variant="link" /></span>
    <div>
      <Button label="Continuar con Google" icon="pi pi-google" variant="outlined" />
    </div>
    <div>
      <Button label="O regístrate con el correo electrónico" variant="link" />
    </div>
  </Dialog>
</template>
