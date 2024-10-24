import type { PlatformInterpreter, BaseInterpreter } from '@/types/interpreter'

// Mock data for testing
const mockPlatformInterpreters: PlatformInterpreter[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    certifications: ['Level III'],
    location: {
      city: 'Orange',
      state: 'CA',
      coordinates: { lat: 33.7879, lng: -117.8531 }
    },
    active: true,
    expirationDate: '2025-12-31',
    source: 'RID',
    isPlatformMember: true,
    rating: 4.9,
    totalRatings: 127,
    platformVerified: true,
    specialties: ['Medical', 'Legal'],
    hourlyRate: 85
  },
  {
    id: '2',
    name: 'Michael Chen',
    certifications: ['Level IV', 'Court'],
    location: {
      city: 'Santa Ana',
      state: 'CA',
      coordinates: { lat: 33.7455, lng: -117.8677 }
    },
    active: true,
    expirationDate: '2024-12-31',
    source: 'RID',
    isPlatformMember: true,
    rating: 4.8,
    totalRatings: 93,
    platformVerified: true,
    specialties: ['Education', 'Medical']
  }
]

const mockDirectoryInterpreters: BaseInterpreter[] = [
  {
    id: '3',
    name: 'David Martinez',
    certifications: ['Level II'],
    location: {
      city: 'Orange',
      state: 'CA',
      coordinates: { lat: 33.7879, lng: -117.8531 }
    },
    active: true,
    expirationDate: '2024-06-30',
    source: 'BEI',
    phone: '(714) 555-0123'
  }
]

// Helper function to calculate distance between two points
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371 // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c // Distance in km
}

export async function findInterpreters({ 
  eventType,
  date,
  time,
  duration,
  location
}: {
  eventType: string
  date: Date
  time: string
  duration: string
  location: { lat: number; lng: number }
}) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))

  // Filter interpreters within 50km radius
  const MAX_DISTANCE = 50 // km

  const filteredPlatform = mockPlatformInterpreters.filter(interpreter => {
    if (!interpreter.location.coordinates) return false
    const distance = calculateDistance(
      location.lat,
      location.lng,
      interpreter.location.coordinates.lat,
      interpreter.location.coordinates.lng
    )
    return distance <= MAX_DISTANCE
  })

  const filteredDirectory = mockDirectoryInterpreters.filter(interpreter => {
    if (!interpreter.location.coordinates) return false
    const distance = calculateDistance(
      location.lat,
      location.lng,
      interpreter.location.coordinates.lat,
      interpreter.location.coordinates.lng
    )
    return distance <= MAX_DISTANCE
  })

  return {
    platformInterpreters: filteredPlatform,
    directoryInterpreters: filteredDirectory
  }
}
