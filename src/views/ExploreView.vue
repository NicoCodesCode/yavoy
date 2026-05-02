<script setup lang="ts">
import { signOut, type User } from 'firebase/auth'
import Button from 'primevue/button'
import { auth } from '@/firebase'

defineProps<{ currentUser: User }>()

async function logout() {
  try {
    await signOut(auth)
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <h2>Bienvenido, {{ currentUser.email }}!</h2>
  <Button label="Cerrar sesión" variant="outlined" severity="danger" @click="logout" />
</template>
