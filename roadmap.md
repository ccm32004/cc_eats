Here’s your roadmap in Markdown format, ready to be saved as `README.md` or `roadmap.md`:

````md
# 🍜 Personal Restaurant Map App – Development Roadmap

A map-based web app built using **Next.js**, **Tailwind CSS**, and **Mapbox**. Only the admin (you) can add restaurants. Visitors can view reviews, photos, and explore restaurants by tags, location, or area.

---

## 🚀 Tech Stack

- **Frontend**: Next.js, Tailwind CSS
- **Mapping**: Mapbox GL JS
- **Backend/API**: Next.js API Routes
- **Database**: MongoDB Atlas
- **Image Hosting**: Cloudinary or Firebase Storage
- **Authentication**: Simple admin-only access for `/admin` route
- **Autocomplete/Geolocation**: Mapbox Places API or Google Places API

---

## 📋 Step-by-Step Plan

### ✅ Step 1: Setup Project
- Create new Next.js project
- Install Tailwind CSS
- Configure Tailwind in `tailwind.config.js` and `globals.css`

```bash
npx create-next-app@latest restaurant-map
cd restaurant-map
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
````

---

### ✅ Step 2: Setup Mapbox

* Sign up on [mapbox.com](https://mapbox.com)
* Install Mapbox GL JS
* Add token to `.env.local`

```bash
npm install mapbox-gl
```

```env
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_token_here
```

* Create `Map.tsx` component and initialize map in `useEffect`

---

### ✅ Step 3: Render Restaurant Markers

* Create dummy data with lat/lng, name, tags
* Use `mapboxgl.Marker()` to add markers
* On click: show popup with name, rating, review, photos

---

### ✅ Step 4: Enable Geolocation

* Use browser's `navigator.geolocation`
* Pan map to user location
* Show restaurants within a radius (calculate using Haversine formula or MongoDB geospatial query)

---

### ✅ Step 5: Filter Restaurants

* Add dropdowns and checkboxes for:

  * Cuisine tags
  * Neighborhood/area
* Dynamically show/hide markers based on filters

---

### ✅ Step 6: Admin-Only Create Restaurant Page

* Create `/admin` page protected by a password or simple auth
* Admin form fields:

  * Autocomplete search for name/place
  * Review (text)
  * Tags (cuisine, area)
  * Rating (1–5 stars)
  * Image uploader
* On submit: store to MongoDB + upload images to Cloudinary

---

### ✅ Step 7: MongoDB Integration

* Use MongoDB Atlas
* Install MongoDB driver:

```bash
npm install mongodb
```

* Create schema:

```ts
{
  name: string,
  coordinates: { lat: number, lng: number },
  tags: string[],
  review: string,
  images: string[],
  rating: number,
  createdAt: Date
}
```

* Use `/api/restaurants` for:

  * `GET`: return all public restaurant data
  * `POST`: admin-only endpoint to add new restaurant

---

## ⚠️ Mapbox Rate Limit Tips

| Tip                          | Description                                                     |
| ---------------------------- | --------------------------------------------------------------- |
| Free tier                    | 50,000 map loads/month (GL JS), 100,000 geocoding requests      |
| Debounce autocomplete        | Wait 300–500ms between input changes                            |
| Cache geocoding              | Avoid repeating the same queries                                |
| Use conservative zoom levels | Lower zoom loads fewer tiles                                    |
| Never expose secrets         | Store API keys in `.env.local`, not client code or public repos |

---

## ✅ Features Overview

* [ ] Admin-only `/admin` route to add restaurants
* [ ] Interactive Mapbox map
* [ ] Popups with reviews, tags, ratings, photos
* [ ] Filter by tags and area
* [ ] Center on user's location and show nearby restaurants
* [ ] MongoDB data storage
* [ ] Cloudinary or Firebase image hosting

---

## 🗂 Suggested File Structure

```
/pages
  index.tsx          # Public map
  /admin/index.tsx   # Admin-only form
/api
  /restaurants
    get.ts           # Fetch all restaurants
    post.ts          # Add new restaurant (admin only)
/lib
  db.ts              # MongoDB connection
  auth.ts            # Admin check logic
/components
  Map.tsx
  RestaurantPopup.tsx
  FilterBar.tsx
  AdminForm.tsx
```

---

## 📌 Next Steps

Start with:

* [ ] Map component
* [ ] Dummy restaurant pins
* [ ] Admin form
* [ ] API routes

```

Let me know if you'd like this scaffolded into a GitHub repo or as a downloadable project starter!

we don't need an actual application, we can do a web app in the form of a web app
```
