export type CertificationLevel = 'Basic' | 'Advanced' | 'Master' | 'Level I' | 'Level II' | 'Level III' | 'Level IV' | 'Court'

// Base type for all interpreters
export type BaseInterpreter = {
  id: string
  name: string
  phone?: string
  email?: string
  certifications: CertificationLevel[]
  location: {
    city: string
    state: string
    coordinates?: {
      lat: number
      lng: number
    }
  }
  active: boolean
  expirationDate: string
  source: 'BEI' | 'RID' // Track data source
}

// Extended type for platform-registered interpreters
export type PlatformInterpreter = BaseInterpreter & {
  isPlatformMember: true
  rating?: number
  totalRatings?: number
  availability?: {
    days: string[]
    hours: string[]
  }
  specialties?: string[]
  hourlyRate?: number
  profileImage?: string
  bio?: string
  platformVerified: boolean
}

// Combined type
export type Interpreter = BaseInterpreter | PlatformInterpreter

// Type guard to check if interpreter is platform member
export function isPlatformInterpreter(interpreter: Interpreter): interpreter is PlatformInterpreter {
  return 'isPlatformMember' in interpreter && interpreter.isPlatformMember === true
}
