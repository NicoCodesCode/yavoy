import { ref } from 'vue'
import { defineStore } from 'pinia'
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore'
import { db } from '@/firebase'
import { useAuth } from '@/stores/auth'
import type { Service, ServiceCategory } from '@/types'

export type ServiceFormData = Omit<Service, 'id' | 'providerId' | 'isActive' | 'createdAt'>

export const useServices = defineStore('services', () => {
  const authStore = useAuth()

  const providerServices = ref<Service[]>([])
  const browseServices = ref<Service[]>([])
  const isLoading = ref(false)
  const errorMessage = ref('')

  async function fetchProviderServices() {
    if (!authStore.currentUser) return
    isLoading.value = true
    errorMessage.value = ''
    try {
      const q = query(
        collection(db, 'services'),
        where('providerId', '==', authStore.currentUser.uid),
        orderBy('createdAt', 'desc'),
      )
      const snapshot = await getDocs(q)
      providerServices.value = snapshot.docs.map((doc) => ({
        ...(doc.data() as Omit<Service, 'id'>),
        id: doc.id,
      }))
    } catch {
      errorMessage.value = 'No se pudieron cargar tus servicios.'
    } finally {
      isLoading.value = false
    }
  }

  async function fetchBrowseServices(filters: {
    category?: ServiceCategory
    area?: string
    sortByPrice?: 'asc' | 'desc'
  }) {
    isLoading.value = true
    errorMessage.value = ''
    try {
      let q = query(collection(db, 'services'), where('isActive', '==', true))

      if (filters.category) {
        q = query(q, where('category', '==', filters.category))
      }

      if (filters.sortByPrice) {
        q = query(q, orderBy('price', filters.sortByPrice))
      } else {
        q = query(q, orderBy('createdAt', 'desc'))
      }

      const snapshot = await getDocs(q)
      let results = snapshot.docs.map((doc) => ({
        ...(doc.data() as Omit<Service, 'id'>),
        id: doc.id,
      }))

      // Filter client-side since Firestore doesn't support case-insensitive partial string matching
      // Use Angolia when the app grows
      if (filters.area) {
        const area = filters.area.toLowerCase()
        results = results.filter((s) => s.area.toLowerCase().includes(area))
      }

      browseServices.value = results
    } catch {
      errorMessage.value = 'No se pudieron cargar los servicios.'
    } finally {
      isLoading.value = false
    }
  }

  async function createService(data: ServiceFormData) {
    if (!authStore.currentUser) return
    errorMessage.value = ''
    try {
      const ref = doc(collection(db, 'services'))
      const service: Omit<Service, 'id'> = {
        ...data,
        providerId: authStore.currentUser.uid,
        isActive: true,
        createdAt: serverTimestamp(),
      }
      await setDoc(ref, service)
      providerServices.value.unshift({ ...service, id: ref.id })
    } catch {
      errorMessage.value = 'No se pudo crear el servicio.'
    }
  }

  async function updateService(
    id: string,
    data: Partial<Omit<Service, 'id' | 'providerId' | 'createdAt'>>,
  ) {
    errorMessage.value = ''
    try {
      await updateDoc(doc(db, 'services', id), data)
      const index = providerServices.value.findIndex((s) => s.id === id)
      if (index !== -1 && providerServices.value[index]) {
        providerServices.value[index] = { ...providerServices.value[index], ...data }
      }
    } catch {
      errorMessage.value = 'No se pudo actualizar el servicio.'
    }
  }

  async function toggleServiceActive(id: string, isActive: boolean) {
    await updateService(id, { isActive })
  }

  async function deleteService(id: string) {
    errorMessage.value = ''
    try {
      await deleteDoc(doc(db, 'services', id))
      providerServices.value = providerServices.value.filter((s) => s.id !== id)
    } catch {
      errorMessage.value = 'No se pudo eliminar el servicio.'
    }
  }

  return {
    providerServices,
    browseServices,
    isLoading,
    errorMessage,
    fetchProviderServices,
    fetchBrowseServices,
    createService,
    updateService,
    toggleServiceActive,
    deleteService,
  }
})
