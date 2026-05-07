import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/firebase'
import type { UserProfile } from '@/types'

const AVATAR_COLORS = [
  '#f97316',
  '#eab308',
  '#22c55e',
  '#14b8a6',
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#ef4444',
]

export const useProfile = defineStore('profile', () => {
  const userProfile = ref<UserProfile | null>(null)
  const isLoadingProfile = ref(false)

  const avatarColor = computed(() => {
    if (!userProfile.value) return null
    const hash = userProfile.value.username
      .split('')
      .reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return AVATAR_COLORS[hash % AVATAR_COLORS.length]
  })

  async function fetchProfile(uid: string) {
    isLoadingProfile.value = true
    const userDoc = await getDoc(doc(db, 'users', uid))
    if (userDoc.exists()) {
      const data = userDoc.data()
      userProfile.value = {
        username: data.username,
        fullName: data.fullName ?? null,
        photoURL: data.photoURL ?? null,
      }
    }
    isLoadingProfile.value = false
  }

  async function updateProfile(data: Partial<Omit<UserProfile, 'username'>>, uid: string) {
    await updateDoc(doc(db, 'users', uid), data)
    if (userProfile.value) {
      userProfile.value = { ...userProfile.value, ...data }
    }
  }

  function clearProfile() {
    userProfile.value = null
  }

  return {
    userProfile,
    isLoadingProfile,
    avatarColor,
    fetchProfile,
    updateProfile,
    clearProfile,
  }
})
