<script setup lang="ts">
import { useProfile } from '@/stores/profile'
import { computed } from 'vue'

const profileStore = useProfile()

const initial = computed(() => profileStore.userProfile?.username.charAt(0).toUpperCase())
</script>

<template>
  <div
    class="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white overflow-hidden"
    :style="
      !profileStore.userProfile?.photoURL
        ? { backgroundColor: profileStore.avatarColor ?? '#000' }
        : {}
    "
  >
    <img
      v-if="profileStore.userProfile?.photoURL"
      :src="profileStore.userProfile?.photoURL"
      :alt="profileStore.userProfile?.username"
      class="w-full h-full object-cover"
    />
    <span v-else>{{ initial }}</span>
  </div>
</template>
