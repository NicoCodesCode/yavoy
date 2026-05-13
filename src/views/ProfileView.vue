<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '@/stores/auth'
import { useProfile } from '@/stores/profile'
import { useApplication } from '@/stores/application'
import { useRequireAuth } from '@/composables/useRequireAuth'
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore'
import { db } from '@/firebase'
import UserAvatar from '@/components/UserAvatar.vue'
import SubmitButton from '@/components/buttons/SubmitButton.vue'
import TextInput from '@/components/TextInput.vue'
import ErrorMessage from '@/components/ErrorMessage.vue'
import TextButton from '@/components/buttons/TextButton.vue'
import PublicServiceCard from '@/components/services/PublicServiceCard.vue'
import type { Service, UserProfile } from '@/types'

useRequireAuth()

const authStore = useAuth()
const profileStore = useProfile()
const appStore = useApplication()
const router = useRouter()
const route = useRoute()

const routeUsername = computed(() => route.params.username as string)
const isOwnProfile = computed(() => routeUsername.value === profileStore.userProfile?.username)

const publicProfile = ref<UserProfile | null>(null)
const publicServices = ref<Service[]>([])
const isLoadingPublic = ref(false)
const publicNotFound = ref(false)

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

onMounted(async () => {
  if (isOwnProfile.value) {
    await appStore.fetchExistingApplication()
  } else {
    await loadPublicProfile()
  }
})

async function loadPublicProfile() {
  isLoadingPublic.value = true
  try {
    const usersSnap = await getDocs(
      query(collection(db, 'users'), where('username', '==', routeUsername.value)),
    )

    const userDoc = usersSnap.docs[0]

    if (!userDoc) {
      publicNotFound.value = true
      return
    }

    publicProfile.value = userDoc.data() as UserProfile

    if (publicProfile.value.role === 'provider') {
      const servicesSnap = await getDocs(
        query(
          collection(db, 'services'),
          where('providerId', '==', userDoc.id),
          where('isActive', '==', true),
          orderBy('createdAt', 'desc'),
        ),
      )
      publicServices.value = servicesSnap.docs.map((d) => ({
        ...(d.data() as Omit<Service, 'id'>),
        id: d.id,
      }))
    }
  } finally {
    isLoadingPublic.value = false
  }
}

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
    <div v-if="!isOwnProfile && isLoadingPublic" class="flex items-center justify-center py-20">
      <div class="w-5 h-5 border-2 border-zinc-100 border-t-[#1dbf73] rounded-full animate-spin" />
    </div>

    <div
      v-else-if="!isOwnProfile && publicNotFound"
      class="flex flex-col items-center justify-center py-20 gap-3"
    >
      <i class="pi pi-user text-zinc-200 text-5xl" />
      <p class="text-sm text-zinc-400">Este perfil no existe.</p>
    </div>

    <template v-else-if="!isOwnProfile && publicProfile">
      <div class="flex items-center gap-5 mb-10">
        <div
          class="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white shrink-0 overflow-hidden"
          :style="{ backgroundColor: '#1dbf73' }"
        >
          <img
            v-if="publicProfile.photoURL"
            :src="publicProfile.photoURL"
            :alt="publicProfile.username"
            class="w-full h-full object-cover"
          />
          <span v-else>{{ publicProfile.username.charAt(0).toUpperCase() }}</span>
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h2 class="text-2xl font-semibold text-zinc-900">{{ publicProfile.fullName }}</h2>
            <span
              v-if="publicProfile.role === 'provider'"
              class="text-xs px-2 py-0.5 bg-[#1dbf73]/10 text-[#1dbf73] rounded-full font-medium border border-[#1dbf73]/20"
            >
              Prestador verificado
            </span>
          </div>
          <p class="text-sm text-zinc-500 mt-0.5">@{{ publicProfile.username }}</p>
        </div>
      </div>

      <template v-if="publicProfile.role === 'provider'">
        <h3 class="text-sm font-medium text-zinc-500 uppercase tracking-wide mb-4">Servicios</h3>
        <div v-if="publicServices.length === 0" class="py-10 text-center">
          <p class="text-sm text-zinc-400">Este prestador no tiene servicios activos.</p>
        </div>
        <div v-else class="flex flex-col gap-4">
          <PublicServiceCard v-for="service in publicServices" :key="service.id" :service />
        </div>
      </template>
    </template>

    <template v-else-if="isOwnProfile">
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
            <span v-if="profileStore.userProfile?.fullName">{{
              profileStore.userProfile.fullName
            }}</span>
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
            <p
              v-if="appStore.existingApplication.status === 'pending'"
              class="text-xs text-zinc-400"
            >
              Tu solicitud está siendo revisada. Te notificaremos pronto.
            </p>
            <p
              v-else-if="appStore.existingApplication.status === 'rejected'"
              class="text-xs text-zinc-400"
            >
              Tu solicitud fue rechazada. Puedes volver a aplicar más adelante.
            </p>
          </div>
          <div v-else class="flex flex-col gap-2">
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
    </template>
  </main>
</template>
