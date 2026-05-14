<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Popover from 'primevue/popover'
import { useAuth } from '@/stores/auth'
import { useProfile } from '@/stores/profile'
import UserAvatar from './UserAvatar.vue'
import TextButton from './buttons/TextButton.vue'

const authStore = useAuth()
const profileStore = useProfile()
const router = useRouter()

const popover = ref()

function togglePopover(event: Event) {
  popover.value.toggle(event)
}

async function goToProfile() {
  if (!profileStore.userProfile) return
  popover.value.hide()
  await router.push({ name: 'profile', params: { username: profileStore.userProfile.username } })
}

async function goToDashboard() {
  popover.value.hide()
  await router.push({ name: 'dashboard' })
}

async function goToBookings() {
  popover.value.hide()
  await router.push({ name: 'bookings' })
}

async function handleLogout() {
  popover.value.hide()
  await authStore.logout()
}
</script>

<template>
  <button
    class="cursor-pointer transition-opacity hover:opacity-80 focus:outline-none"
    @click="togglePopover"
  >
    <UserAvatar />
  </button>

  <Popover
    ref="popover"
    class="bg-white! border-white! before:border-b-white! after:border-b-white!"
  >
    <div class="flex flex-col min-w-44">
      <div class="flex items-center gap-3 px-4 py-3 border-b border-zinc-100">
        <UserAvatar />
        <div class="flex flex-col min-w-0">
          <span class="text-sm font-semibold text-zinc-900 truncate">
            {{ profileStore.userProfile?.username }}
          </span>
          <span class="text-xs text-zinc-400 truncate">{{ authStore.currentUser?.email }}</span>
        </div>
      </div>

      <div class="flex flex-col py-1">
        <TextButton class="flex items-center gap-2.5" @click="goToProfile">
          <i class="pi pi-user text-sm" />
          Mi perfil
        </TextButton>
        <TextButton
          v-if="profileStore.userProfile?.role === 'provider'"
          class="flex items-center gap-2.5"
          @click="goToDashboard"
        >
          <i class="pi pi-th-large text-sm" />
          Mi panel
        </TextButton>
        <TextButton class="flex items-center gap-2.5" @click="goToBookings">
          <i class="pi pi-calendar text-sm" />
          Mis reservas
        </TextButton>
        <TextButton class="flex items-center gap-2.5 text-red-500!" @click="handleLogout">
          <i class="pi pi-sign-out text-sm" />
          Cerrar sesión
        </TextButton>
      </div>
    </div>
  </Popover>
</template>
