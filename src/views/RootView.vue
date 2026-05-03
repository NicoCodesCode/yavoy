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
  <div v-if="isLoading" class="min-h-screen bg-white flex items-center justify-center">
    <div class="flex flex-col items-center gap-4">
      <span class="text-xl tracking-widest text-zinc-300 font-semibold">YaVoy!</span>
      <div class="w-5 h-5 border-2 border-zinc-100 border-t-[#1dbf73] rounded-full animate-spin" />
    </div>
  </div>

  <ExploreView v-else-if="currentUser" :currentUser />
  <LandingView v-else />
</template>
