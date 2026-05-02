<script setup lang="ts">
import { auth } from '@/firebase'
import { signOut, type User } from 'firebase/auth'
import Button from 'primevue/button'

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
  <Button @click="logout" label="Cerrar sesión" variant="outlined" severity="danger" />
</template>
