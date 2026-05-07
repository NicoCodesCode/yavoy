import { watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/stores/auth'

export function useRequireAuth() {
  const authStore = useAuth()
  const router = useRouter()

  watch(
    [() => authStore.currentUser, () => authStore.isLoading],
    ([user, loading]) => {
      if (!loading && !user) router.push({ name: 'home' })
    },
    { immediate: true },
  )
}
