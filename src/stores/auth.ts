import { ref, computed } from 'vue'
import {
  AuthErrorCodes,
  getAdditionalUserInfo,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import type { FirebaseError } from 'firebase/app'
import { auth, db } from '@/firebase'
import { doc, getDoc, serverTimestamp, writeBatch } from 'firebase/firestore'
import { defineStore } from 'pinia'
import type { AuthAction, AuthStep } from '@/types'

export const useAuth = defineStore('auth', () => {
  const step = ref<AuthStep>({ stage: 'idle', action: null })
  const errorMessage = ref('')
  const currentUser = ref<User | null>(null)
  const isLoading = ref(true)
  const isSubmitting = ref(false)

  const isJoining = computed(() => step.value.action === 'join')

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const userDoc = await getDoc(doc(db, 'users', user.uid))
      if (!userDoc.exists()) {
        step.value = { stage: 'onboarding', action: null }
      }
    }
    currentUser.value = user
    isLoading.value = false
  })

  function open(action: AuthAction) {
    step.value = { stage: 'selector', action }
    errorMessage.value = ''
  }

  function goToEmail() {
    if (!step.value.action) return
    step.value = { stage: 'email', action: step.value.action }
    errorMessage.value = ''
  }

  function goBackToSelector() {
    if (!step.value.action) return
    step.value = { stage: 'selector', action: step.value.action }
    errorMessage.value = ''
  }

  function close() {
    step.value = { stage: 'idle', action: null }
    errorMessage.value = ''
  }

  async function continueWithGoogle() {
    errorMessage.value = ''
    isSubmitting.value = true
    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider())
      const isNewUser = getAdditionalUserInfo(result)?.isNewUser
      if (isNewUser) {
        step.value = { stage: 'onboarding', action: null }
        return
      } else {
        close()
      }
    } catch (error) {
      const { code } = error as FirebaseError
      const isIgnoredError =
        code === AuthErrorCodes.POPUP_CLOSED_BY_USER ||
        code === AuthErrorCodes.EXPIRED_POPUP_REQUEST
      if (!isIgnoredError) {
        errorMessage.value = getAuthErrorMessage(code)
      }
    } finally {
      isSubmitting.value = false
    }
  }

  async function continueWithEmail(email: string, password: string) {
    errorMessage.value = ''
    isSubmitting.value = true
    try {
      if (step.value.action === 'login') {
        await signInWithEmailAndPassword(auth, email, password)
        close()
      } else {
        await createUserWithEmailAndPassword(auth, email, password)
        step.value = { stage: 'onboarding', action: null }
      }
    } catch (error) {
      errorMessage.value = getAuthErrorMessage((error as FirebaseError).code)
    } finally {
      isSubmitting.value = false
    }
  }

  async function completeOnboarding(username: string) {
    if (!currentUser.value) return
    isSubmitting.value = true
    try {
      if (!validateUsername(username)) {
        errorMessage.value =
          'El nombre de usuario debe tener entre 3 y 20 caracteres y solo puede incluir letras, números y guiones bajos.'
        return
      }

      const usernameDoc = await getDoc(doc(db, 'usernames', username))
      if (usernameDoc.exists()) {
        errorMessage.value = 'Este nombre de usuario ya está en uso.'
        return
      }

      const batch = writeBatch(db)
      batch.set(doc(db, 'users', currentUser.value.uid), {
        username,
        fullname: null,
        role: 'client',
        photoURL: null,
        createdAt: serverTimestamp(),
      })
      batch.set(doc(db, 'usernames', username), {
        uid: currentUser.value.uid,
      })
      await batch.commit()

      close()
    } finally {
      isSubmitting.value = false
    }
  }

  async function logout() {
    try {
      await signOut(auth)
    } catch (error) {
      console.error(error)
    }
  }

  function getAuthErrorMessage(code: string) {
    switch (code) {
      case AuthErrorCodes.INVALID_IDP_RESPONSE:
        return 'Correo o contraseña incorrectos.'
      case AuthErrorCodes.EMAIL_EXISTS:
        return 'Este correo ya está registrado. Intenta iniciar sesión.'
      case AuthErrorCodes.WEAK_PASSWORD:
        return 'La contraseña debe tener al menos 6 caracteres.'
      case AuthErrorCodes.INVALID_EMAIL:
        return 'El formato del correo electrónico no es válido.'
      case AuthErrorCodes.TOO_MANY_ATTEMPTS_TRY_LATER:
        return 'Demasiados intentos fallidos. Intenta de nuevo más tarde.'
      case AuthErrorCodes.POPUP_BLOCKED:
        return 'El navegador bloqueó la ventana emergente. Permite las ventanas emergentes e intenta de nuevo.'
      case AuthErrorCodes.NEED_CONFIRMATION:
        return 'Ya existe una cuenta con este correo usando otro método de inicio de sesión.'
      default:
        return 'Ocurrió un error inesperado. Intenta de nuevo.'
    }
  }

  function validateUsername(username: string) {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/
    return usernameRegex.test(username)
  }

  return {
    step,
    errorMessage,
    currentUser,
    isJoining,
    isLoading,
    isSubmitting,
    open,
    goToEmail,
    goBackToSelector,
    close,
    continueWithGoogle,
    continueWithEmail,
    completeOnboarding,
    logout,
  }
})
