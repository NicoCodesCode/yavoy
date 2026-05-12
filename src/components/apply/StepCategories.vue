<script setup lang="ts">
import { useApplication } from '@/stores/application'
import type { ServiceCategory } from '@/types'
import { CATEGORIES } from '@/utils/categories'

const appStore = useApplication()

function isSelected(value: ServiceCategory) {
  return appStore.formData.categories.includes(value)
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <div>
      <h2 class="text-xl font-semibold text-zinc-900">Categorías de servicio</h2>
      <p class="text-sm text-zinc-400 mt-1">
        Selecciona todas las áreas en las que ofreces tus servicios.
      </p>
    </div>

    <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
      <button
        v-for="cat in CATEGORIES"
        :key="cat.value"
        type="button"
        class="flex flex-col items-center justify-center gap-2 p-4 border rounded-sm text-sm font-medium transition-all cursor-pointer"
        :class="
          isSelected(cat.value)
            ? 'border-[#1dbf73] bg-[#1dbf73]/10 text-zinc-900'
            : 'border-zinc-200 text-zinc-500 hover:border-zinc-400 hover:text-zinc-900'
        "
        @click="appStore.toggleCategory(cat.value)"
      >
        <i :class="`pi ${cat.icon} text-xl`" />
        <span>{{ cat.label }}</span>
      </button>
    </div>

    <div v-if="appStore.formData.categories.includes('otro')" class="flex flex-col gap-1.5">
      <label for="otherCategory" class="text-xs font-medium text-zinc-800 tracking-wide uppercase">
        Especifica tu servicio
      </label>
      <div
        class="flex items-center border border-zinc-300 rounded-sm hover:border-zinc-500 focus-within:border-zinc-900 transition-colors"
      >
        <input
          id="otherCategory"
          type="text"
          v-model="appStore.otherCategoryText"
          placeholder="Ej. Instalación de paneles solares"
          class="flex-1 px-3 py-2.5 text-sm text-zinc-800 bg-transparent outline-none"
        />
      </div>
    </div>
  </div>
</template>
