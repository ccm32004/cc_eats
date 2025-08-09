"use client";
import React from 'react';

interface RestaurantPopupProps {
  name: string;
  rating: number;
  vibeRating: number;
  tags: string[];
  image?: string;
  review?: string;
  onClose?: () => void;
}

export default function RestaurantPopup({ 
  name, 
  rating, 
  vibeRating, 
  tags, 
  image, 
  review,
  onClose
}: RestaurantPopupProps) {
  return (
    <div className="bg-bg-glass backdrop-blur-md border border-glass-border rounded-lg shadow-primary p-4 w-80 max-w-sm" style={{ boxShadow: 'var(--glow-primary)' }}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-text-primary text-body-lg font-semibold">{name}</h3>
        <button 
          onClick={onClose}
          className="text-text-secondary hover:text-text-primary transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Image */}
      {image && (
        <div className="mb-3">
          <img 
            src={image} 
            alt={name}
            className="w-full h-24 object-cover rounded-md"
          />
        </div>
      )}

      {/* Ratings */}
      <div className="flex gap-4 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-text-secondary text-sm">Rating:</span>
          <div className="flex items-center gap-1">
            <span className="text-text-primary font-medium">{rating}</span>
            <svg className="w-4 h-4 text-cyan-300" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-text-secondary text-sm">Vibe:</span>
          <div className="flex items-center gap-1">
            <span className="text-text-primary font-medium">{vibeRating}</span>
            <svg className="w-4 h-4 text-cyan-200" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-1.667-3.93l1.738-5.42-1.233-.616a1 1 0 01.894-1.79l1.599.8L11 3.323V2a1 1 0 011-1zM5 8a1 1 0 011-1h1a1 1 0 011 1v1a1 1 0 01-1 1H6a1 1 0 01-1-1V8zM3 12a1 1 0 011-1h1a1 1 0 011 1v1a1 1 0 01-1 1H4a1 1 0 01-1-1v-1z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="mb-3">
          <div className="flex flex-wrap gap-1">
            {tags.map((tag, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-bg-tertiary text-text-secondary text-xs rounded-full border border-border-primary"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Review */}
      {review && (
        <div className="mb-3">
          <p className="text-text-secondary text-sm leading-relaxed">{review}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <button className="flex-1 bg-cyan-300 text-black px-3 py-2 rounded-md text-sm font-medium hover:bg-cyan-400 transition-colors">
          Get Directions
        </button>
        <button className="px-3 py-2 border border-border-primary text-text-primary rounded-md text-sm hover:bg-bg-tertiary transition-colors">
          Share
        </button>
      </div>
    </div>
  );
}
