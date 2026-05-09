<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAuth } from '@/stores/auth'
import { useProfile } from '@/stores/profile'
import { useRequireAuth } from '@/composables/useRequireAuth'
import UserAvatar from '@/components/UserAvatar.vue'
import SubmitButton from '@/components/buttons/SubmitButton.vue'
import TextInput from '@/components/TextInput.vue'
import ErrorMessage from '@/components/ErrorMessage.vue'
import TextButton from '@/components/buttons/TextButton.vue'

useRequireAuth()

const authStore = useAuth()
const profileStore = useProfile()

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
    </div>
  </main>
</template>
