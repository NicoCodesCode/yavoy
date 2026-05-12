<script setup lang="ts">
import { ref } from 'vue'
import { useServices } from '@/stores/services'
import type { Service } from '@/types'
import { getCategoryLabel } from '@/utils/categories'

const props = defineProps<{ service: Service }>()
const emit = defineEmits<{ edit: [service: Service] }>()

const servicesStore = useServices()
const isDeleting = ref(false)
const isTogglingActive = ref(false)

async function handleToggleActive() {
  isTogglingActive.value = true
  await servicesStore.toggleServiceActive(props.service.id, !props.service.isActive)
  isTogglingActive.value = false
}

async function handleDelete() {
  if (!confirm('¿Estás seguro de que quieres eliminar este servicio?')) return
  isDeleting.value = true
  await servicesStore.deleteService(props.service.id)
  isDeleting.value = false
}
</script>

<template>
  <div
    class="border rounded-sm p-5 flex flex-col gap-4 transition-colors"
    :class="service.isActive ? 'border-zinc-200' : 'border-zinc-100 bg-zinc-50'"
  >
    <div class="flex items-start justify-between gap-3">
      <div class="flex flex-col gap-1 min-w-0">
        <div class="flex items-center gap-2 flex-wrap">
          <h3 class="text-base font-semibold text-zinc-900 truncate">{{ service.title }}</h3>
          <span
            class="text-xs px-2 py-0.5 rounded-full font-medium"
            :class="
              service.isActive ? 'bg-[#1dbf73]/10 text-[#1dbf73]' : 'bg-zinc-100 text-zinc-400'
            "
          >
            {{ service.isActive ? 'Activo' : 'Pausado' }}
          </span>
        </div>
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

    <div class="flex items-center gap-2 pt-1 border-t border-zinc-100">
      <button
        class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-zinc-200 text-zinc-600 rounded-sm hover:border-zinc-400 transition-colors cursor-pointer"
        @click="emit('edit', service)"
      >
        <i class="pi pi-pencil text-xs" />
        Editar
      </button>
      <button
        class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border rounded-sm transition-colors cursor-pointer"
        :class="
          isTogglingActive
            ? 'opacity-50 cursor-not-allowed'
            : service.isActive
              ? 'border-zinc-200 text-zinc-600 hover:border-zinc-400'
              : 'border-[#1dbf73]/30 text-[#1dbf73] hover:border-[#1dbf73]'
        "
        :disabled="isTogglingActive"
        @click="handleToggleActive"
      >
        <i :class="service.isActive ? 'pi pi-pause' : 'pi pi-play'" class="text-xs" />
        {{ service.isActive ? 'Pausar' : 'Activar' }}
      </button>
      <button
        class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-transparent text-red-400 hover:border-red-200 hover:bg-red-50 rounded-sm transition-colors cursor-pointer ml-auto"
        :class="isDeleting ? 'opacity-50 cursor-not-allowed' : ''"
        :disabled="isDeleting"
        @click="handleDelete"
      >
        <i class="pi pi-trash text-xs" />
        {{ isDeleting ? 'Eliminando...' : 'Eliminar' }}
      </button>
    </div>
  </div>
</template>
