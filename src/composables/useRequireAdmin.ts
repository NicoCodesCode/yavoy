import { watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/stores/auth'

export function useRequireAdmin() {
  const authStore = useAuth()
  const router = useRouter()

  watch(
    [() => authStore.currentUser, () => authStore.isLoading],
    ([user, loading]) => {
      if (!loading && user?.uid !== import.meta.env.VITE_ADMIN_UID) {
        router.push({ name: 'home' })
      }
    },
    { immediate: true },
  )
}
