export type AuthStage = 'idle' | 'selector' | 'email' | 'onboarding'

export type AuthAction = 'join' | 'login'

export type AuthStep = {
  stage: AuthStage
  action: AuthAction | null
}

export type UserRole = 'client' | 'provider'
