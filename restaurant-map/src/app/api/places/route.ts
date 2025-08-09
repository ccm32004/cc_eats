import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 });
  }

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  
  if (!mapboxToken || mapboxToken === 'pk.placeholder') {
    console.log('Using fallback data for testing');
    // Return fallback data for testing
    const fallbackPlaces = [
      {
        id: '1',
        name: 'Pizza Palace',
        fullName: 'Pizza Palace',
        coordinates: [-74.006, 40.7128] as [number, number],
        address: '123 Pizza Street, New York, NY 10001'
      },
      {
        id: '2',
        name: 'Sushi Express',
        fullName: 'Sushi Express',
        coordinates: [-74.008, 40.7140] as [number, number],
        address: '456 Sushi Avenue, New York, NY 10002'
      },
      {
        id: '3',
        name: 'Burger Joint',
        fullName: 'Burger Joint',
        coordinates: [-74.004, 40.7100] as [number, number],
        address: '789 Burger Lane, New York, NY 10003'
      }
    ];
    
    // Filter based on query
    const filteredPlaces = fallbackPlaces.filter(place => 
      place.name.toLowerCase().includes(query.toLowerCase()) ||
      place.address.toLowerCase().includes(query.toLowerCase())
    );
    
    return NextResponse.json({ places: filteredPlaces });
  }

  try {
    // Use Mapbox Geocoding API with restaurant category filter
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?` +
      `access_token=${mapboxToken}&` +
      `types=poi&` +
      `categories=restaurant&` +
      `autocomplete=true&` +
      `limit=5`;
    
    console.log('Fetching from Mapbox API:', url);
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Mapbox API error:', response.status, errorText);
      throw new Error(`Mapbox API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Mapbox API response:', data);
    
    // Transform the response to match our needs
    const places = data.features.map((feature: any) => ({
      id: feature.id,
      name: feature.text,
      fullName: feature.place_name,
      coordinates: feature.center as [number, number], // [longitude, latitude]
      address: feature.place_name,
    }));

    console.log('Transformed places:', places);
    return NextResponse.json({ places });
  } catch (error) {
    console.error('Error fetching places:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: 'Failed to fetch places', details: errorMessage }, { status: 500 });
  }
}
