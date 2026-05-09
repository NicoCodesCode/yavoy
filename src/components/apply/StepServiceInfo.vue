<script setup lang="ts">
import { useApplication } from '@/stores/application'
import TextInput from '@/components/TextInput.vue'
import { ref } from 'vue'

const appStore = useApplication()

const ACCEPTED_CERT_TYPES = ['image/jpeg', 'image/png', 'application/pdf']
const MAX_CERT_SIZE_MB = 10
const MAX_CERTS = 5

const certError = ref('')

function handleCertificatesChange(e: Event) {
  const files = Array.from((e.target as HTMLInputElement).files ?? [])
  if (!files.length) return

  certError.value = ''

  const remaining = MAX_CERTS - appStore.certificateFiles.length
  if (remaining <= 0) {
    certError.value = `Puedes subir un máximo de ${MAX_CERTS} certificados.`
    return
  }

  const toAdd = files.slice(0, remaining)

  for (const file of toAdd) {
    if (!ACCEPTED_CERT_TYPES.includes(file.type)) {
      certError.value = 'Solo se aceptan archivos JPG, PNG o PDF.'
      return
    }
    if (file.size > MAX_CERT_SIZE_MB * 1024 * 1024) {
      certError.value = `Cada archivo no debe superar ${MAX_CERT_SIZE_MB}MB.`
      return
    }
    appStore.certificateFiles.push(file)
    appStore.certificatePreviews.push({ name: file.name })
  }
}

function removeCertificate(index: number) {
  appStore.certificateFiles.splice(index, 1)
  appStore.certificatePreviews.splice(index, 1)
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <div>
      <h2 class="text-xl font-semibold text-zinc-900">Sobre ti y tu trabajo</h2>
      <p class="text-sm text-zinc-400 mt-1">
        Cuéntales a los clientes quién eres y dónde trabajas.
      </p>
    </div>

    <div class="flex flex-col gap-1.5">
      <label for="bio" class="text-xs font-medium text-zinc-800 tracking-wide uppercase">
        Descripción
      </label>
      <textarea
        id="bio"
        v-model="appStore.formData.bio"
        placeholder="Describe tu experiencia, especialidades y lo que te diferencia..."
        rows="5"
        maxlength="500"
        class="w-full px-3 py-2.5 text-sm text-zinc-800 border border-zinc-300 rounded-sm hover:border-zinc-500 focus:border-zinc-900 focus:outline-none transition-colors resize-none"
      />
      <span class="text-xs text-zinc-400 text-right">
        {{ appStore.formData.bio.length }} / 500
      </span>
    </div>

    <div class="flex flex-col gap-1">
      <TextInput
        id="area"
        label="Zona de servicio"
        inputType="text"
        v-model="appStore.formData.area"
      />
      <p class="text-xs text-zinc-400">Ej. Reynosa, Río Bravo, Matamoros</p>
    </div>

    <div class="flex flex-col gap-2">
      <label class="text-xs font-medium text-zinc-800 tracking-wide uppercase">
        Certificados <span class="text-zinc-400 normal-case font-normal">(opcional)</span>
      </label>
      <p class="text-xs text-zinc-400">
        Sube diplomas, licencias o cualquier documento que acredite tu experiencia. Máx.
        {{ MAX_CERTS }} archivos.
      </p>

      <div v-if="appStore.certificateFiles.length" class="flex flex-col gap-2">
        <div
          v-for="(cert, index) in appStore.certificatePreviews"
          :key="index"
          class="flex items-center justify-between px-3 py-2.5 border border-zinc-200 rounded-sm"
        >
          <div class="flex items-center gap-2 min-w-0">
            <i class="pi pi-file text-zinc-400 text-sm shrink-0" />
            <span class="text-sm text-zinc-700 truncate">{{ cert.name }}</span>
          </div>
          <button
            type="button"
            class="text-zinc-400 hover:text-red-500 transition-colors cursor-pointer shrink-0 ml-3"
            @click="removeCertificate(index)"
          >
            <i class="pi pi-times text-sm" />
          </button>
        </div>
      </div>

      <label
        v-if="appStore.certificateFiles.length < MAX_CERTS"
        class="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-zinc-300 rounded-sm text-zinc-700 hover:border-zinc-500 hover:bg-zinc-50 transition-all cursor-pointer w-fit"
      >
        <i class="pi pi-plus text-sm" />
        Agregar certificado
        <input
          type="file"
          accept="image/jpeg,image/png,application/pdf"
          multiple
          class="hidden"
          @change="handleCertificatesChange"
        />
      </label>

      <div
        v-if="certError"
        class="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-sm"
      >
        <i class="pi pi-exclamation-circle text-red-400 text-sm" />
        <span class="text-sm text-red-600">{{ certError }}</span>
      </div>
    </div>
  </div>
</template>
