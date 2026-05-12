<script setup lang="ts">
import { onMounted } from 'vue'
import { useAdmin } from '@/stores/admin'
import { useRequireAdmin } from '@/composables/useRequireAdmin'
import ApplicationCard from '@/components/admin/ApplicationCard.vue'

useRequireAdmin()

const adminStore = useAdmin()

onMounted(() => adminStore.fetchPendingApplications())
</script>

<template>
  <main class="flex-1 max-w-3xl mx-auto w-full px-6 py-12">
    <div class="flex flex-col gap-8">
      <div>
        <p class="text-xs tracking-widest uppercase text-[#1dbf73] font-medium mb-1">Admin</p>
        <h1 class="text-3xl font-semibold text-zinc-900">Solicitudes pendientes</h1>
      </div>

      <div v-if="adminStore.isLoading" class="flex items-center justify-center py-20">
        <div class="flex flex-col items-center gap-4">
          <div
            class="w-5 h-5 border-2 border-zinc-100 border-t-[#1dbf73] rounded-full animate-spin"
          />
          <span class="text-sm text-zinc-400">Cargando solicitudes...</span>
        </div>
      </div>

      <div
        v-else-if="adminStore.errorMessage"
        class="flex items-center gap-2 px-3 py-2.5 bg-red-50 border border-red-200 rounded-sm"
      >
        <i class="pi pi-exclamation-circle text-red-400 text-sm" />
        <span class="text-sm text-red-600">{{ adminStore.errorMessage }}</span>
      </div>

      <div
        v-else-if="adminStore.applications.length === 0"
        class="flex flex-col items-center justify-center py-20 gap-3"
      >
        <i class="pi pi-inbox text-zinc-200 text-5xl" />
        <p class="text-sm text-zinc-400">No hay solicitudes pendientes</p>
      </div>

      <div v-else class="flex flex-col gap-6">
        <ApplicationCard
          v-for="application in adminStore.applications"
          :key="application.uid"
          :application
        />
      </div>
    </div>
  </main>
</template>
