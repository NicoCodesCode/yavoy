<script setup lang="ts">
import { ref, computed } from 'vue'
import { useServices } from '@/stores/services'
import { useProfile } from '@/stores/profile'
import type { Service, ServiceCategory, PriceType } from '@/types'
import { CATEGORIES } from '@/utils/categories'
import TextInput from '@/components/TextInput.vue'

const props = defineProps<{
  editingService?: Service | null
}>()

const emit = defineEmits<{
  close: []
}>()

const servicesStore = useServices()
const profileStore = useProfile()

const PRICE_TYPES: { value: PriceType; label: string }[] = [
  { value: 'fixed', label: 'Precio fijo' },
  { value: 'hourly', label: 'Por hora' },
]

const title = ref(props.editingService?.title ?? '')
const description = ref(props.editingService?.description ?? '')
const category = ref<ServiceCategory>(props.editingService?.category ?? 'plomeria')
const price = ref<number | ''>(props.editingService?.price ?? '')
const priceType = ref<PriceType>(props.editingService?.priceType ?? 'fixed')
const area = ref(props.editingService?.area ?? '')

const isSubmitting = ref(false)

const isEditing = computed(() => !!props.editingService)

const isDisabled = computed(
  () =>
    !title.value.trim() ||
    !description.value.trim() ||
    !area.value.trim() ||
    !price.value ||
    Number(price.value) <= 0 ||
    isSubmitting.value,
)

async function handleSubmit() {
  if (isDisabled.value) return
  isSubmitting.value = true
  try {
    const data = {
      title: title.value.trim(),
      description: description.value.trim(),
      category: category.value,
      price: Number(price.value),
      priceType: priceType.value,
      area: area.value.trim().toLowerCase(),
    }
    if (isEditing.value && props.editingService) {
      await servicesStore.updateService(props.editingService.id, data)
    } else {
      await servicesStore.createService({
        ...data,
        providerUsername: profileStore.userProfile?.username ?? '',
      })
    }
    emit('close')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <form class="flex flex-col gap-5" @submit.prevent="handleSubmit">
    <h2 class="text-xl font-semibold text-zinc-900">
      {{ isEditing ? 'Editar servicio' : 'Nuevo servicio' }}
    </h2>

    <TextInput id="title" label="Título" inputType="text" v-model="title" />

    <div class="flex flex-col gap-1.5">
      <label for="description" class="text-xs font-medium text-zinc-800 tracking-wide uppercase">
        Descripción
      </label>
      <textarea
        id="description"
        v-model="description"
        rows="4"
        maxlength="1000"
        placeholder="Describe detalladamente el servicio que ofreces..."
        class="w-full px-3 py-2.5 text-sm text-zinc-800 border border-zinc-300 rounded-sm hover:border-zinc-500 focus:border-zinc-900 focus:outline-none transition-colors resize-none"
      />
      <span class="text-xs text-zinc-400 text-right">{{ description.length }} / 1000</span>
    </div>

    <div class="flex flex-col gap-1.5">
      <label for="category" class="text-xs font-medium text-zinc-800 tracking-wide uppercase">
        Categoría
      </label>
      <select
        id="category"
        v-model="category"
        class="px-3 py-2.5 text-sm text-zinc-800 border border-zinc-300 rounded-sm hover:border-zinc-500 focus:border-zinc-900 focus:outline-none transition-colors bg-white cursor-pointer"
      >
        <option v-for="cat in CATEGORIES" :key="cat.value" :value="cat.value">
          {{ cat.label }}
        </option>
      </select>
    </div>

    <div class="flex gap-3">
      <div class="flex flex-col gap-1.5 flex-1">
        <label for="price" class="text-xs font-medium text-zinc-800 tracking-wide uppercase">
          Precio (MXN)
        </label>
        <div
          class="flex items-center border border-zinc-300 rounded-sm hover:border-zinc-500 focus-within:border-zinc-900 transition-colors"
        >
          <span class="pl-3 text-sm text-zinc-400">$</span>
          <input
            id="price"
            v-model="price"
            type="number"
            min="1"
            placeholder="0"
            class="flex-1 px-2 py-2.5 text-sm text-zinc-800 bg-transparent outline-none"
          />
        </div>
      </div>
      <div class="flex flex-col gap-1.5 w-36">
        <label for="priceType" class="text-xs font-medium text-zinc-800 tracking-wide uppercase">
          Tipo
        </label>
        <select
          id="priceType"
          v-model="priceType"
          class="px-3 py-2.5 text-sm text-zinc-800 border border-zinc-300 rounded-sm hover:border-zinc-500 focus:border-zinc-900 focus:outline-none transition-colors bg-white cursor-pointer"
        >
          <option v-for="pt in PRICE_TYPES" :key="pt.value" :value="pt.value">
            {{ pt.label }}
          </option>
        </select>
      </div>
    </div>

    <TextInput id="area" label="Zona de servicio" inputType="text" v-model="area" />

    <div
      v-if="servicesStore.errorMessage"
      class="flex items-center gap-2 px-3 py-2.5 bg-red-50 border border-red-200 rounded-sm"
    >
      <i class="pi pi-exclamation-circle text-red-400 text-sm" />
      <span class="text-sm text-red-600">{{ servicesStore.errorMessage }}</span>
    </div>

    <div class="flex gap-3">
      <button
        type="submit"
        :disabled="isDisabled"
        class="flex-1 px-4 py-2.5 text-sm font-medium rounded-sm transition-colors"
        :class="
          isDisabled
            ? 'bg-zinc-100 text-zinc-300 cursor-not-allowed'
            : 'bg-zinc-900 text-white hover:bg-zinc-700 cursor-pointer'
        "
      >
        <span v-if="isSubmitting" class="flex items-center justify-center gap-2">
          <i class="pi pi-spin pi-spinner text-sm" />
          Guardando...
        </span>
        <span v-else>{{ isEditing ? 'Guardar cambios' : 'Publicar servicio' }}</span>
      </button>
      <button
        type="button"
        class="px-4 py-2.5 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer"
        @click="emit('close')"
      >
        Cancelar
      </button>
    </div>
  </form>
</template>
