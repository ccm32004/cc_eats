"use client";
import React, { useState, useEffect } from 'react';

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
  const [adminLocation, setAdminLocation] = useState<[number, number] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [restaurantSelected, setRestaurantSelected] = useState(false);
  const [sessionToken] = useState(() => Math.random().toString(36).substring(2, 15));

  // Star rating component
  const StarRating = ({ value, onChange, label }: { value: number; onChange: (value: number) => void; label: string }) => (
    <div>
      <label className="block text-cyan-100 text-sm font-medium mb-2">{label}</label>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className={`transition-all duration-200 ${
              star <= value
                ? 'text-cyan-300 drop-shadow-[0_0_8px_rgba(0,255,255,0.6)] scale-110'
                : 'text-gray-500 hover:text-gray-400'
            }`}
          >
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        ))}
      </div>
      <div className="text-cyan-300 text-sm mt-1">{value}/5</div>
    </div>
  );

  // Get admin location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords: [number, number] = [position.coords.longitude, position.coords.latitude];
          setAdminLocation(coords);
          console.log('Admin location obtained:', coords);
        },
        (error) => {
          console.error('Error getting admin location:', error);
          // Use default location if geolocation fails
          setAdminLocation([-74.006, 40.7128]);
        }
      );
    } else {
      // Use default location if geolocation not supported
      setAdminLocation([-74.006, 40.7128]);
    }
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim() || !adminLocation) return;
    
    setIsSearching(true);
    try {
      const response = await fetch(`/api/searchbox/suggest?q=${encodeURIComponent(searchQuery)}&session_token=${sessionToken}&proximity=${adminLocation[0]},${adminLocation[1]}`);
      if (response.ok) {
        const data = await response.json();
        setSuggestions(data.suggestions || []);
      }
    } catch (error) {
      console.error('Error searching:', error);
      setSuggestions([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSuggestionSelect = async (suggestion: any) => {
    console.log('Selected suggestion:', suggestion);
    try {
      const response = await fetch(`/api/searchbox/retrieve?id=${suggestion.id}&session_token=${sessionToken}`);
      console.log('Retrieve response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Retrieved data:', data);
        
        setFormData(prev => {
          const newData = {
            ...prev,
            name: data.name,
            address: data.address,
            coordinates: [data.lng, data.lat] as [number, number]
          };
          console.log('Updated form data:', newData);
          return newData;
        });
        
        setRestaurantSelected(true);
        setSuggestions([]);
        setSearchQuery(data.name);
        console.log('Restaurant selected, form should now be visible');
      } else {
        const errorData = await response.json();
        console.error('Retrieve API error:', errorData);
      }
    } catch (error) {
      console.error('Error retrieving restaurant details:', error);
    }
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
      setSearchQuery('');
      setRestaurantSelected(false);
      setSuggestions([]);
      setTagInput('');
      setErrors({});
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary p-6">
      <div className="max-w-2xl mx-auto">
        {/* Search Section - Always Visible */}
        <div className="mb-6">
          <h1 className="text-cyan-100 text-2xl font-bold mb-4 text-center drop-shadow-[0_0_10px_rgba(0,255,255,0.3)]">
            Add New Restaurant
          </h1>
          
          <div className="bg-bg-glass backdrop-blur-md border border-cyan-300/30 rounded-lg shadow-primary p-6">
            <label className="block text-cyan-100 text-sm font-medium mb-2">
              Search Restaurant *
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Enter restaurant name and press Enter or click Search"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-300 transition-colors"
              />
              <button
                type="button"
                onClick={handleSearch}
                disabled={isSearching}
                className="px-6 py-3 bg-cyan-300 text-black rounded-lg hover:bg-cyan-400 transition-colors font-medium disabled:opacity-50"
              >
                {isSearching ? 'Searching...' : 'Search'}
              </button>
            </div>
            
            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="mt-2 bg-gray-800 border border-gray-600 rounded-lg max-h-60 overflow-y-auto">
                {suggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    onClick={() => handleSuggestionSelect(suggestion)}
                    className="px-4 py-3 cursor-pointer hover:bg-gray-700 transition-colors border-b border-gray-600 last:border-b-0"
                  >
                    <div className="font-medium text-white">{suggestion.name}</div>
                    <div className="text-sm text-gray-400">{suggestion.fullAddress}</div>
                  </div>
                ))}
              </div>
            )}
            
            {errors.name && (
              <p className="text-red-400 text-sm mt-1">{errors.name}</p>
            )}
          </div>
        </div>

        {/* Form Section - Only Visible After Restaurant Selection */}
        {restaurantSelected && (
          <div className="bg-bg-glass backdrop-blur-md border border-cyan-300/30 rounded-lg shadow-primary p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
              {/* Selected Restaurant Info - Display Only */}
              <div className="bg-gray-800 border border-gray-600 rounded-lg p-4 mb-6">
                <h3 className="text-cyan-300 text-lg font-semibold mb-3">Selected Restaurant</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-gray-400 text-sm">Name:</span>
                    <div className="text-white font-medium">{formData.name}</div>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">Address:</span>
                    <div className="text-white">{formData.address}</div>
                  </div>
                </div>
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
              <StarRating 
                value={formData.rating} 
                onChange={(value) => handleInputChange('rating', value)} 
                label="Rating *" 
              />
              <StarRating 
                value={formData.vibeRating} 
                onChange={(value) => handleInputChange('vibeRating', value)} 
                label="Vibe Rating *" 
              />
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
            {restaurantSelected && (
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-cyan-300 text-black py-3 px-6 rounded-lg font-medium hover:bg-cyan-400 transition-colors shadow-lg"
                >
                  Add Restaurant
                </button>
              </div>
            )}
          </form>
        </div>
        )}
      </div>
    </div>
  );
}
