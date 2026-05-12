<script setup lang="ts">
import { ref, computed } from 'vue'
import { useBookings } from '@/stores/bookings'
import type { Booking } from '@/types'

const props = defineProps<{ booking: Booking }>()

const bookingsStore = useBookings()

const showResponseForm = ref(false)
const providerMessage = ref('')
const isResponding = ref(false)
const respondingAs = ref<'accepted' | 'rejected' | null>(null)

const isMessageValid = computed(() => providerMessage.value.trim().length > 0)

const bookingDate = computed(() => {
  const date = parseBookingDate()
  return date.toLocaleDateString('es-MX', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})

const bookingTime = computed(() => {
  const date = parseBookingDate()
  return date.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
})

function parseBookingDate(): Date {
  const date = props.booking.date as { toDate?: () => Date } | string | number
  return typeof date === 'object' && date?.toDate
    ? date.toDate()
    : new Date(date as string | number)
}

const statusStyle = computed(() => {
  switch (props.booking.status) {
    case 'pending':
      return 'bg-yellow-50 text-yellow-700 border-yellow-200'
    case 'accepted':
      return 'bg-green-50 text-[#1dbf73] border-green-200'
    case 'rejected':
      return 'bg-red-50 text-red-500 border-red-200'
    default:
      return ''
  }
})

const statusLabel = computed(() => {
  switch (props.booking.status) {
    case 'pending':
      return 'Pendiente'
    case 'accepted':
      return 'Aceptada'
    case 'rejected':
      return 'Rechazada'
    default:
      return ''
  }
})

function openResponseForm(type: 'accepted' | 'rejected') {
  respondingAs.value = type
  showResponseForm.value = true
  providerMessage.value = ''
}

function cancelResponse() {
  showResponseForm.value = false
  respondingAs.value = null
  providerMessage.value = ''
}

async function submitResponse() {
  if (!respondingAs.value || !isMessageValid.value) return
  isResponding.value = true
  await bookingsStore.respondToBooking(
    props.booking.id,
    respondingAs.value,
    providerMessage.value.trim(),
  )
  isResponding.value = false
  showResponseForm.value = false
}
</script>

<template>
  <div class="border border-zinc-200 rounded-sm p-5 flex flex-col gap-4">
    <div class="flex items-start justify-between gap-3">
      <div class="flex flex-col gap-1">
        <h3 class="text-base font-semibold text-zinc-900">{{ booking.serviceName }}</h3>
        <p class="text-sm text-zinc-500">{{ booking.clientName }}</p>
      </div>
      <span
        class="text-xs px-2.5 py-1 rounded-full font-medium border shrink-0"
        :class="statusStyle"
      >
        {{ statusLabel }}
      </span>
    </div>

    <div class="flex items-center gap-4 text-sm text-zinc-500">
      <div class="flex items-center gap-1.5">
        <i class="pi pi-calendar text-zinc-400 text-xs" />
        <span class="capitalize">{{ bookingDate }}</span>
      </div>
      <div class="flex items-center gap-1.5">
        <i class="pi pi-clock text-zinc-400 text-xs" />
        <span>{{ bookingTime }}</span>
      </div>
    </div>

    <p class="text-sm text-zinc-600 leading-relaxed">{{ booking.description }}</p>

    <div
      v-if="booking.providerMessage"
      class="px-3 py-2.5 bg-zinc-50 rounded-sm border border-zinc-100"
    >
      <p class="text-xs font-medium text-zinc-400 uppercase tracking-wide mb-1">Tu respuesta</p>
      <p class="text-sm text-zinc-600">{{ booking.providerMessage }}</p>
    </div>

    <div v-if="booking.status === 'pending'" class="pt-1 border-t border-zinc-100">
      <div v-if="!showResponseForm" class="flex gap-3">
        <button
          class="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#1dbf73] text-zinc-900 rounded-sm hover:bg-[#19a863] transition-colors cursor-pointer"
          @click="openResponseForm('accepted')"
        >
          <i class="pi pi-check text-sm" />
          Aceptar
        </button>
        <button
          class="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-red-200 text-red-500 rounded-sm hover:bg-red-50 transition-colors cursor-pointer"
          @click="openResponseForm('rejected')"
        >
          <i class="pi pi-times text-sm" />
          Rechazar
        </button>
      </div>

      <div v-else class="flex flex-col gap-3">
        <p class="text-sm font-medium text-zinc-700">
          {{ respondingAs === 'accepted' ? 'Confirmar aceptación' : 'Confirmar rechazo' }}
        </p>
        <textarea
          v-model="providerMessage"
          :placeholder="
            respondingAs === 'accepted'
              ? 'Escribe un mensaje al cliente, ej: confirmo el servicio, nos vemos a las 10am.'
              : 'Explica por qué no puedes atender esta solicitud...'
          "
          rows="3"
          class="w-full px-3 py-2.5 text-sm text-zinc-800 border border-zinc-300 rounded-sm focus:border-zinc-900 focus:outline-none transition-colors resize-none"
        />
        <div class="flex gap-3">
          <button
            class="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-sm transition-colors cursor-pointer"
            :class="
              !isMessageValid || isResponding
                ? 'bg-zinc-100 text-zinc-300 cursor-not-allowed'
                : respondingAs === 'accepted'
                  ? 'bg-[#1dbf73] text-zinc-900 hover:bg-[#19a863]'
                  : 'bg-red-500 text-white hover:bg-red-600'
            "
            :disabled="!isMessageValid || isResponding"
            @click="submitResponse"
          >
            <i v-if="isResponding" class="pi pi-spin pi-spinner text-sm" />
            {{ isResponding ? 'Guardando...' : 'Confirmar' }}
          </button>
          <button
            class="px-4 py-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer"
            @click="cancelResponse"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
