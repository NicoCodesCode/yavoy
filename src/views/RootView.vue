<script setup lang="ts">
import { onAuthStateChanged, type User } from 'firebase/auth'
import LandingView from './LandingView.vue'
import ExploreView from './ExploreView.vue'
import { auth } from '@/firebase'
import { ref } from 'vue'

const currentUser = ref<User | null>(null)
const isLoading = ref(true)

onAuthStateChanged(auth, (user) => {
  currentUser.value = user
  isLoading.value = false
})
</script>

<template>
  <p v-if="isLoading">Cargando...</p>
  <ExploreView v-else-if="currentUser" :currentUser />
  <LandingView v-else />
</template>
