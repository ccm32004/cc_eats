"use client";
import React, { useState } from 'react';

interface SidebarProps {
  onRestaurantClick?: (coordinates: [number, number]) => void;
  onRestaurantSelect?: (restaurant: any) => void;
  userLocation?: [number, number] | null;
  onLocationUpdate?: (coordinates: [number, number]) => void;
}

export default function Sidebar({ onRestaurantClick, onRestaurantSelect, userLocation: externalLocation, onLocationUpdate }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showNearMe, setShowNearMe] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(externalLocation || null);
  
  const availableTags = ['Italian', 'Japanese', 'American', 'Mexican', 'Pizza', 'Sushi', 'Burgers', 'Tacos', 'Casual', 'Upscale', 'Vibrant'];
  
  const restaurants = [
    {
      id: 1,
      name: "Pizza Palace",
      rating: 4.5,
      vibeRating: 4.2,
      tags: ["Italian", "Pizza", "Casual"],
      coordinates: [-74.006, 40.7128] as [number, number],
      address: "123 Pizza Street, New York, NY 10001",
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop",
      review: "Amazing authentic Italian pizza with a cozy atmosphere. The wood-fired oven gives the perfect crispy crust. Great for casual dining with friends and family."
    },
    {
      id: 2,
      name: "Sushi Express",
      rating: 4.8,
      vibeRating: 4.6,
      tags: ["Japanese", "Sushi", "Upscale"],
      coordinates: [-74.008, 40.7140] as [number, number],
      address: "456 Sushi Avenue, New York, NY 10002",
      image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop",
      review: "Premium sushi experience with fresh, high-quality ingredients. The chef's special rolls are incredible. Elegant setting perfect for date nights or business dinners."
    },
    {
      id: 3,
      name: "Burger Joint",
      rating: 4.2,
      vibeRating: 3.8,
      tags: ["American", "Burgers", "Casual"],
      coordinates: [-74.004, 40.7100] as [number, number],
      address: "789 Burger Lane, New York, NY 10003",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
      review: "Classic American burgers with a modern twist. Juicy patties with creative toppings. Casual, friendly atmosphere perfect for quick lunches or casual dinners."
    },
    {
      id: 4,
      name: "Taco Fiesta",
      rating: 4.0,
      vibeRating: 4.4,
      tags: ["Mexican", "Tacos", "Vibrant"],
      coordinates: [-74.010, 40.7160] as [number, number],
      address: "321 Taco Road, New York, NY 10004",
      image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=300&fit=crop",
      review: "Vibrant Mexican restaurant with authentic flavors and colorful atmosphere. The street tacos are amazing, and the margaritas are perfectly balanced. Great for celebrations!"
    }
  ];
  
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };
  
  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.some(tag => restaurant.tags.includes(tag));
    
    let matchesLocation = true;
    if (showNearMe && userLocation) {
      const distance = calculateDistance(
        userLocation[1], userLocation[0],
        restaurant.coordinates[1], restaurant.coordinates[0]
      );
      matchesLocation = distance <= 5;
    }
    
    return matchesSearch && matchesTags && matchesLocation;
  });
  
  return (
    <div className="h-full bg-bg-glass border-r border-border-primary backdrop-blur-md shadow-primary flex flex-col relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent z-10"></div>
      
      <div className="p-6 flex-1 overflow-y-auto">
        
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search restaurants..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                console.log('Search query:', e.target.value);
              }}
              className="w-full px-4 py-2 bg-neutral-800 border border-neutral-600 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-300 transition-colors"
            />
            <svg className="absolute right-3 top-2.5 w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        {/* Location Filter */}
        <div className="mb-6">
          <h3 className="text-text-primary text-sm font-medium mb-3">Location</h3>
          <div className="space-y-2">
            <button
              onClick={() => {
                if (!userLocation) {
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                      (position) => {
                        const coords: [number, number] = [position.coords.longitude, position.coords.latitude];
                        setUserLocation(coords);
                        onLocationUpdate?.(coords);
                        setShowNearMe(true);
                        console.log('User location obtained:', coords);
                      },
                      (error) => {
                        console.error('Error getting location:', error);
                        alert('Unable to get your location. Please check your browser settings.');
                      }
                    );
                  } else {
                    alert('Geolocation is not supported by this browser.');
                  }
                } else {
                  setShowNearMe(!showNearMe);
                }
              }}
              className={`w-full px-3 py-2 text-sm rounded-lg border transition-colors flex items-center gap-2 ${
                showNearMe
                  ? 'bg-cyan-300 text-black border-cyan-300'
                  : 'bg-neutral-800 text-neutral-300 border-neutral-600 hover:bg-neutral-700'
              }`}
            >
              <svg className="w-4 h-4 text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {userLocation ? 'Near Me' : 'Get My Location'}
            </button>
            {userLocation && (
              <div className="text-text-secondary text-xs px-2">
                Location: {userLocation[1].toFixed(4)}, {userLocation[0].toFixed(4)}
              </div>
            )}
          </div>
        </div>
        
        {/* Filter Tags */}
        <div className="mb-6">
          <h3 className="text-text-primary text-sm font-medium mb-3">Filter by Tags</h3>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  const newSelected = selectedTags.includes(tag)
                    ? selectedTags.filter(t => t !== tag)
                    : [...selectedTags, tag];
                  setSelectedTags(newSelected);
                  console.log('Selected tags:', newSelected);
                }}
                className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                  selectedTags.includes(tag)
                    ? 'bg-cyan-300 text-black border-cyan-300 shadow-lg'
                    : 'bg-neutral-800 text-neutral-300 border-neutral-600 hover:bg-neutral-700 hover:border-cyan-300 hover:text-white'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
        
        {/* Restaurant List */}
        <div className="space-y-3">
          <h3 className="text-text-primary text-sm font-medium">Restaurants</h3>
          {filteredRestaurants.map((restaurant) => (
            <div
              key={restaurant.id}
              onClick={() => {
                onRestaurantClick?.(restaurant.coordinates);
                onRestaurantSelect?.(restaurant);
                console.log(`Clicked on ${restaurant.name}, recentering map to:`, restaurant.coordinates);
              }}
              className="p-3 bg-neutral-800 rounded-lg border border-neutral-600 hover:bg-neutral-700 hover:border-cyan-300 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-text-primary text-sm font-medium">{restaurant.name}</h4>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <span className="text-text-secondary text-xs">{restaurant.rating}</span>
                    <svg className="w-3 h-3 text-cyan-300" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-text-secondary text-xs">{restaurant.vibeRating}</span>
                    <svg className="w-3 h-3 text-cyan-200" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-1.667-3.93l1.738-5.42-1.233-.616a1 1 0 01.894-1.79l1.599.8L11 3.323V2a1 1 0 011-1zM5 8a1 1 0 011-1h1a1 1 0 011 1v1a1 1 0 01-1 1H6a1 1 0 01-1-1V8zM3 12a1 1 0 011-1h1a1 1 0 011 1v1a1 1 0 01-1 1H4a1 1 0 01-1-1v-1z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {restaurant.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 bg-neutral-700 text-neutral-300 text-xs rounded-full border border-neutral-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
