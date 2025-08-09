"use client";
import React, { useState, useEffect, useRef } from 'react';

interface Place {
  id: string;
  name: string;
  fullName: string;
  coordinates: [number, number];
  address: string;
}

interface RestaurantAutocompleteProps {
  onSelect: (place: Place) => void;
  placeholder?: string;
}

export default function RestaurantAutocomplete({ onSelect, placeholder = "Search for a restaurant..." }: RestaurantAutocompleteProps) {
  const [query, setQuery] = useState('');
  const [places, setPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce search requests
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim().length >= 3) {
        searchPlaces(query);
      } else {
        setPlaces([]);
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const searchPlaces = async (searchQuery: string) => {
    setIsLoading(true);
    try {
      console.log('Searching for:', searchQuery);
      const response = await fetch(`/api/places?q=${encodeURIComponent(searchQuery)}`);
      console.log('API response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('API response data:', data);
        setPlaces(data.places || []);
        setShowDropdown(true);
        setSelectedIndex(-1);
      } else {
        const errorData = await response.json();
        console.error('API error:', errorData);
        setPlaces([]);
      }
    } catch (error) {
      console.error('Error searching places:', error);
      setPlaces([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (place: Place) => {
    setQuery(place.name);
    setPlaces([]);
    setShowDropdown(false);
    onSelect(place);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < places.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && places[selectedIndex]) {
          handleSelect(places[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
      setShowDropdown(false);
      setSelectedIndex(-1);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (places.length > 0) setShowDropdown(true);
        }}
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-300 transition-colors"
      />
      
      {isLoading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-cyan-300"></div>
        </div>
      )}

      {showDropdown && places.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {places.map((place, index) => (
            <div
              key={place.id}
              onClick={() => handleSelect(place)}
              className={`px-4 py-3 cursor-pointer transition-colors ${
                index === selectedIndex
                  ? 'bg-cyan-300 text-black'
                  : 'text-white hover:bg-gray-700'
              }`}
            >
              <div className="font-medium">{place.name}</div>
              <div className="text-sm text-gray-400">{place.address}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
