'use client'

import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { reverseGeocode } from '@/lib/location-service'

type MapPreviewProps = {
  latitude: number
  longitude: number
  onLocationUpdate?: (lat: number, lng: number, address: string) => void
  allowAdjustment?: boolean
}

export function MapPreview({ 
  latitude, 
  longitude, 
  onLocationUpdate,
  allowAdjustment = true 
}: MapPreviewProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const marker = useRef<mapboxgl.Marker | null>(null)

  useEffect(() => {
    if (!mapContainer.current) return

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [longitude, latitude],
      zoom: 15,
      interactive: allowAdjustment
    })

    marker.current = new mapboxgl.Marker({
      draggable: allowAdjustment
    })
      .setLngLat([longitude, latitude])
      .addTo(map.current)

    if (allowAdjustment && onLocationUpdate) {
      marker.current.on('dragend', async () => {
        const lngLat = marker.current!.getLngLat()
        const address = await reverseGeocode(lngLat.lat, lngLat.lng)
        if (address) {
          onLocationUpdate(lngLat.lat, lngLat.lng, address.place_name)
        }
      })
    }

    return () => {
      map.current?.remove()
    }
  }, [latitude, longitude, allowAdjustment, onLocationUpdate])

  return (
    <div>
      <div ref={mapContainer} className="h-[200px] rounded-lg" />
      {allowAdjustment && (
        <p className="text-sm text-gray-500 mt-2 text-center">
          Drag the pin to adjust the location
        </p>
      )}
    </div>
  )
}
