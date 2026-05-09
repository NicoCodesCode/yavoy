<script setup lang="ts">
import { useApplication } from '@/stores/application'

const appStore = useApplication()

const categoryLabels: Record<string, string> = {
  plomeria: 'Plomería',
  electricidad: 'Electricidad',
  carpinteria: 'Carpintería',
  pintura: 'Pintura',
  albanileria: 'Albañilería',
  tecnologia: 'Tecnología',
  limpieza: 'Limpieza',
  cerrajeria: 'Cerrajería',
  reparaciones_generales: 'Reparaciones generales',
}

function getCategoryLabel(value: string) {
  if (value === 'otro') return appStore.otherCategoryText.trim() || 'Otro'
  return categoryLabels[value] ?? value
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <div>
      <h2 class="text-xl font-semibold text-zinc-900">Revisa tu solicitud</h2>
      <p class="text-sm text-zinc-400 mt-1">Verifica que todo esté correcto antes de enviar.</p>
    </div>

    <div class="flex flex-col gap-4">
      <div class="border border-zinc-100 rounded-sm p-4 flex flex-col gap-3">
        <p class="text-xs font-medium text-zinc-500 uppercase tracking-wide">
          Información personal
        </p>
        <div class="flex items-center gap-4">
          <div v-if="appStore.photoPreview" class="w-12 h-12 rounded-full overflow-hidden shrink-0">
            <img
              :src="appStore.photoPreview"
              alt="Foto de perfil"
              class="w-full h-full object-cover"
            />
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-sm text-zinc-900 font-medium">{{ appStore.formData.fullName }}</span>
            <span class="text-sm text-zinc-500">{{ appStore.formData.phone }}</span>
          </div>
        </div>
      </div>

      <div class="border border-zinc-100 rounded-sm p-4 flex flex-col gap-3">
        <p class="text-xs font-medium text-zinc-500 uppercase tracking-wide">Categorías</p>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="cat in appStore.formData.categories"
            :key="cat"
            class="px-2.5 py-1 bg-[#1dbf73]/10 text-zinc-700 text-xs font-medium rounded-full border border-[#1dbf73]/30"
          >
            {{ getCategoryLabel(cat) }}
          </span>
        </div>
      </div>

      <!-- Service info -->
      <div class="border border-zinc-100 rounded-sm p-4 flex flex-col gap-3">
        <p class="text-xs font-medium text-zinc-500 uppercase tracking-wide">Sobre ti</p>
        <p class="text-sm text-zinc-900 leading-relaxed">{{ appStore.formData.bio }}</p>
        <div class="flex items-center gap-2">
          <i class="pi pi-map-marker text-zinc-400 text-sm" />
          <span class="text-sm text-zinc-500">{{ appStore.formData.area }}</span>
        </div>
      </div>

      <div
        v-if="appStore.certificatePreviews.length"
        class="border border-zinc-100 rounded-sm p-4 flex flex-col gap-3"
      >
        <p class="text-xs font-medium text-zinc-500 uppercase tracking-wide">Certificados</p>
        <div class="flex flex-col gap-1.5">
          <div
            v-for="(cert, index) in appStore.certificatePreviews"
            :key="index"
            class="flex items-center gap-2"
          >
            <i class="pi pi-file text-zinc-400 text-sm" />
            <span class="text-sm text-zinc-700 truncate">{{ cert.name }}</span>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="appStore.errorMessage"
      class="flex items-center gap-2 px-3 py-2.5 bg-red-50 border border-red-200 rounded-sm"
    >
      <i class="pi pi-exclamation-circle text-red-400 text-sm" />
      <span class="text-sm text-red-600">{{ appStore.errorMessage }}</span>
    </div>
  </div>
</template>
