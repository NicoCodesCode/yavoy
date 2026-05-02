<script setup lang="ts">
import { ref } from 'vue'
import { onAuthStateChanged, type User } from 'firebase/auth'
import { auth } from '@/firebase'
import ExploreView from './ExploreView.vue'
import LandingView from './LandingView.vue'

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
