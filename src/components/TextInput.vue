<script setup lang="ts">
import { ref } from 'vue'

defineEmits<{ input: [newValue: string] }>()
defineProps<{
  label?: string
  inputType: 'text' | 'email' | 'password'
  id: string
}>()

const model = defineModel()

const showPassword = ref(false)

function updateValue(e: Event) {
  const target = e.target as HTMLInputElement
  model.value = target.value
}
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label v-if="label" :for="id" class="text-xs font-medium text-zinc-800 tracking-wide uppercase">
      {{ label }}
    </label>
    <div
      class="flex items-center border border-zinc-300 rounded-sm hover:border-zinc-500 focus-within:border-zinc-900 transition-colors"
    >
      <input
        :id
        :type="showPassword ? 'text' : inputType"
        :value="model"
        @input="updateValue"
        :autocomplete="id"
        class="flex-1 px-3 py-2.5 text-sm text-zinc-800 bg-transparent outline-none"
      />
      <button
        v-if="inputType === 'password'"
        type="button"
        class="mr-3 text-zinc-600 hover:bg-zinc-200 py-1 px-2 rounded-full transition-colors cursor-pointer"
        @click="showPassword = !showPassword"
      >
        <i :class="showPassword ? 'pi pi-eye' : 'pi  pi-eye-slash'" class="text-sm" />
      </button>
    </div>
  </div>
</template>
