<script setup lang="ts">
import { onMounted } from 'vue'
import { useBookings } from '@/stores/bookings'
import { useRequireAuth } from '@/composables/useRequireAuth'

useRequireAuth()

const bookingsStore = useBookings()

onMounted(() => bookingsStore.fetchClientBookings())

function parseDate(date: unknown): Date {
  const d = date as { toDate?: () => Date } | string | number
  return typeof d === 'object' && d?.toDate ? d.toDate() : new Date(d as string | number)
}

function formatDate(date: unknown): string {
  return parseDate(date).toLocaleDateString('es-MX', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function formatTime(date: unknown): string {
  return parseDate(date).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
}

const statusStyle: Record<string, string> = {
  pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  accepted: 'bg-green-50 text-[#1dbf73] border-green-200',
  rejected: 'bg-red-50 text-red-500 border-red-200',
}

const statusLabel: Record<string, string> = {
  pending: 'Pendiente',
  accepted: 'Aceptada',
  rejected: 'Rechazada',
}
</script>

<template>
  <main class="flex-1 max-w-2xl mx-auto w-full px-6 py-12">
    <div class="flex flex-col gap-8">
      <div>
        <p class="text-xs tracking-widest uppercase text-[#1dbf73] font-medium mb-1">
          Mis reservas
        </p>
        <h1 class="text-3xl font-semibold text-zinc-900">Mis reservas</h1>
      </div>

      <div v-if="bookingsStore.isLoading" class="flex items-center justify-center py-20">
        <div class="flex flex-col items-center gap-4">
          <div
            class="w-5 h-5 border-2 border-zinc-100 border-t-[#1dbf73] rounded-full animate-spin"
          />
          <span class="text-sm text-zinc-400">Cargando reservas...</span>
        </div>
      </div>

      <div
        v-else-if="bookingsStore.clientBookings.length === 0"
        class="flex flex-col items-center justify-center py-20 gap-3"
      >
        <i class="pi pi-calendar text-zinc-200 text-5xl" />
        <p class="text-sm text-zinc-400">No tienes reservas aún.</p>
      </div>

      <template v-else>
        <div
          v-for="booking in bookingsStore.clientBookings"
          :key="booking.id"
          class="border border-zinc-200 rounded-sm p-5 flex flex-col gap-4"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="flex flex-col gap-1">
              <h3 class="text-base font-semibold text-zinc-900">{{ booking.serviceName }}</h3>
            </div>
            <span
              class="text-xs px-2.5 py-1 rounded-full font-medium border shrink-0"
              :class="statusStyle[booking.status]"
            >
              {{ statusLabel[booking.status] }}
            </span>
          </div>

          <div class="flex items-center gap-4 text-sm text-zinc-500">
            <div class="flex items-center gap-1.5">
              <i class="pi pi-calendar text-zinc-400 text-xs" />
              <span class="capitalize">{{ formatDate(booking.date) }}</span>
            </div>
            <div class="flex items-center gap-1.5">
              <i class="pi pi-clock text-zinc-400 text-xs" />
              <span>{{ formatTime(booking.date) }}</span>
            </div>
          </div>

          <p class="text-sm text-zinc-600 leading-relaxed">{{ booking.description }}</p>

          <div
            v-if="booking.providerMessage"
            class="px-3 py-2.5 bg-zinc-50 rounded-sm border border-zinc-100"
          >
            <p class="text-xs font-medium text-zinc-400 uppercase tracking-wide mb-1">
              Respuesta del prestador
            </p>
            <p class="text-sm text-zinc-600">{{ booking.providerMessage }}</p>
          </div>
        </div>
      </template>
    </div>
  </main>
</template>
