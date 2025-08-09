"use client";
import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import RestaurantPopup from "./RestaurantPopup";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "pk.placeholder";

// Dummy restaurant data
const dummyRestaurants = [
  {
    id: 1,
    name: "Pizza Palace",
    coordinates: [-74.006, 40.7128] as [number, number],
    address: "123 Pizza Street, New York, NY 10001",
    rating: 4.5,
    vibeRating: 4.2,
    tags: ["Italian", "Pizza", "Casual"],
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop",
    review: "Amazing authentic Italian pizza with a cozy atmosphere. The wood-fired oven gives the perfect crispy crust. Great for casual dining with friends and family."
  },
  {
    id: 2,
    name: "Sushi Express",
    coordinates: [-74.008, 40.7140] as [number, number],
    address: "456 Sushi Avenue, New York, NY 10002",
    rating: 4.8,
    vibeRating: 4.6,
    tags: ["Japanese", "Sushi", "Upscale"],
    image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop",
    review: "Premium sushi experience with fresh, high-quality ingredients. The chef's special rolls are incredible. Elegant setting perfect for date nights or business dinners."
  },
  {
    id: 3,
    name: "Burger Joint",
    coordinates: [-74.004, 40.7100] as [number, number],
    address: "789 Burger Lane, New York, NY 10003",
    rating: 4.2,
    vibeRating: 3.8,
    tags: ["American", "Burgers", "Casual"],
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
    review: "Classic American burgers with a modern twist. Juicy patties with creative toppings. Casual, friendly atmosphere perfect for quick lunches or casual dinners."
  },
  {
    id: 4,
    name: "Taco Fiesta",
    coordinates: [-74.010, 40.7160] as [number, number],
    address: "321 Taco Road, New York, NY 10004",
    rating: 4.0,
    vibeRating: 4.4,
    tags: ["Mexican", "Tacos", "Vibrant"],
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=300&fit=crop",
    review: "Vibrant Mexican restaurant with authentic flavors and colorful atmosphere. The street tacos are amazing, and the margaritas are perfectly balanced. Great for celebrations!"
  }
];

interface MapProps {
  selectedRestaurant?: any;
  onRestaurantSelect?: (restaurant: any) => void;
  userLocation?: [number, number] | null;
  onLocationUpdate?: (coordinates: [number, number]) => void;
}

export default function Map({ selectedRestaurant: externalRestaurant, onRestaurantSelect, userLocation, onLocationUpdate }: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState<any>(null);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [-74.006, 40.7128],
      zoom: 12,
    });

    // Auto-resize on any container size change (sidebar toggle, window resize, etc.)
    const ro = new ResizeObserver(() => map.current?.resize());
    ro.observe(mapContainer.current);

    // Also resize once after first layout to avoid short-initial renders
    requestAnimationFrame(() => map.current?.resize());

    // Optional: guard your layer styling so it doesn't error if IDs differ
    map.current.on("load", () => {
      const trySet = (id: string, prop: any, val: any) => {
        if (map.current?.getLayer(id)) map.current.setPaintProperty(id, prop, val);
      };
      trySet("road-primary", "line-color", "#333333");
      trySet("road-secondary", "line-color", "#2a2a2a");
      trySet("settlement-label", "text-color", "#b3b3b3");
      trySet("poi-label", "text-color", "#b3b3b3");

      // Add markers for each restaurant
      dummyRestaurants.forEach((restaurant) => {
        // Create a custom marker element
        const markerEl = document.createElement('div');
        markerEl.className = 'restaurant-marker';
        markerEl.style.width = '24px';
        markerEl.style.height = '24px';
        markerEl.style.borderRadius = '50%';
        markerEl.style.backgroundColor = '#00ffff';
        markerEl.style.border = '2px solid #ffffff';
        markerEl.style.boxShadow = '0 0 10px rgba(0, 255, 255, 0.6)';
        markerEl.style.cursor = 'pointer';

        // Create and add the marker
        const marker = new mapboxgl.Marker(markerEl)
          .setLngLat(restaurant.coordinates as [number, number])
          .addTo(map.current!);

        // Add click event to marker
        markerEl.addEventListener('click', () => {
          console.log(`Clicked on: ${restaurant.name}`);
          setSelectedRestaurant(restaurant);
          onRestaurantSelect?.(restaurant);
        });
      });
    });

    return () => {
      ro.disconnect();
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Handle external restaurant selection (from sidebar)
  useEffect(() => {
    if (externalRestaurant && map.current) {
      setSelectedRestaurant(externalRestaurant);
      map.current.flyTo({
        center: externalRestaurant.coordinates,
        zoom: 16,
        duration: 2000
      });
    }
  }, [externalRestaurant]);

  return (
    <div className="relative h-full w-full">
      <div ref={mapContainer} className="h-full w-full" />
      
      {/* Locate Me Button */}
      <button
        onClick={() => {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const coords: [number, number] = [position.coords.longitude, position.coords.latitude];
                console.log('User location:', coords);
                onLocationUpdate?.(coords);
                if (map.current) {
                  map.current.flyTo({
                    center: coords,
                    zoom: 14,
                    duration: 2000
                  });
                }
              },
              (error) => {
                console.error('Error getting location:', error);
                alert('Unable to get your location. Please check your browser settings.');
              }
            );
          } else {
            alert('Geolocation is not supported by this browser.');
          }
        }}
        className={`absolute top-4 left-4 z-10 p-3 border rounded-lg transition-colors shadow-lg ${
          userLocation 
            ? 'bg-cyan-300 text-black border-cyan-300' 
            : 'bg-gray-800 text-white border-gray-600 hover:bg-gray-700'
        }`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>
      
      {/* Popup Overlay */}
      {selectedRestaurant && (
        <div className="absolute top-4 right-4 z-10">
          <RestaurantPopup
            name={selectedRestaurant.name}
            rating={selectedRestaurant.rating}
            vibeRating={selectedRestaurant.vibeRating}
            tags={selectedRestaurant.tags}
            image={selectedRestaurant.image}
            review={selectedRestaurant.review}
            onClose={() => setSelectedRestaurant(null)}
          />
        </div>
      )}
    </div>
  );
}
