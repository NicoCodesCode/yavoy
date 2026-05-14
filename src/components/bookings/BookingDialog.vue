<script setup lang="ts">
import { ref, computed } from 'vue'
import Dialog from 'primevue/dialog'
import DatePicker from 'primevue/datepicker'
import { useBookings } from '@/stores/bookings'
import { useProfile } from '@/stores/profile'
import type { Service } from '@/types'

const props = defineProps<{
  visible: boolean
  service: Service | null
}>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
}>()

const bookingsStore = useBookings()
const profileStore = useProfile()

const selectedDate = ref<Date | null>(null)
const description = ref('')
const isSuccess = ref(false)

const minDate = computed(() => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(0, 0, 0, 0)
  return tomorrow
})

const isDisabled = computed(
  () => !selectedDate.value || !description.value.trim() || bookingsStore.isLoading,
)

function handleClose() {
  emit('update:visible', false)
  setTimeout(() => {
    selectedDate.value = null
    description.value = ''
    isSuccess.value = false
    bookingsStore.errorMessage = ''
  }, 300)
}

async function handleSubmit() {
  if (!props.service || isDisabled.value) return
  const success = await bookingsStore.createBooking({
    serviceId: props.service.id,
    providerId: props.service.providerId,
    serviceName: props.service.title,
    clientName: profileStore.userProfile?.fullName ?? profileStore.userProfile?.username ?? '',
    date: selectedDate.value!,
    description: description.value.trim(),
  })
  if (success) isSuccess.value = true
}
</script>

<template>
  <Dialog
    :visible
    modal
    :showHeader="false"
    :closable="false"
    class="rounded-none! shadow-2xl! bg-zinc-100! border-0! p-0! w-full! max-w-md!"
    @update:visible="emit('update:visible', $event)"
  >
    <div class="flex flex-col px-8 pt-8 pb-10 gap-6">
      <template v-if="isSuccess">
        <div class="flex flex-col items-center gap-4 py-6 text-center">
          <div class="w-14 h-14 rounded-full bg-[#1dbf73]/10 flex items-center justify-center">
            <i class="pi pi-check text-[#1dbf73] text-2xl" />
          </div>
          <div>
            <h2 class="text-xl font-semibold text-zinc-900 mb-1">¡Solicitud enviada!</h2>
            <p class="text-sm text-zinc-400">
              El prestador revisará tu solicitud y te responderá pronto.
            </p>
          </div>
          <button
            class="mt-2 px-6 py-2.5 text-sm font-medium bg-zinc-900 text-white rounded-sm hover:bg-zinc-700 transition-colors cursor-pointer"
            @click="handleClose"
          >
            Cerrar
          </button>
        </div>
      </template>

      <template v-else>
        <div class="flex items-start justify-between">
          <div>
            <p class="text-xs tracking-widest uppercase text-[#1dbf73] font-medium mb-1">
              Reservar
            </p>
            <h2 class="text-xl font-semibold text-zinc-900 leading-snug">{{ service?.title }}</h2>
            <p class="text-sm text-zinc-400 mt-0.5">
              ${{ service?.price.toLocaleString('es-MX') }}
              {{ service?.priceType === 'fixed' ? '(precio fijo)' : '/ hora' }}
            </p>
          </div>
          <button
            class="text-zinc-300 hover:text-zinc-600 transition-colors cursor-pointer mt-0.5"
            @click="handleClose"
          >
            <i class="pi pi-times text-sm" />
          </button>
        </div>

        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-medium text-zinc-800 tracking-wide uppercase">
            Fecha y hora
          </label>
          <DatePicker
            v-model="selectedDate"
            :minDate
            showTime
            hourFormat="12"
            placeholder="Selecciona fecha y hora"
            class="w-full"
            fluid
            inputClass="bg-white! text-black!"
          />
        </div>

        <div class="flex flex-col gap-1.5">
          <label
            for="bookingDesc"
            class="text-xs font-medium text-zinc-800 tracking-wide uppercase"
          >
            ¿Qué necesitas?
          </label>
          <textarea
            id="bookingDesc"
            v-model="description"
            rows="4"
            maxlength="500"
            placeholder="Describe brevemente lo que necesitas..."
            class="w-full px-3 py-2.5 text-sm text-zinc-800 border border-zinc-300 rounded-sm hover:border-zinc-500 focus:border-zinc-900 focus:outline-none transition-colors resize-none"
          />
          <span class="text-xs text-zinc-400 text-right">{{ description.length }} / 500</span>
        </div>

        <div
          v-if="bookingsStore.errorMessage"
          class="flex items-center gap-2 px-3 py-2.5 bg-red-50 border border-red-200 rounded-sm"
        >
          <i class="pi pi-exclamation-circle text-red-400 text-sm" />
          <span class="text-sm text-red-600">{{ bookingsStore.errorMessage }}</span>
        </div>

        <button
          :disabled="isDisabled"
          class="w-full px-4 py-2.5 text-sm font-medium rounded-sm transition-colors"
          :class="
            isDisabled
              ? 'bg-zinc-100 text-zinc-300 cursor-not-allowed'
              : 'bg-[#1dbf73] text-white hover:bg-[#19a863] cursor-pointer'
          "
          @click="handleSubmit"
        >
          <span v-if="bookingsStore.isLoading" class="flex items-center justify-center gap-2">
            <i class="pi pi-spin pi-spinner text-sm" />
            Enviando...
          </span>
          <span v-else>Enviar solicitud</span>
        </button>
      </template>
    </div>
  </Dialog>
</template>
