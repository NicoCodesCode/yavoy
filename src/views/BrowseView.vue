<script setup lang="ts">
import { ref } from 'vue'
import { useServices } from '@/stores/services'
import { CATEGORIES } from '@/utils/categories'
import BookingDialog from '@/components/bookings/BookingDialog.vue'
import PublicServiceCard from '@/components/services/PublicServiceCard.vue'
import type { Service, ServiceCategory } from '@/types'

const servicesStore = useServices()

const selectedCategory = ref<ServiceCategory | ''>('')
const areaInput = ref('')
const sortByPrice = ref<'asc' | 'desc' | ''>('')
const isSearching = ref(false)

const bookingDialogVisible = ref(false)
const selectedService = ref<Service | null>(null)

async function search() {
  isSearching.value = true
  await servicesStore.fetchBrowseServices({
    category: selectedCategory.value || undefined,
    area: areaInput.value.trim() || undefined,
    sortByPrice: sortByPrice.value || undefined,
  })
  isSearching.value = false
}

function clearFilters() {
  selectedCategory.value = ''
  areaInput.value = ''
  sortByPrice.value = ''
  search()
}

function clearArea() {
  areaInput.value = ''
  search()
}

function clearCategory() {
  selectedCategory.value = ''
  search()
}

function handleBook(service: Service) {
  selectedService.value = service
  bookingDialogVisible.value = true
}

defineExpose({ search })
</script>

<template>
  <main class="flex-1 max-w-5xl mx-auto w-full px-6 py-12">
    <div class="flex flex-col gap-8">
      <div>
        <p class="text-xs tracking-widest uppercase text-[#1dbf73] font-medium mb-1">YaVoy!</p>
        <h1 class="text-3xl font-semibold text-zinc-900">Explorar servicios</h1>
      </div>

      <div class="flex flex-col sm:flex-row gap-3">
        <select
          v-model="selectedCategory"
          class="flex-1 px-3 py-2.5 text-sm text-zinc-800 border border-zinc-300 rounded-sm hover:border-zinc-500 focus:border-zinc-900 focus:outline-none transition-colors bg-white cursor-pointer"
          @change="search"
        >
          <option value="">Todas las categorías</option>
          <option
            v-for="cat in CATEGORIES.filter((c) => c.value !== 'otro')"
            :key="cat.value"
            :value="cat.value"
          >
            {{ cat.label }}
          </option>
        </select>

        <div
          class="flex-1 flex items-center border border-zinc-300 rounded-sm hover:border-zinc-500 focus-within:border-zinc-900 transition-colors"
        >
          <i class="pi pi-map-marker text-zinc-300 text-sm ml-3" />
          <input
            v-model="areaInput"
            type="text"
            placeholder="Zona o ciudad..."
            class="flex-1 px-3 py-2.5 text-sm text-zinc-800 bg-transparent outline-none placeholder:text-zinc-300"
            @keyup.enter="search"
          />
          <button
            v-if="areaInput"
            class="mr-3 text-zinc-300 hover:text-zinc-600 transition-colors cursor-pointer"
            @click="clearArea"
          >
            <i class="pi pi-times text-xs" />
          </button>
        </div>

        <select
          v-model="sortByPrice"
          class="w-44 px-3 py-2.5 text-sm text-zinc-800 border border-zinc-300 rounded-sm hover:border-zinc-500 focus:border-zinc-900 focus:outline-none transition-colors bg-white cursor-pointer"
          @change="search"
        >
          <option value="">Sin ordenar</option>
          <option value="asc">Precio: menor a mayor</option>
          <option value="desc">Precio: mayor a menor</option>
        </select>

        <button
          class="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium bg-zinc-900 text-white rounded-sm hover:bg-zinc-700 transition-colors cursor-pointer"
          :class="isSearching ? 'opacity-50 cursor-not-allowed' : ''"
          :disabled="isSearching"
          @click="search"
        >
          <i v-if="isSearching" class="pi pi-spin pi-spinner text-sm" />
          <i v-else class="pi pi-search text-sm" />
          Buscar
        </button>
      </div>

      <div
        v-if="selectedCategory || areaInput || sortByPrice"
        class="flex items-center gap-2 flex-wrap"
      >
        <span class="text-xs text-zinc-400">Filtros activos:</span>
        <span
          v-if="selectedCategory"
          class="flex items-center gap-1.5 px-2.5 py-1 bg-zinc-100 text-zinc-600 text-xs rounded-full"
        >
          {{ CATEGORIES.find((c) => c.value === selectedCategory)?.label }}
          <button class="cursor-pointer hover:text-zinc-900" @click="clearCategory">
            <i class="pi pi-times text-xs" />
          </button>
        </span>
        <span
          v-if="areaInput"
          class="flex items-center gap-1.5 px-2.5 py-1 bg-zinc-100 text-zinc-600 text-xs rounded-full capitalize"
        >
          {{ areaInput }}
          <button class="cursor-pointer hover:text-zinc-900" @click="clearArea">
            <i class="pi pi-times text-xs" />
          </button>
        </span>
        <button
          class="text-xs text-zinc-400 hover:text-zinc-600 underline cursor-pointer"
          @click="clearFilters"
        >
          Limpiar todo
        </button>
      </div>

      <div v-if="servicesStore.isLoading" class="flex items-center justify-center py-20">
        <div class="flex flex-col items-center gap-4">
          <div
            class="w-5 h-5 border-2 border-zinc-100 border-t-[#1dbf73] rounded-full animate-spin"
          />
          <span class="text-sm text-zinc-400">Buscando servicios...</span>
        </div>
      </div>

      <div
        v-else-if="servicesStore.errorMessage"
        class="flex items-center gap-2 px-3 py-2.5 bg-red-50 border border-red-200 rounded-sm"
      >
        <i class="pi pi-exclamation-circle text-red-400 text-sm" />
        <span class="text-sm text-red-600">{{ servicesStore.errorMessage }}</span>
      </div>

      <div
        v-else-if="servicesStore.browseServices.length === 0"
        class="flex flex-col items-center justify-center py-20 gap-3"
      >
        <i class="pi pi-search text-zinc-200 text-5xl" />
        <p class="text-sm text-zinc-400">No se encontraron servicios con esos filtros.</p>
        <button
          v-if="selectedCategory || areaInput || sortByPrice"
          class="text-xs text-[#1dbf73] hover:underline cursor-pointer"
          @click="clearFilters"
        >
          Limpiar filtros
        </button>
      </div>

      <div v-else>
        <p class="text-xs text-zinc-400 mb-4">
          {{ servicesStore.browseServices.length }} resultado{{
            servicesStore.browseServices.length !== 1 ? 's' : ''
          }}
        </p>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <PublicServiceCard
            v-for="service in servicesStore.browseServices"
            :key="service.id"
            :service
            @book="handleBook"
          />
        </div>
      </div>
    </div>
  </main>

  <BookingDialog v-model:visible="bookingDialogVisible" :service="selectedService" />
</template>
