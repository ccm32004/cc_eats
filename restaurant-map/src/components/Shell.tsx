"use client";
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Map from './Map';
  
interface ShellProps {
  children: React.ReactNode;
}

interface Restaurant {
  id: number;
  name: string;
  rating: number;
  vibeRating: number;
  tags: string[];
  coordinates: [number, number];
  image?: string;
  review?: string;
}

interface UserLocation {
  coordinates: [number, number];
  timestamp: number;
}

export default function Shell({ children }: ShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  return (
    <div className="min-h-screen bg-bg-primary">
      <header className="h-16 bg-bg-glass border-b border-border-primary backdrop-blur-md flex items-center justify-between px-4 sm:px-6 shadow-primary min-w-0 relative">
        
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 relative z-10">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 rounded-lg hover:bg-bg-tertiary transition-colors text-text-secondary hover:text-text-primary flex-shrink-0"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-text-primary text-title sm:text-title-lg font-bold tracking-tight truncate">CC Eats</h1>
        </div>
      </header>
      <main className="flex h-[calc(100vh-4rem)] min-w-0">
        {/* Sidebar */}
        <div className={`transition-all duration-300 ease-in-out relative ${sidebarCollapsed ? 'w-0 opacity-0 overflow-hidden' : 'w-80 opacity-100'}`}>
          {/* Line separating sidebar from main content */}
          <div className="absolute right-0 top-0 bottom-0 w-px bg-border-primary z-10"></div>
          
          <Sidebar 
            onRestaurantClick={(coordinates) => {
              // TODO: Pass this to Map component to recenter
              console.log('Recentering map to:', coordinates);
            }}
            onRestaurantSelect={setSelectedRestaurant}
            userLocation={userLocation?.coordinates}
            onLocationUpdate={(coords) => setUserLocation({ coordinates: coords, timestamp: Date.now() })}
          />
        </div>
        
        {/* Map Area */}
        <div className="flex-1 bg-bg-tertiary min-w-0 overflow-hidden">
          <Map 
            selectedRestaurant={selectedRestaurant}
            onRestaurantSelect={setSelectedRestaurant}
            userLocation={userLocation?.coordinates}
            onLocationUpdate={(coords) => setUserLocation({ coordinates: coords, timestamp: Date.now() })}
          />
        </div>
      </main>
    </div>
  );
}
