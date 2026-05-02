<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import IftaLabel from 'primevue/iftalabel'
import InputText from 'primevue/inputtext'
import Message from 'primevue/message'
import Password from 'primevue/password'

const props = defineProps<{
  visible: boolean
  errorMessage: string
}>()

const emit = defineEmits<{
  goBack: []
  continueWithEmail: [email: string, password: string]
}>()

const email = ref('')
const password = ref('')

const isButtonDisabled = computed(() => !email.value.trim() || !password.value.trim())

watch(
  () => props.visible,
  (isVisible) => {
    if (!isVisible) {
      email.value = ''
      password.value = ''
    }
  },
)
</script>

<template>
  <Dialog :visible modal :closable="false">
    <template #header>
      <Button label="Volver" icon="pi pi-arrow-left" variant="link" @click="emit('goBack')" />
    </template>
    <h2>Continuar con tu correo electrónico</h2>
    <form @submit.prevent="emit('continueWithEmail', email, password)">
      <IftaLabel>
        <InputText id="email" v-model="email" />
        <label for="email">Correo electrónico</label>
      </IftaLabel>
      <IftaLabel>
        <Password id="password" v-model="password" :feedback="false" toggleMask />
        <label for="password">Contraseña</label>
      </IftaLabel>
      <Message v-if="errorMessage" severity="error">{{ errorMessage }}</Message>
      <Button type="submit" label="Continuar" :disabled="isButtonDisabled" />
    </form>
  </Dialog>
</template>
