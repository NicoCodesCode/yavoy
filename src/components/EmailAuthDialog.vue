<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import Dialog from 'primevue/dialog'
import DialogError from './DialogError.vue'
import SubmitButton from './SubmitButton.vue'

const props = defineProps<{
  visible: boolean
  errorMessage: string
}>()

const emit = defineEmits<{
  goBack: []
  continueWithEmail: [email: string, password: string]
}>()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const isSubmitting = ref(false)

const isButtonDisabled = computed(
  () => !email.value.trim() || !password.value.trim() || isSubmitting.value,
)

watch(
  () => props.visible,
  (isVisible) => {
    if (!isVisible) {
      email.value = ''
      password.value = ''
    }
  },
)

async function handleSubmit() {
  if (isButtonDisabled.value) return
  isSubmitting.value = true
  emit('continueWithEmail', email.value.trim(), password.value.trim())
}
</script>

<template>
  <Dialog
    :visible
    modal
    :showHeader="false"
    :closable="false"
    class="rounded-none! shadow-2xl! bg-zinc-100! border-0! p-0! w-full! max-w-sm!"
  >
    <div class="flex flex-col px-8 pt-8 pb-10 gap-6">
      <!-- Header row -->
      <div class="flex items-start justify-between">
        <div>
          <p class="text-xs tracking-widest text-[#1dbf73] font-medium mb-0.5">YaVoy!</p>
          <h2 class="text-xl font-semibold text-zinc-800 leading-snug">Continuar con correo</h2>
        </div>
        <button
          class="text-zinc-500 hover:text-zinc-700 transition-colors cursor-pointer"
          @click="emit('goBack')"
        >
          <i class="pi pi-arrow-left text-sm" />
        </button>
      </div>

      <!-- Form -->
      <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
        <!-- Email -->
        <div class="flex flex-col gap-1.5">
          <label for="email" class="text-xs font-medium text-zinc-800 tracking-wide uppercase">
            Correo electrónico
          </label>
          <div
            class="flex items-center border border-zinc-300 rounded-sm hover:border-zinc-500 focus-within:border-zinc-900 transition-colors"
          >
            <input
              id="email"
              v-model="email"
              type="email"
              autocomplete="email"
              class="flex-1 px-3 py-2.5 text-sm text-zinc-800 bg-transparent outline-none"
            />
          </div>
        </div>

        <!-- Password -->
        <div class="flex flex-col gap-1.5">
          <label for="password" class="text-xs font-medium text-zinc-800 tracking-wide uppercase">
            Contraseña
          </label>
          <div
            class="flex items-center border border-zinc-300 rounded-sm hover:border-zinc-500 focus-within:border-zinc-900 transition-colors"
          >
            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="current-password"
              class="flex-1 px-3 py-2.5 text-sm text-zinc-800 bg-transparent outline-none"
            />
            <button
              type="button"
              class="mr-3 text-zinc-600 hover:bg-zinc-200 py-1 px-2 rounded-full transition-colors cursor-pointer"
              @click="showPassword = !showPassword"
            >
              <i :class="showPassword ? 'pi pi-eye' : 'pi  pi-eye-slash'" class="text-sm" />
            </button>
          </div>
        </div>

        <!-- Error -->
        <DialogError :errorMessage />

        <!-- Submit -->
        <SubmitButton :isButtonDisabled :isSubmitting />
      </form>
    </div>
  </Dialog>
</template>
