<script setup lang="ts">
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import { computed, ref } from 'vue'
import IftaLabel from 'primevue/iftalabel'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import { AuthAction } from '@/types'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/firebase'

const emit = defineEmits(['closeDialog', 'authCompleted'])
const props = defineProps<{ action: AuthAction | null; emailAuthVisible: boolean }>()

const email = ref('')
const password = ref('')
const isButtonDisabled = computed(() => !(!!email.value.trim() && !!password.value.trim()))
const visible = computed(() => (props.emailAuthVisible ? true : false))

async function continueWithEmail() {
  try {
    if (props.action === AuthAction.LOGIN)
      return await signInWithEmailAndPassword(auth, email.value, password.value)
    await createUserWithEmailAndPassword(auth, email.value, password.value)
    emit('authCompleted')
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <Dialog v-model:visible="visible" modal :closable="false">
    <template #header>
      <Button @click="$emit('closeDialog')" label="Volver" icon="pi pi-arrow-left" variant="link" />
    </template>
    <h2>Continuar con tu correo electrónico</h2>
    <form @submit.prevent="continueWithEmail">
      <IftaLabel>
        <InputText id="email" v-model="email" />
        <label for="email">Correo electrónico</label>
      </IftaLabel>
      <IftaLabel>
        <Password id="password" v-model="password" :feedback="false" toggleMask />
        <label for="passwornd">Contraseña</label>
      </IftaLabel>
      <Button type="submit" label="Continuar" :disabled="isButtonDisabled" />
    </form>
  </Dialog>
</template>
