export type Restaurant = {
  name: string
  lat: number
  lng: number
  tags: string[]
  rating: number
  vibes: number
  review: string
  photo: string
}

export const restaurants: Restaurant[] = [
  {
    name: 'Pho Binh Minh',
    lat: 43.6532,
    lng: -79.3832,
    tags: ['Vietnamese', 'Noodles'],
    rating: 4.5,
    vibes: 3.5,
    review: 'Authentic broth, fast service.',
    photo: '/sample_pho.jpg',
  },
  {
    name: 'Sushi Mori',
    lat: 43.651,
    lng: -79.387,
    tags: ['Japanese', 'Sushi'],
    rating: 4.8,
    vibes: 4.2,
    review: 'Freshest sashimi downtown.',
    photo: '/sample_sushi.jpg',
  },
  {
    name: 'Sansotei Ramen',
    lat: 45.4215,
    lng: -75.6972,
    tags: ['Japanese', 'Ramen'],
    rating: 4.6,
    vibes: 4.3,
    review: 'Rich pork broth and perfectly chewy noodles.',
    photo: '/sample_ramen.jpg',
  },
  {
    name: 'BeaverTails ByWard',
    lat: 45.427,
    lng: -75.6938,
    tags: ['Canadian', 'Dessert'],
    rating: 4.7,
    vibes: 4.9,
    review: 'Iconic Ottawa street snack. Try the Killaloe Sunrise!',
    photo: '/sample_beavertail.jpg',
  },
  {
    name: 'Shawarma Palace',
    lat: 45.4155,
    lng: -75.6796,
    tags: ['Middle Eastern', 'Shawarma'],
    rating: 4.4,
    vibes: 3.7,
    review: 'Massive portions, great garlic sauce.',
    photo: '/sample_shawarma.jpg',
  },
]
