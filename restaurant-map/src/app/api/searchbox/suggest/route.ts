import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');
  const sessionToken = searchParams.get('session_token');
  const proximity = searchParams.get('proximity');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 });
  }
  if (!sessionToken) {
    return NextResponse.json({ error: 'Session token is required' }, { status: 400 });
  }

  // Prefer server-only token. (Keep NEXT_PUBLIC_* as fallback if you really want.)
  const mapboxToken =
    process.env.MAPBOX_TOKEN ||
    process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || // fallback
    '';

  if (!mapboxToken || mapboxToken === 'pk.placeholder') {
    console.log('Using fallback data for testing');
    const fallbackSuggestions = [
      { id: '1', name: 'Pizza Palace', fullAddress: '123 Pizza Street, New York, NY 10001' },
      { id: '2', name: 'Sushi Express', fullAddress: '456 Sushi Avenue, New York, NY 10002' },
      { id: '3', name: 'Burger Joint',  fullAddress: '789 Burger Lane, New York, NY 10003' },
    ];
    const q = query.toLowerCase();
    const filteredSuggestions = fallbackSuggestions.filter(s =>
      s.name.toLowerCase().includes(q) || s.fullAddress.toLowerCase().includes(q)
    );
    return NextResponse.json({ suggestions: filteredSuggestions });
  }

  try {
    // Build Search Box suggest URL with token in the query string
    let url =
      `https://api.mapbox.com/search/searchbox/v1/suggest?` +
      `q=${encodeURIComponent(query)}&` +
      `session_token=${encodeURIComponent(sessionToken)}&` +
      `types=poi&` +
      `poi_category=restaurant&` +
      `limit=5` +
      `&access_token=${encodeURIComponent(mapboxToken)}`;

    if (proximity) {
      url += `&proximity=${encodeURIComponent(proximity)}`; // lng,lat
    }

    console.log('Fetching from Mapbox Search Box API:', url);

    // No Authorization header; token is in the URL
    const response = await fetch(url, { method: 'GET' });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Mapbox Search Box API error:', response.status, errorText);
      return NextResponse.json(
        { error: 'Upstream error', details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();

    const suggestions = (data.suggestions ?? []).map((s: any) => ({
      id: s.mapbox_id,
      name: s.name,
      fullAddress: s.full_address || s.place_formatted || s.address || '',
    }));

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to fetch suggestions', details: msg },
      { status: 500 }
    );
  }
}
