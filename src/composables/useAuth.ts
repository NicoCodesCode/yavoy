import { ref } from 'vue'
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
import { doc, serverTimestamp, setDoc } from 'firebase/firestore'

export type AuthStage = 'idle' | 'selector' | 'email' | 'onboarding'

export type AuthAction = 'join' | 'login'

export type AuthStep = {
  stage: AuthStage
  action: AuthAction | null
}

export type UserRole = 'client' | 'provider'

export function useAuth() {
  const step = ref<AuthStep>({ stage: 'idle', action: null })
  const errorMessage = ref('')
  const currentUser = ref<User | null>(null)
  const isLoading = ref(true)

  onAuthStateChanged(auth, (user) => {
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
    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider())
      const isNewUser = getAdditionalUserInfo(result)?.isNewUser
      if (isNewUser) {
        step.value = { stage: 'onboarding', action: null }
      } else {
        close()
      }
    } catch (error) {
      const { code } = error as FirebaseError
      const isIgnoredError =
        code === AuthErrorCodes.POPUP_CLOSED_BY_USER ||
        code === AuthErrorCodes.EXPIRED_POPUP_REQUEST
      if (!isIgnoredError) {
        errorMessage.value = getErrorMessage(code)
      }
    }
  }

  async function continueWithEmail(email: string, password: string) {
    errorMessage.value = ''
    try {
      if (step.value.action === 'login') {
        await signInWithEmailAndPassword(auth, email, password)
        close()
      } else {
        await createUserWithEmailAndPassword(auth, email, password)
        step.value = { stage: 'onboarding', action: null }
      }
    } catch (error) {
      errorMessage.value = getErrorMessage((error as FirebaseError).code)
    }
  }

  async function completeOnboarding(name: string) {
    const user = auth.currentUser
    if (!user) return
    await setDoc(doc(db, 'users', user.uid), {
      name,
      role: 'client',
      createdAt: serverTimestamp(),
    })
    close()
  }

  async function logout() {
    try {
      await signOut(auth)
    } catch (error) {
      console.error(error)
    }
  }

  function getErrorMessage(code: string) {
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

  return {
    step,
    errorMessage,
    currentUser,
    isLoading,
    open,
    goToEmail,
    goBackToSelector,
    close,
    continueWithGoogle,
    continueWithEmail,
    completeOnboarding,
    logout,
  }
}
