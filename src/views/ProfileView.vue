<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/stores/auth'
import { useProfile } from '@/stores/profile'
import { useApplication } from '@/stores/application'
import { useRequireAuth } from '@/composables/useRequireAuth'
import UserAvatar from '@/components/UserAvatar.vue'
import SubmitButton from '@/components/buttons/SubmitButton.vue'
import TextInput from '@/components/TextInput.vue'
import ErrorMessage from '@/components/ErrorMessage.vue'
import TextButton from '@/components/buttons/TextButton.vue'

useRequireAuth()

const authStore = useAuth()
const profileStore = useProfile()
const appStore = useApplication()
const router = useRouter()

const isEditing = ref(false)
const fullNameInput = ref('')
const isSaving = ref(false)
const saveError = ref('')

const isSaveButtonDisabled = computed(
  () =>
    !fullNameInput.value.trim() ||
    fullNameInput.value.trim() === profileStore.userProfile?.fullName ||
    isSaving.value,
)

const applicationStatusLabel = computed(() => {
  switch (appStore.existingApplication?.status) {
    case 'pending':
      return 'Solicitud en revisión'
    case 'approved':
      return 'Prestador verificado'
    case 'rejected':
      return 'Solicitud rechazada'
    default:
      return null
  }
})

const applicationStatusStyle = computed(() => {
  switch (appStore.existingApplication?.status) {
    case 'pending':
      return 'bg-yellow-50 text-yellow-700 border-yellow-200'
    case 'approved':
      return 'bg-green-50 text-[#1dbf73] border-green-200'
    case 'rejected':
      return 'bg-red-50 text-red-600 border-red-200'
    default:
      return ''
  }
})

const applicationStatusIcon = computed(() => {
  switch (appStore.existingApplication?.status) {
    case 'pending':
      return 'pi-clock'
    case 'approved':
      return 'pi-verified'
    case 'rejected':
      return 'pi-times-circle'
    default:
      return ''
  }
})

onMounted(() => appStore.fetchExistingApplication())

function startEditing() {
  fullNameInput.value = profileStore.userProfile?.fullName ?? ''
  isEditing.value = true
  saveError.value = ''
}

function cancelEditing() {
  isEditing.value = false
  saveError.value = ''
}

async function saveProfile() {
  if (!authStore.currentUser) return
  isSaving.value = true
  saveError.value = ''
  try {
    await profileStore.updateProfile(
      { fullName: fullNameInput.value.trim() || null },
      authStore.currentUser.uid,
    )
    isEditing.value = false
  } catch {
    saveError.value = 'No se pudo guardar. Intenta de nuevo.'
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <main class="flex-1 max-w-2xl mx-auto w-full px-6 py-12">
    <div class="flex items-center gap-5 mb-10">
      <UserAvatar class="w-16 h-16 text-2xl! shrink-0" />
      <div>
        <h2 class="text-2xl font-semibold text-zinc-900">
          @{{ profileStore.userProfile?.username }}
        </h2>
        <p class="text-sm text-zinc-400">{{ authStore.currentUser?.email }}</p>
      </div>
    </div>

    <div class="flex flex-col gap-6">
      <div class="border-b border-zinc-100 pb-6">
        <div class="flex items-center justify-between mb-2">
          <label class="text-xs font-medium text-zinc-500 tracking-wide uppercase">
            Nombre completo
          </label>
          <button
            v-if="!isEditing"
            class="text-xs text-[#1dbf73] font-medium hover:underline cursor-pointer"
            @click="startEditing"
          >
            Editar
          </button>
        </div>

        <div v-if="isEditing" class="flex flex-col gap-3" @keyup.enter="saveProfile">
          <TextInput v-model="fullNameInput" inputType="text" id="fullname" />
          <ErrorMessage :errorMessage="saveError" />
          <div class="flex gap-2">
            <SubmitButton
              class="w-min"
              :isButtonDisabled="isSaveButtonDisabled"
              :isSubmitting="isSaving"
              @click="saveProfile"
            >
              <span>Guardar</span>
            </SubmitButton>
            <TextButton @click="cancelEditing">Cancelar</TextButton>
          </div>
        </div>

        <p v-else class="text-sm text-zinc-900">
          <span v-if="profileStore.userProfile?.fullName">
            {{ profileStore.userProfile.fullName }}
          </span>
          <span v-else class="text-zinc-400 italic">Sin nombre</span>
        </p>
      </div>

      <div class="border-b border-zinc-100 pb-6">
        <label class="text-xs font-medium text-zinc-500 tracking-wide uppercase block mb-2">
          Nombre de usuario
        </label>
        <p class="text-sm text-zinc-900">@{{ profileStore.userProfile?.username }}</p>
      </div>

      <div class="border-b border-zinc-100 pb-6">
        <label class="text-xs font-medium text-zinc-500 tracking-wide uppercase block mb-3">
          Cuenta de prestador
        </label>

        <div v-if="appStore.existingApplication" class="flex flex-col gap-3">
          <div
            class="flex items-center gap-2 px-3 py-2.5 border rounded-sm w-fit"
            :class="applicationStatusStyle"
          >
            <i :class="`pi ${applicationStatusIcon} text-sm`" />
            <span class="text-sm font-medium">{{ applicationStatusLabel }}</span>
          </div>
          <p v-if="appStore.existingApplication.status === 'pending'" class="text-xs text-zinc-400">
            Tu solicitud está siendo revisada. Te notificaremos pronto.
          </p>
          <p
            v-else-if="appStore.existingApplication.status === 'rejected'"
            class="text-xs text-zinc-400"
          >
            Tu solicitud fue rechazada. Puedes volver a aplicar más adelante.
          </p>
        </div>

        <div v-else class="flex flex-col gap-2 items-center">
          <p class="text-sm text-zinc-500">
            ¿Ofreces servicios profesionales? Únete como prestador y empieza a recibir clientes.
          </p>
          <button
            class="w-fit mt-1 flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-zinc-900 text-white rounded-sm hover:bg-zinc-700 transition-colors cursor-pointer"
            @click="router.push({ name: 'apply' })"
          >
            <i class="pi pi-send text-sm" />
            Solicitar ser prestador
          </button>
        </div>
      </div>
    </div>
  </main>
</template>
