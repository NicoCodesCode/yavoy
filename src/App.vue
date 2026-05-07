<script setup lang="ts">
import AppFooter from './components/AppFooter.vue'
import NavBar from './components/NavBar.vue'
import LoadingScreen from '@/components/LoadingScreen.vue'
import { useAuth } from './stores/auth'

const authStore = useAuth()
</script>

<template>
  <div class="min-h-screen bg-white flex flex-col">
    <LoadingScreen v-if="authStore.isLoading" />
    <template v-else>
      <NavBar />
      <RouterView />
      <AppFooter />
    </template>
  </div>
</template>

<style scoped></style>
