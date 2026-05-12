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
  uid: string
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
  rejectionReason: string | null
}

export type PriceType = 'fixed' | 'hourly'

export type Service = {
  id: string
  providerId: string
  title: string
  description: string
  price: number
  priceType: PriceType
  category: ServiceCategory
  area: string
  isActive: boolean
  createdAt: unknown
}

export type BookingStatus = 'pending' | 'accepted' | 'rejected'

export type Booking = {
  id: string
  serviceId: string
  providerId: string
  clientId: string
  clientName: string
  serviceName: string
  date: unknown
  description: string
  status: BookingStatus
  providerMessage: string | null
  createdAt: unknown
}
