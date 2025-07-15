'use client'

import { useState } from 'react'
import { restaurants } from '@/data/restaurants'

export default function Sidebar({ onSelect }: { onSelect: (restaurant: string) => void }) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : 'expanded'}`}>
      <button className="sidebar-toggle" onClick={() => setCollapsed(!collapsed)}>
        {collapsed ? '▶' : '◀'}
      </button>

      {!collapsed && (
        <div className="map-controls">
          <h2>Filter Restaurants</h2>
          {/* Add your MapControls component here */}
        </div>
      )}

      {!collapsed && (
        <div className="space-y-3 overflow-y-auto p-4">
          {restaurants.map((r) => (
            <div key={r.name} className="restaurant-card" onClick={() => onSelect(r.name)}>
              <h3>{r.name}</h3>
              <p>
                {r.tags.join(', ')} • ⭐ {r.rating}
              </p>
              <p className="line-clamp-2">{r.review}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
