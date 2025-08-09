"use client";
import React, { useState } from 'react';
import RestaurantAutocomplete from './RestaurantAutocomplete';

interface AdminFormProps {
  onSubmit?: (data: RestaurantData) => void;
}

interface RestaurantData {
  name: string;
  review: string;
  tags: string[];
  rating: number;
  vibeRating: number;
  imageFile?: File;
  address: string;
  coordinates: [number, number];
}

export default function AdminForm({ onSubmit }: AdminFormProps) {
  const [formData, setFormData] = useState<RestaurantData>({
    name: '',
    review: '',
    tags: [],
    rating: 5,
    vibeRating: 5,
    address: '',
    coordinates: [-74.006, 40.7128] // Default to NYC
  });

  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Partial<RestaurantData>>({});

  const handlePlaceSelect = (place: any) => {
    setFormData(prev => ({
      ...prev,
      name: place.name,
      address: place.address,
      coordinates: place.coordinates
    }));
  };

  const handleInputChange = (field: keyof RestaurantData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<RestaurantData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Restaurant name is required';
    }

    if (!formData.review.trim()) {
      newErrors.review = 'Review is required';
    }

    if (formData.rating < 1 || formData.rating > 5) {
      newErrors.rating = 'Rating must be between 1 and 5';
    }

    if (formData.vibeRating < 1 || formData.vibeRating > 5) {
      newErrors.vibeRating = 'Vibe rating must be between 1 and 5';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit?.(formData);
      // Reset form
      setFormData({
        name: '',
        review: '',
        tags: [],
        rating: 5,
        vibeRating: 5,
        address: '',
        coordinates: [-74.006, 40.7128]
      });
      setTagInput('');
      setErrors({});
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-bg-glass backdrop-blur-md border border-cyan-300/30 rounded-lg shadow-primary p-8">
          <h1 className="text-cyan-100 text-2xl font-bold mb-6 text-center drop-shadow-[0_0_10px_rgba(0,255,255,0.3)]">
            Add New Restaurant
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Restaurant Search */}
            <div>
              <label className="block text-cyan-100 text-sm font-medium mb-2">
                Search Restaurant *
              </label>
              <RestaurantAutocomplete 
                onSelect={handlePlaceSelect}
                placeholder="Search for a restaurant..."
              />
              {errors.name && (
                <p className="text-red-400 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Review */}
            <div>
              <label htmlFor="review" className="block text-cyan-100 text-sm font-medium mb-2">
                Review *
              </label>
              <textarea
                id="review"
                value={formData.review}
                onChange={(e) => handleInputChange('review', e.target.value)}
                rows={4}
                className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-300 transition-colors resize-none ${
                  errors.review ? 'border-red-500' : 'border-gray-600'
                }`}
                placeholder="Write a detailed review of the restaurant"
              />
              {errors.review && (
                <p className="text-red-400 text-sm mt-1">{errors.review}</p>
              )}
            </div>

            {/* Tags */}
            <div>
              <label className="block text-cyan-100 text-sm font-medium mb-2">
                Tags
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  className="flex-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent-light transition-colors"
                  placeholder="Add a tag (e.g., Italian, Pizza)"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-cyan-300 text-black rounded-lg hover:bg-cyan-400 transition-colors font-medium"
                >
                  Add
                </button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-cyan-300 text-black text-sm rounded-full flex items-center gap-2"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-red-600 transition-colors"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Ratings */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label htmlFor="rating" className="block text-cyan-100 text-sm font-medium mb-2">
                  Rating (1-5) *
                </label>
                <input
                  type="number"
                  id="rating"
                  min="1"
                  max="5"
                  value={formData.rating}
                  onChange={(e) => handleInputChange('rating', parseInt(e.target.value))}
                                  className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white focus:outline-none focus:border-accent-light transition-colors ${
                  errors.rating ? 'border-red-500' : 'border-gray-600'
                }`}
                />
                {errors.rating && (
                  <p className="text-red-400 text-sm mt-1">{errors.rating}</p>
                )}
              </div>

              <div>
                <label htmlFor="vibeRating" className="block text-cyan-100 text-sm font-medium mb-2">
                  Vibe Rating (1-5) *
                </label>
                <input
                  type="number"
                  id="vibeRating"
                  min="1"
                  max="5"
                  value={formData.vibeRating}
                  onChange={(e) => handleInputChange('vibeRating', parseInt(e.target.value))}
                                  className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white focus:outline-none focus:border-accent-light transition-colors ${
                  errors.vibeRating ? 'border-red-500' : 'border-gray-600'
                }`}
                />
                {errors.vibeRating && (
                  <p className="text-red-400 text-sm mt-1">{errors.vibeRating}</p>
                )}
              </div>
            </div>

            {/* Restaurant Address */}
            <div>
              <label htmlFor="address" className="block text-cyan-100 text-sm font-medium mb-2">
                Restaurant Address *
              </label>
              <input
                type="text"
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-300 transition-colors ${
                  errors.address ? 'border-red-500' : 'border-gray-600'
                }`}
                placeholder="Enter restaurant address"
              />
              {errors.address && (
                <p className="text-red-400 text-sm mt-1">{errors.address}</p>
              )}
            </div>

            {/* Image Upload */}
            <div>
              <label htmlFor="imageFile" className="block text-cyan-100 text-sm font-medium mb-2">
                Restaurant Image
              </label>
              <input
                type="file"
                id="imageFile"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setFormData(prev => ({ ...prev, imageFile: file }));
                  }
                }}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-300 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-300 file:text-black hover:file:bg-cyan-400"
              />
            </div>

            {/* Hidden coordinates - will be populated by Mapbox Places API */}
            <input type="hidden" value={formData.coordinates[0]} />
            <input type="hidden" value={formData.coordinates[1]} />

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-cyan-300 text-black py-3 px-6 rounded-lg font-medium hover:bg-cyan-400 transition-colors shadow-lg"
              >
                Add Restaurant
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
