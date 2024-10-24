declare module '@mapbox/mapbox-sdk/services/geocoding' {
  interface GeocodeQuery {
    query: [number, number] | string
    limit?: number
    types?: string[]
    countries?: string[]
  }

  interface GeocodeResponse {
    body: {
      features: Array<{
        id: string
        type: string
        place_name: string
        geometry: {
          type: string
          coordinates: [number, number]
        }
        properties: Record<string, any>
      }>
    }
  }

  interface GeocodingService {
    forwardGeocode(options: { query: string; limit?: number }): {
      send(): Promise<GeocodeResponse>
    }
    reverseGeocode(options: { query: [number, number]; limit?: number }): {
      send(): Promise<GeocodeResponse>
    }
  }

  export default function GeoCoding(options: { accessToken: string }): GeocodingService
}
