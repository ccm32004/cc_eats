'use client'

import { useEffect, useRef } from 'react'
import { restaurants } from '@/data/restaurants'
import mapboxgl from 'mapbox-gl'

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!

//PROPS
type Props = {
  filters: {
    selectedTags: string[]
    selectedArea: string | null
    showAll: boolean
  }
}

//haversine function for disance from current location to restaurant
function getDistanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLng = (lng2 - lng1) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export default function Map({ filters }: Props) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)

  useEffect(() => {
    if (map.current || !mapContainer.current) return // only initialize once

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11', // map style
      center: [-79.3832, 43.6532], // default center [lng, lat] — Toronto here
      zoom: 12,
    })

    map.current.on('load', () => {
      const addRestaurantMarkers = (userLat: number, userLng: number) => {
        const markerGroup = new mapboxgl.Marker({}).getElement().parentElement
        if (markerGroup) markerGroup.innerHTML = '' // clear markers manually if needed

        const filtered = restaurants.filter((r) => {
          const within5km = getDistanceKm(userLat, userLng, r.lat, r.lng) < 5

          if (!filters.showAll && !within5km) return false

          if (filters.selectedArea === 'Toronto' && r.lat > 44) return false
          if (filters.selectedArea === 'Ottawa' && r.lat < 44) return false

          if (
            filters.selectedTags.length > 0 &&
            !filters.selectedTags.every((tag) => r.tags.includes(tag))
          ) {
            return false
          }

          return true
        })

        filtered.forEach((restaurant) => {
          const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <div class="text-sm">
              <h3 class="font-bold">${restaurant.name}</h3>
              <p>⭐ ${restaurant.rating} — ${restaurant.tags.join(', ')}</p>
              <p class="mt-1">${restaurant.review}</p>
              <img src="${restaurant.photo}" alt="${restaurant.name}" class="mt-2 w-full rounded-md" style="max-width: 200px;" />
            </div>
          `)

          new mapboxgl.Marker({ color: '#ff4d4f' })
            .setLngLat([restaurant.lng, restaurant.lat])
            .setPopup(popup)
            .addTo(map.current!)
        })
      }

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const userLng = pos.coords.longitude
            const userLat = pos.coords.latitude

            // Pan to user's location
            map.current?.flyTo({
              center: [userLng, userLat],
              zoom: 14,
              essential: true,
            })

            // Add user location marker
            new mapboxgl.Marker({ color: '#3b82f6' })
              .setLngLat([userLng, userLat])
              .setPopup(new mapboxgl.Popup().setText('You are here'))
              .addTo(map.current!)

            // Add restaurant markers within 5km
            addRestaurantMarkers(userLat, userLng)
          },
          (err) => {
            console.warn('Geolocation failed, defaulting to Toronto:', err)
            addRestaurantMarkers(43.6532, -79.3832) // Toronto fallback
          }
        )
      } else {
        console.warn('Geolocation not supported, using fallback')
        addRestaurantMarkers(43.6532, -79.3832)
      }
    })
  }, [])

  return <div ref={mapContainer} className="h-full w-full rounded-lg shadow-lg" />
}
