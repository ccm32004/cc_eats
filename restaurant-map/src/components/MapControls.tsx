'use client'

import { restaurants } from '@/data/restaurants'

const allTags = Array.from(new Set(restaurants.flatMap((r) => r.tags)))
const allAreas = ['Toronto', 'Ottawa'] // You can make this dynamic later

type Props = {
  filters: {
    selectedTags: string[]
    selectedArea: string | null
    showAll: boolean
  }
  onChange: (filters: Props['filters']) => void
}

export default function MapControls({ filters, onChange }: Props) {
  const toggleTag = (tag: string) => {
    const updatedTags = filters.selectedTags.includes(tag)
      ? filters.selectedTags.filter((t) => t !== tag)
      : [...filters.selectedTags, tag]

    onChange({ ...filters, selectedTags: updatedTags })
  }

  return (
    <div className="map-controls">
      <h2>Filter Restaurants</h2>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Cuisine</label>
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <label key={tag} className="tag-checkbox flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={filters.selectedTags.includes(tag)}
                onChange={() => toggleTag(tag)}
              />
              {tag}
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Area</label>
        <select
          className="area-select w-full"
          value={filters.selectedArea ?? ''}
          onChange={(e) => onChange({ ...filters, selectedArea: e.target.value || null })}
        >
          <option value="">All Areas</option>
          {allAreas.map((area) => (
            <option key={area} value={area}>
              {area}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center">
        <input
          id="show-all"
          type="checkbox"
          className="toggle-checkbox"
          checked={filters.showAll}
          onChange={(e) => onChange({ ...filters, showAll: e.target.checked })}
        />
        <label htmlFor="show-all" className="cursor-pointer text-sm">
          Show all restaurants (ignore location)
        </label>
      </div>
    </div>
  )
}
