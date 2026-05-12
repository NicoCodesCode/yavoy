<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useServices } from '@/stores/services'
import { useRequireAuth } from '@/composables/useRequireAuth'
import { useProfile } from '@/stores/profile'
import { useRouter } from 'vue-router'
import ServiceCard from '@/components/services/ServiceCard.vue'
import ServiceForm from '@/components/services/ServiceForm.vue'
import type { Service } from '@/types'

useRequireAuth()

const servicesStore = useServices()
const profileStore = useProfile()
const router = useRouter()

const showForm = ref(false)
const editingService = ref<Service | null>(null)

onMounted(async () => {
  if (profileStore.userProfile?.role !== 'provider') {
    router.push({ name: 'home' })
    return
  }
  await servicesStore.fetchProviderServices()
})

function openCreateForm() {
  editingService.value = null
  showForm.value = true
}

function openEditForm(service: Service) {
  editingService.value = service
  showForm.value = true
}

function closeForm() {
  showForm.value = false
  editingService.value = null
  servicesStore.errorMessage = ''
}
</script>

<template>
  <main class="flex-1 max-w-3xl mx-auto w-full px-6 py-12">
    <div class="flex flex-col gap-8">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-xs tracking-widest uppercase text-[#1dbf73] font-medium mb-1">Panel</p>
          <h1 class="text-3xl font-semibold text-zinc-900">Mis servicios</h1>
        </div>
        <button
          v-if="!showForm"
          class="flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-zinc-900 text-white rounded-sm hover:bg-zinc-700 transition-colors cursor-pointer"
          @click="openCreateForm"
        >
          <i class="pi pi-plus text-sm" />
          Nuevo servicio
        </button>
      </div>

      <div v-if="showForm" class="border border-zinc-200 rounded-sm p-6">
        <ServiceForm :editingService @close="closeForm" />
      </div>

      <div v-if="servicesStore.isLoading" class="flex items-center justify-center py-20">
        <div class="flex flex-col items-center gap-4">
          <div
            class="w-5 h-5 border-2 border-zinc-100 border-t-[#1dbf73] rounded-full animate-spin"
          />
          <span class="text-sm text-zinc-400">Cargando servicios...</span>
        </div>
      </div>

      <div
        v-else-if="!showForm && servicesStore.providerServices.length === 0"
        class="flex flex-col items-center justify-center py-20 gap-3"
      >
        <i class="pi pi-box text-zinc-200 text-5xl" />
        <p class="text-sm text-zinc-400">No tienes servicios publicados aún.</p>
      </div>

      <div v-else-if="!showForm" class="flex flex-col gap-4">
        <ServiceCard
          v-for="service in servicesStore.providerServices"
          :key="service.id"
          :service
          @edit="openEditForm"
        />
      </div>
    </div>
  </main>
</template>
