import GeoCoding from '@mapbox/mapbox-sdk/services/geocoding'
import { point, circle, distance, Feature, Point } from '@turf/turf'

const geocodingClient = GeoCoding({ 
  accessToken: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN! 
})

export interface Location {
  lat: number
  lng: number
}

export interface GeocodedFeature {
  id: string
  place_name: string
  geometry: {
    type: string
    coordinates: [number, number] // Explicitly type as tuple
  }
}

export interface LocationWithRadius extends Location {
  radius: number // in miles
}

export async function getCurrentLocation(): Promise<Location> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      },
      (error) => {
        reject(error)
      }
    )
  })
}

export async function reverseGeocode(lat: number, lng: number): Promise<GeocodedFeature | null> {
  try {
    const response = await geocodingClient
      .reverseGeocode({
        query: [lng, lat],
        limit: 1
      })
      .send()
    
    const feature = response.body.features[0]
    if (!feature) return null

    // Ensure coordinates are properly typed
    return {
      id: feature.id,
      place_name: feature.place_name,
      geometry: {
        type: feature.geometry.type,
        coordinates: feature.geometry.coordinates as [number, number]
      }
    }
  } catch (error) {
    console.error('Error reverse geocoding:', error)
    throw error
  }
}

export async function searchAddress(query: string): Promise<GeocodedFeature[]> {
  try {
    const response = await geocodingClient
      .forwardGeocode({
        query,
        limit: 5
      })
      .send()
    
    // Transform response to match our types
    return response.body.features.map(feature => ({
      id: feature.id,
      place_name: feature.place_name,
      geometry: {
        type: feature.geometry.type,
        coordinates: feature.geometry.coordinates as [number, number]
      }
    }))
  } catch (error) {
    console.error('Error searching address:', error)
    throw error
  }
}

export function calculateDistance(
  point1: Location,
  point2: Location
): number {
  const from: Feature<Point> = point([point1.lng, point1.lat])
  const to: Feature<Point> = point([point2.lng, point2.lat])
  return distance(from, to, { units: 'miles' })
}

export function getLocationsInRadius(
  center: Location,
  radius: number,
  locations: Location[]
): Location[] {
  const centerPoint: Feature<Point> = point([center.lng, center.lat])
  const searchArea = circle(centerPoint, radius, { units: 'miles' })
  
  return locations.filter(loc => {
    const locPoint = point([loc.lng, loc.lat])
    return distance(centerPoint, locPoint, { units: 'miles' }) <= radius
  })
}
