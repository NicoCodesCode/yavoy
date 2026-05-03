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
  completeOnboarding: [name: string]
}>()

const name = ref('')
const isSubmitting = ref(false)

const isButtonDisabled = computed(() => !name.value.trim() || isSubmitting.value)

watch(
  () => props.visible,
  (isVisible) => {
    if (!isVisible) {
      name.value = ''
      isSubmitting.value = false
    }
  },
)

async function handleSubmit() {
  if (isButtonDisabled.value) return
  isSubmitting.value = true
  emit('completeOnboarding', name.value.trim())
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
      <!-- Header -->
      <div>
        <p class="text-xs tracking-widest text-[#1dbf73] font-medium mb-0.5">YaVoy!</p>
        <h2 class="text-xl font-semibold text-zinc-800 leading-snug">Una última cosa</h2>
        <p class="text-sm text-zinc-500 mt-1">¿Cómo te llamas?</p>
      </div>

      <!-- Form -->
      <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
        <div class="flex flex-col gap-1.5">
          <label for="name" class="text-xs font-medium text-zinc-800 tracking-wide uppercase">
            Nombre completo
          </label>
          <div
            class="flex items-center border border-zinc-300 rounded-sm hover:border-zinc-500 focus-within:border-zinc-900 transition-colors"
          >
            <input
              id="name"
              v-model="name"
              type="text"
              autocomplete="name"
              class="flex-1 px-3 py-2.5 text-sm text-zinc-800 bg-transparent outline-none"
            />
          </div>
        </div>

        <!-- Error -->
        <DialogError :errorMessage />

        <SubmitButton :isButtonDisabled :isSubmitting />
      </form>
    </div>
  </Dialog>
</template>
