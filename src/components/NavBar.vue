<script setup lang="ts">
import { useAuth } from '@/stores/auth'
import OutlinedButton from './OutlinedButton.vue'
import ProfilePopover from './ProfilePopover.vue'
import { useProfile } from '@/stores/profile'
import TextButton from './TextButton.vue'
import { useRouter } from 'vue-router'

const authStore = useAuth()
const profileStore = useProfile()
const router = useRouter()
</script>

<template>
  <header class="flex items-center justify-between px-8 py-6 border-b border-zinc-200">
    <span
      class="text-2xl font-bold tracking-widest text-zinc-900 cursor-pointer"
      @click="router.push({ name: 'home' })"
    >
      YaVoy<span class="text-[#1dbf73]">!</span>
    </span>

    <ProfilePopover v-if="authStore.currentUser && profileStore.userProfile" />

    <div v-else class="flex items-center gap-3">
      <TextButton @click="authStore.open('login')">Iniciar sesión</TextButton>
      <OutlinedButton @click="authStore.open('join')">Únete</OutlinedButton>
    </div>
  </header>
</template>
