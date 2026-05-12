<script setup lang="ts">
import { ref } from 'vue'
import { useAdmin } from '@/stores/admin'
import type { ProviderApplication } from '@/types'
import { getCategoryLabel } from '@/utils/categories'

const props = defineProps<{ application: ProviderApplication }>()

const adminStore = useAdmin()

const isApproving = ref(false)
const isRejecting = ref(false)
const showRejectForm = ref(false)
const rejectionReason = ref('')

async function handleApprove() {
  isApproving.value = true
  await adminStore.approveApplication(props.application.uid)
  isApproving.value = false
}

async function handleReject() {
  if (!rejectionReason.value.trim()) return
  isRejecting.value = true
  await adminStore.rejectApplication(props.application.uid, rejectionReason.value.trim())
  isRejecting.value = false
}

function cancelReject() {
  showRejectForm.value = false
  rejectionReason.value = ''
}
</script>

<template>
  <div class="border border-zinc-200 rounded-sm p-6 flex flex-col gap-5">
    <div class="flex items-start gap-4">
      <div
        class="w-14 h-14 rounded-full overflow-hidden shrink-0 bg-zinc-100 flex items-center justify-center border border-zinc-200"
      >
        <img
          v-if="application.photoURL"
          :src="application.photoURL"
          :alt="application.fullName"
          class="w-full h-full object-cover"
        />
        <i v-else class="pi pi-user text-zinc-300 text-xl" />
      </div>
      <div class="flex flex-col gap-1 min-w-0">
        <h3 class="text-base font-semibold text-zinc-900">{{ application.fullName }}</h3>
        <p class="text-sm text-zinc-500">{{ application.phone }}</p>
        <div class="flex items-center gap-1.5">
          <i class="pi pi-map-marker text-zinc-400 text-xs" />
          <span class="text-sm text-zinc-500">{{ application.area }}</span>
        </div>
      </div>
    </div>

    <div class="flex flex-wrap gap-2">
      <span
        v-for="cat in application.categories"
        :key="cat"
        class="px-2.5 py-1 bg-zinc-100 text-zinc-600 text-xs font-medium rounded-full"
      >
        {{ getCategoryLabel(cat) }}
      </span>
    </div>

    <p class="text-sm text-zinc-700 leading-relaxed">{{ application.bio }}</p>

    <div v-if="application.certificates.length" class="flex flex-col gap-2">
      <p class="text-xs font-medium text-zinc-500 uppercase tracking-wide">Certificados</p>
      <div class="flex flex-col gap-1.5">
        <a
          v-for="(url, index) in application.certificates"
          :key="index"
          :href="url"
          target="_blank"
          class="flex items-center gap-2 text-sm text-[#1dbf73] hover:underline"
        >
          <i class="pi pi-file text-sm" />
          Certificado {{ index + 1 }}
        </a>
      </div>
    </div>

    <div class="flex flex-col gap-3 pt-2 border-t border-zinc-100">
      <div v-if="!showRejectForm" class="flex gap-3">
        <button
          class="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-sm transition-colors cursor-pointer"
          :class="
            isApproving
              ? 'bg-zinc-100 text-zinc-300 cursor-not-allowed'
              : 'bg-[#1dbf73] white hover:bg-[#19a863]'
          "
          :disabled="isApproving"
          @click="handleApprove"
        >
          <i v-if="isApproving" class="pi pi-spin pi-spinner text-sm" />
          <i v-else class="pi pi-check text-sm" />
          {{ isApproving ? 'Aprobando...' : 'Aprobar' }}
        </button>
        <button
          class="flex items-center gap-2 px-4 py-2.5 text-sm font-medium border border-red-200 text-red-500 rounded-sm hover:bg-red-50 transition-colors cursor-pointer"
          @click="showRejectForm = true"
        >
          <i class="pi pi-times text-sm" />
          Rechazar
        </button>
      </div>

      <div v-else class="flex flex-col gap-3">
        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-medium text-zinc-500 uppercase tracking-wide">
            Motivo de rechazo
          </label>
          <textarea
            v-model="rejectionReason"
            placeholder="Explica por qué se rechaza la solicitud..."
            rows="3"
            class="w-full px-3 py-2.5 text-sm text-zinc-800 border border-zinc-300 rounded-sm focus:border-zinc-900 focus:outline-none transition-colors resize-none"
          />
        </div>
        <div class="flex gap-3">
          <button
            class="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-sm transition-colors cursor-pointer"
            :class="
              isRejecting || !rejectionReason.trim()
                ? 'bg-zinc-100 text-zinc-300 cursor-not-allowed'
                : 'bg-red-500 text-white hover:bg-red-600'
            "
            :disabled="isRejecting || !rejectionReason.trim()"
            @click="handleReject"
          >
            <i v-if="isRejecting" class="pi pi-spin pi-spinner text-sm" />
            <i v-else class="pi pi-times text-sm" />
            {{ isRejecting ? 'Rechazando...' : 'Confirmar rechazo' }}
          </button>
          <button
            class="px-4 py-2.5 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer"
            @click="cancelReject"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
