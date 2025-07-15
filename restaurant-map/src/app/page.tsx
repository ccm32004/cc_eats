'use client'
import Map from '@/components/Map'
import Sidebar from '@/components/Sidebar'
import { useState } from 'react'

export default function Home() {
  const [filters, setFilters] = useState({
    selectedTags: [],
    selectedArea: null,
    showAll: false,
  })

  const handleSelectRestaurant = (restaurantName: string) => {
    // TODO: Connect this with map focus or popup
    console.log('Selected restaurant:', restaurantName)
  }

  return (
    <div className="grid h-screen grid-cols-[auto_1fr]">
      <Sidebar onSelect={handleSelectRestaurant} />
      <div className="h-full p-4">
        <Map filters={filters} />
      </div>
    </div>
  )
}
