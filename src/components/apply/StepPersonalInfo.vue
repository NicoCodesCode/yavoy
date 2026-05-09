<script setup lang="ts">
import { ref, computed } from 'vue'
import { useApplication, validatePhone } from '@/stores/application'
import TextInput from '@/components/TextInput.vue'
import { fileToDataURL } from '@/utils/uploadToCloudinary'

const appStore = useApplication()

const isProcessingPhoto = ref(false)
const photoError = ref('')
const phoneDirty = ref(false)

const ACCEPTED_TYPES = ['image/jpeg', 'image/png']
const MAX_SIZE_MB = 5

const phoneError = computed(() => {
  if (!phoneDirty.value || !appStore.formData.phone) return ''
  return validatePhone(appStore.formData.phone) ? '' : 'Ingresa un número válido (10 dígitos).'
})

async function handlePhotoChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return

  photoError.value = ''

  if (!ACCEPTED_TYPES.includes(file.type)) {
    photoError.value = 'Solo se aceptan imágenes JPG o PNG.'
    return
  }

  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    photoError.value = `La imagen no debe superar ${MAX_SIZE_MB}MB.`
    return
  }

  isProcessingPhoto.value = true
  try {
    appStore.photoFile = file
    appStore.photoPreview = await fileToDataURL(file)
  } catch {
    photoError.value = 'No se pudo procesar la foto. Intenta de nuevo.'
    appStore.photoFile = null
    appStore.photoPreview = null
  } finally {
    isProcessingPhoto.value = false
  }
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <div>
      <h2 class="text-xl font-semibold text-zinc-900">Información personal</h2>
      <p class="text-sm text-zinc-400 mt-1">
        Tus datos de contacto y foto para que los clientes sepan quién eres.
      </p>
    </div>

    <!-- Photo upload -->
    <div class="flex flex-col gap-2">
      <label class="text-xs font-medium text-zinc-800 tracking-wide uppercase">
        Foto de perfil
      </label>
      <div class="flex items-center gap-4">
        <div
          class="w-16 h-16 rounded-full border-2 border-zinc-200 overflow-hidden shrink-0 flex items-center justify-center bg-zinc-100"
        >
          <img
            v-if="appStore.photoPreview"
            :src="appStore.photoPreview"
            alt="Foto de perfil"
            class="w-full h-full object-cover"
          />
          <i v-else class="pi pi-user text-zinc-300 text-2xl" />
        </div>
        <div class="flex flex-col gap-1">
          <label
            class="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-zinc-300 rounded-sm text-zinc-700 hover:border-zinc-500 hover:bg-zinc-50 transition-all cursor-pointer w-fit"
            :class="isProcessingPhoto ? 'opacity-50 cursor-not-allowed' : ''"
          >
            <i v-if="isProcessingPhoto" class="pi pi-spin pi-spinner text-sm" />
            <i v-else class="pi pi-upload text-sm" />
            {{
              isProcessingPhoto
                ? 'Procesando...'
                : appStore.photoPreview
                  ? 'Cambiar foto'
                  : 'Subir foto'
            }}
            <input
              type="file"
              accept="image/jpeg,image/png"
              class="hidden"
              :disabled="isProcessingPhoto"
              @change="handlePhotoChange"
            />
          </label>
          <span class="text-xs text-zinc-400">JPG o PNG · Máx. 5MB</span>
        </div>
      </div>
      <div
        v-if="photoError"
        class="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-sm"
      >
        <i class="pi pi-exclamation-circle text-red-400 text-sm" />
        <span class="text-sm text-red-600">{{ photoError }}</span>
      </div>
    </div>

    <TextInput
      id="fullName"
      label="Nombre completo"
      inputType="text"
      v-model="appStore.formData.fullName"
    />

    <div class="flex flex-col gap-1.5">
      <TextInput
        id="phone"
        label="Número de teléfono"
        inputType="text"
        v-model="appStore.formData.phone"
        @blur="phoneDirty = true"
      />
      <p v-if="phoneError" class="text-xs text-red-500">{{ phoneError }}</p>
      <p v-else class="text-xs text-zinc-400">Ej. 8991234567 o +528991234567</p>
    </div>
  </div>
</template>
