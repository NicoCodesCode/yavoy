import { ref } from 'vue'
import { defineStore } from 'pinia'
import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  doc,
  where,
} from 'firebase/firestore'
import { db } from '@/firebase'
import { useAuth } from '@/stores/auth'
import type { Booking, BookingStatus } from '@/types'

export type BookingFormData = {
  serviceId: string
  providerId: string
  serviceName: string
  clientName: string
  date: Date
  description: string
}

export const useBookings = defineStore('bookings', () => {
  const authStore = useAuth()

  const providerBookings = ref<Booking[]>([])
  const clientBookings = ref<Booking[]>([])
  const isLoading = ref(false)
  const errorMessage = ref('')

  async function fetchProviderBookings() {
    if (!authStore.currentUser) return
    isLoading.value = true
    errorMessage.value = ''
    try {
      const q = query(
        collection(db, 'bookings'),
        where('providerId', '==', authStore.currentUser.uid),
        orderBy('createdAt', 'desc'),
      )
      const snapshot = await getDocs(q)
      providerBookings.value = snapshot.docs.map((d) => ({
        ...(d.data() as Omit<Booking, 'id'>),
        id: d.id,
      }))
    } catch {
      errorMessage.value = 'No se pudieron cargar las reservas.'
    } finally {
      isLoading.value = false
    }
  }

  async function fetchClientBookings() {
    if (!authStore.currentUser) return
    isLoading.value = true
    errorMessage.value = ''
    try {
      const q = query(
        collection(db, 'bookings'),
        where('clientId', '==', authStore.currentUser.uid),
        orderBy('createdAt', 'desc'),
      )
      const snapshot = await getDocs(q)
      clientBookings.value = snapshot.docs.map((d) => ({
        ...(d.data() as Omit<Booking, 'id'>),
        id: d.id,
      }))
    } catch {
      errorMessage.value = 'No se pudieron cargar tus reservas.'
    } finally {
      isLoading.value = false
    }
  }

  async function createBooking(data: BookingFormData): Promise<boolean> {
    if (!authStore.currentUser) return false
    errorMessage.value = ''
    try {
      const booking: Omit<Booking, 'id'> = {
        serviceId: data.serviceId,
        providerId: data.providerId,
        clientId: authStore.currentUser.uid,
        clientName: data.clientName,
        serviceName: data.serviceName,
        date: data.date,
        description: data.description,
        status: 'pending',
        providerMessage: null,
        createdAt: serverTimestamp(),
      }
      const ref = await addDoc(collection(db, 'bookings'), booking)
      clientBookings.value.unshift({ ...booking, id: ref.id })
      return true
    } catch {
      errorMessage.value = 'No se pudo enviar la reserva.'
      return false
    }
  }

  async function respondToBooking(
    id: string,
    status: Extract<BookingStatus, 'accepted' | 'rejected'>,
    providerMessage: string,
  ) {
    errorMessage.value = ''
    try {
      await updateDoc(doc(db, 'bookings', id), { status, providerMessage })
      const index = providerBookings.value.findIndex((b) => b.id === id)
      if (index !== -1 && providerBookings.value[index]) {
        providerBookings.value[index] = {
          ...providerBookings.value[index],
          status,
          providerMessage,
        }
      }
    } catch {
      errorMessage.value = 'No se pudo responder a la reserva.'
    }
  }

  return {
    providerBookings,
    clientBookings,
    isLoading,
    errorMessage,
    fetchProviderBookings,
    fetchClientBookings,
    createBooking,
    respondToBooking,
  }
})
