import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');
  const sessionToken = searchParams.get('session_token');

  if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });
  if (!sessionToken) return NextResponse.json({ error: 'session_token is required' }, { status: 400 });

  // Use a server-only env var; avoid NEXT_PUBLIC here
  const mapboxToken = process.env.MAPBOX_TOKEN || process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  if (!mapboxToken) {
    return NextResponse.json({ error: 'Missing MAPBOX_TOKEN on server' }, { status: 500 });
  }

  try {
    const url = new URL(
      `https://api.mapbox.com/search/searchbox/v1/retrieve/${encodeURIComponent(id)}`
    );
    url.searchParams.set('session_token', sessionToken);
    url.searchParams.set('access_token', mapboxToken);

    // Redact token in logs
    const redacted = mapboxToken.slice(0, 6) + '…';
    console.log('Mapbox retrieve →', url.toString().replace(mapboxToken, redacted));

    const resp = await fetch(url.toString(), { cache: 'no-store' });
    if (!resp.ok) {
      const body = await resp.text().catch(() => '');
      console.error('Mapbox error', resp.status, body);
      return NextResponse.json({ error: 'Upstream error', status: resp.status, body }, { status: 502 });
    }

    const data = await resp.json();
    // Expect FeatureCollection with a single Feature
    const feature = data?.features?.[0];
    if (!feature) {
      return NextResponse.json({ error: 'No feature in retrieve response', raw: data }, { status: 404 });
    }

    const props = feature.properties ?? {};
    const geom = feature.geometry ?? {};
    const coords = Array.isArray(geom.coordinates) ? geom.coordinates : [];

    // Normalize for your form
    const normalized = {
      id: props.mapbox_id ?? id,
      name: props.name ?? props.place_formatted ?? '',
      address:
        props.full_address ??
        props.place_formatted ??
        props.address ??
        '',
      lat: typeof coords[1] === 'number' ? coords[1] : undefined,
      lng: typeof coords[0] === 'number' ? coords[0] : undefined,
    };

    if (typeof normalized.lat !== 'number' || typeof normalized.lng !== 'number') {
      return NextResponse.json({ error: 'Missing coordinates', feature }, { status: 422 });
    }

    return NextResponse.json(normalized);
  } catch (err: any) {
    console.error('Retrieve failed', err);
    return NextResponse.json(
      { error: 'Failed to retrieve', details: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}
