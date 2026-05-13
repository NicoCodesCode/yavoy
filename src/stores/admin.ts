import { ref } from 'vue'
import { defineStore } from 'pinia'
import {
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore'
import { db } from '@/firebase'
import type { ProviderApplication } from '@/types'

export const useAdmin = defineStore('admin', () => {
  const applications = ref<ProviderApplication[]>([])
  const isLoading = ref(false)
  const errorMessage = ref('')

  async function fetchPendingApplications() {
    isLoading.value = true
    errorMessage.value = ''
    try {
      const q = query(collection(db, 'providerApplications'), where('status', '==', 'pending'))
      const snapshot = await getDocs(q)
      applications.value = snapshot.docs.map((doc) => ({
        ...(doc.data() as Omit<ProviderApplication, 'uid'>),
        uid: doc.id,
      }))
    } catch (error) {
      console.log(error)
      errorMessage.value = 'No se pudieron cargar las solicitudes.'
    } finally {
      isLoading.value = false
    }
  }

  async function approveApplication(uid: string) {
    const application = applications.value.find((a) => a.uid === uid)
    await updateDoc(doc(db, 'providerApplications', uid), { status: 'approved' })
    await updateDoc(doc(db, 'users', uid), {
      role: 'provider',
      photoURL: application?.photoURL ?? null,
    })
    applications.value = applications.value.filter((a) => a.uid !== uid)
  }

  async function rejectApplication(uid: string, reason: string) {
    try {
      await updateDoc(doc(db, 'providerApplications', uid), {
        status: 'rejected',
        rejectedAt: serverTimestamp(),
        rejectionReason: reason,
      })
      applications.value = applications.value.filter((a) => a.uid !== uid)
    } catch {
      errorMessage.value = 'No se pudo rechazar la solicitud.'
    }
  }

  return {
    applications,
    isLoading,
    errorMessage,
    fetchPendingApplications,
    approveApplication,
    rejectApplication,
  }
})
