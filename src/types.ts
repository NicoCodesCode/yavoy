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

export type ApplicationStatus = 'pending' | 'approved' | 'rejected'

export type ServiceCategory =
  | 'plomeria'
  | 'electricidad'
  | 'carpinteria'
  | 'pintura'
  | 'albanileria'
  | 'tecnologia'
  | 'limpieza'
  | 'cerrajeria'
  | 'reparaciones_generales'
  | 'otro'

export type ProviderApplication = {
  fullName: string
  phone: string
  bio: string
  area: string
  categories: string[]
  photoURL: string | null
  certificates: string[]
  status: ApplicationStatus
  submittedAt: unknown
  rejectedAt: unknown | null
}
