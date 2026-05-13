import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/firebase'
import { useAuth } from '@/stores/auth'
import type { ProviderApplication, ServiceCategory } from '@/types'
import { uploadToCloudinary } from '@/utils/uploadToCloudinary'

export type ApplicationStep = 1 | 2 | 3 | 4

export type ApplicationFormData = Omit<
  ProviderApplication,
  'uid' | 'status' | 'submittedAt' | 'rejectedAt' | 'rejectionReason'
>

export function validatePhone(phone: string): boolean {
  const digits = phone.replace(/[\s\-()+]/g, '')
  return /^(52)?\d{10}$/.test(digits)
}

export const useApplication = defineStore('application', () => {
  const authStore = useAuth()

  const currentStep = ref<ApplicationStep>(1)
  const isSubmitting = ref(false)
  const errorMessage = ref('')
  const existingApplication = ref<ProviderApplication | null>(null)
  const isLoadingApplication = ref(false)

  const photoFile = ref<File | null>(null)
  const photoPreview = ref<string | null>(null)
  const certificateFiles = ref<File[]>([])
  const certificatePreviews = ref<{ name: string }[]>([])

  const otherCategoryText = ref('')

  const formData = ref<ApplicationFormData>({
    fullName: '',
    phone: '',
    bio: '',
    area: '',
    categories: [],
    photoURL: null,
    certificates: [],
  })

  const totalSteps = 4

  const progressPercent = computed(() =>
    Math.round(((currentStep.value - 1) / (totalSteps - 1)) * 100),
  )

  const canProceedStep1 = computed(
    () => formData.value.fullName.trim().length > 0 && validatePhone(formData.value.phone),
  )

  const canProceedStep2 = computed(() => {
    if (formData.value.categories.length === 0) return false
    if (formData.value.categories.includes('otro')) return otherCategoryText.value.trim().length > 0
    return true
  })

  const canProceedStep3 = computed(
    () => formData.value.bio.trim().length > 0 && formData.value.area.trim().length > 0,
  )

  const canProceed = computed(() => {
    if (currentStep.value === 1) return canProceedStep1.value
    if (currentStep.value === 2) return canProceedStep2.value
    if (currentStep.value === 3) return canProceedStep3.value
    return true
  })

  function initFormData(fullName: string | null) {
    formData.value.fullName = fullName ?? ''
  }

  function toggleCategory(category: ServiceCategory) {
    const index = formData.value.categories.indexOf(category)
    if (index === -1) {
      formData.value.categories.push(category)
    } else {
      formData.value.categories.splice(index, 1)
      if (category === 'otro') otherCategoryText.value = ''
    }
  }

  function nextStep() {
    if (currentStep.value < totalSteps && canProceed.value) {
      currentStep.value = (currentStep.value + 1) as ApplicationStep
      errorMessage.value = ''
    }
  }

  function prevStep() {
    if (currentStep.value > 1) {
      currentStep.value = (currentStep.value - 1) as ApplicationStep
      errorMessage.value = ''
    }
  }

  async function fetchExistingApplication() {
    if (!authStore.currentUser) return
    isLoadingApplication.value = true
    const appDoc = await getDoc(doc(db, 'providerApplications', authStore.currentUser.uid))
    if (appDoc.exists()) {
      existingApplication.value = {
        ...(appDoc.data() as Omit<ProviderApplication, 'uid'>),
        uid: authStore.currentUser!.uid,
      }
    }
    isLoadingApplication.value = false
  }

  async function submitApplication() {
    if (!authStore.currentUser) return
    isSubmitting.value = true
    errorMessage.value = ''
    try {
      let photoURL: string | null = null
      if (photoFile.value) {
        photoURL = await uploadToCloudinary(photoFile.value, 'image')
      }

      const certificateURLs: string[] = []
      for (const file of certificateFiles.value) {
        const url = await uploadToCloudinary(file, 'raw')
        certificateURLs.push(url)
      }

      const resolvedCategories = formData.value.categories.map((c) =>
        c === 'otro' ? otherCategoryText.value.trim() : c,
      )

      const data: Omit<ProviderApplication, 'uid'> = {
        fullName: formData.value.fullName.trim(),
        phone: formData.value.phone.trim(),
        bio: formData.value.bio.trim(),
        area: formData.value.area.trim(),
        categories: resolvedCategories,
        photoURL,
        certificates: certificateURLs,
        status: 'pending',
        submittedAt: serverTimestamp(),
        rejectedAt: null,
        rejectionReason: null,
      }

      await setDoc(doc(db, 'providerApplications', authStore.currentUser.uid), data)
      await updateDoc(doc(db, 'users', authStore.currentUser.uid), {
        fullName: formData.value.fullName.trim(),
      })
      existingApplication.value = { ...data, uid: authStore.currentUser.uid }
    } catch {
      errorMessage.value = 'No se pudo enviar tu solicitud. Intenta de nuevo.'
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    currentStep,
    totalSteps,
    formData,
    otherCategoryText,
    photoFile,
    photoPreview,
    certificateFiles,
    certificatePreviews,
    isSubmitting,
    errorMessage,
    existingApplication,
    isLoadingApplication,
    progressPercent,
    canProceed,
    initFormData,
    toggleCategory,
    nextStep,
    prevStep,
    fetchExistingApplication,
    submitApplication,
  }
})
