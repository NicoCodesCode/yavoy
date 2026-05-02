import { ref } from 'vue'
import { AuthErrorCodes, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import type { FirebaseError } from 'firebase/app'
import { auth } from '@/firebase'
import { AuthAction } from '@/types'
import getErrorMessage from '@/utils/getErrorMessage'

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

  return {
    step,
    errorMessage,
    open,
    goToEmail,
    goBackToSelector,
    close,
    continueWithGoogle,
    continueWithEmail,
  }
}
