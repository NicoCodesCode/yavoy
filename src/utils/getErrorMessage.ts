import { AuthErrorCodes } from 'firebase/auth'

export default function getErrorMessage(code: string): string {
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
