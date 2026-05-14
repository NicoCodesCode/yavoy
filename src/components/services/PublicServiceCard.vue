<script setup lang="ts">
import { computed } from 'vue'
import type { Service } from '@/types'
import { getCategoryLabel } from '@/utils/categories'
import { useAuth } from '@/stores/auth'

const props = defineProps<{ service: Service }>()
const emit = defineEmits<{ book: [service: Service] }>()

const authStore = useAuth()

const isOwnService = computed(() => authStore.currentUser?.uid === props.service.providerId)
</script>

<template>
  <div class="border border-zinc-200 rounded-sm p-5 flex flex-col gap-4">
    <div class="flex items-start justify-between gap-3">
      <div class="flex flex-col gap-1 min-w-0">
        <h3 class="text-base font-semibold text-zinc-900">{{ service.title }}</h3>
        <span class="text-xs text-zinc-400">{{ getCategoryLabel(service.category) }}</span>
      </div>
      <div class="text-right shrink-0">
        <p class="text-base font-semibold text-zinc-900">
          ${{ service.price.toLocaleString('es-MX') }}
        </p>
        <p class="text-xs text-zinc-400">
          {{ service.priceType === 'fixed' ? 'precio fijo' : 'por hora' }}
        </p>
      </div>
    </div>

    <p class="text-sm text-zinc-600 leading-relaxed line-clamp-3">{{ service.description }}</p>

    <div class="flex items-center gap-1.5">
      <i class="pi pi-map-marker text-zinc-400 text-xs" />
      <span class="text-xs text-zinc-500 capitalize">{{ service.area }}</span>
    </div>

    <button
      v-if="!isOwnService"
      class="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium bg-[#1dbf73] text-white rounded-sm hover:bg-[#19a863] transition-colors cursor-pointer"
      @click="emit('book', service)"
    >
      <i class="pi pi-calendar text-sm" />
      Reservar
    </button>
    <p v-else class="text-xs text-zinc-400 text-center">Este es tu servicio</p>
  </div>
</template>
