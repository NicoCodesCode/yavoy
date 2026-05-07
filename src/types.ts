export type AuthStage = 'idle' | 'selector' | 'email' | 'onboarding'

export type AuthAction = 'join' | 'login'

export type AuthStep = {
  stage: AuthStage
  action: AuthAction | null
}

export type UserRole = 'client' | 'provider'

export type UserProfile = {
  username: string
  fullName: string | null
  photoURL: string | null
}
