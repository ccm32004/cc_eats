import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');
  const sessionToken = searchParams.get('session_token');

  if (!id) {
    return NextResponse.json({ error: 'Restaurant ID is required' }, { status: 400 });
  }

  if (!sessionToken) {
    return NextResponse.json({ error: 'Session token is required' }, { status: 400 });
  }

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

  if (!mapboxToken || mapboxToken === 'pk.placeholder') {
    return NextResponse.json(
      {
        id: '1',
        name: 'Pizza Palace',
        address: '123 Pizza Street, New York, NY 10001',
        lat: 40.7128,
        lng: -74.006
      }
    );
  }

  try {
    let url = `https://api.mapbox.com/search/searchbox/v1/retrieve/${id}?` +
      `session_token=${sessionToken}` +
      `&access_token=${mapboxToken}`; // ✅ token appended to URL

    console.log('Fetching from Mapbox Search Box Retrieve API:', url);

    const response = await fetch(url, {
      headers: { 'Content-Type': 'application/json' } // ✅ no Authorization header
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Mapbox Search Box Retrieve API error:', response.status, errorText);
      throw new Error(`Mapbox Search Box Retrieve API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Mapbox Retrieve API response:', data);

    return NextResponse.json({
      id: data.id || id,
      name: data.name,
      address: data.full_address || data.address || data.place_formatted,
      lat: data.geometry?.coordinates?.[1],
      lng: data.geometry?.coordinates?.[0]
    });
  } catch (error) {
    console.error('Error retrieving restaurant details:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: 'Failed to retrieve restaurant details', details: errorMessage }, { status: 500 });
  }
}
