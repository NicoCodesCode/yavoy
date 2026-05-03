import { ref } from 'vue'
import { AuthErrorCodes, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import type { FirebaseError } from 'firebase/app'
import { auth } from '@/firebase'
import { AuthAction } from '@/types'

export type AuthStage = 'idle' | 'selector' | 'email'

export type AuthStep = {
  stage: AuthStage
  action: AuthAction | null
}

export function useAuthDialog() {
  const step = ref<AuthStep>({ stage: 'idle', action: null })
  const errorMessage = ref('')

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
      await signInWithPopup(auth, new GoogleAuthProvider())
      close()
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
      if (step.value.action === AuthAction.LOGIN) {
        await signInWithEmailAndPassword(auth, email, password)
      } else {
        await createUserWithEmailAndPassword(auth, email, password)
      }
      close()
    } catch (error) {
      errorMessage.value = getErrorMessage((error as FirebaseError).code)
    }
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
    open,
    goToEmail,
    goBackToSelector,
    close,
    continueWithGoogle,
    continueWithEmail,
    logout,
  }
}
