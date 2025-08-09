Gotcha — we’ll still **store** the lat/lng in MongoDB (because the map needs them), but in the Admin Form UI we’ll:

* Hide the lat/lng inputs from the admin.
* Show a **read-only address field** populated from the Mapbox Places API.
* Keep all other fields (name, tags, rating, etc.) editable as before.

Here’s how that fits into your incremental plan:

---

### **Phase 12 – Admin Form Autocomplete (Mapbox Places)**

42. **Create API proxy for Mapbox Places**

    * Add `/app/api/places/route.ts` to call Mapbox Geocoding API with `categories=restaurant` and `autocomplete=true`.
    * Return `{ id, name, fullName, coordinates, address }` from the Mapbox response.
    * Store your Mapbox token in `.env.local` and avoid exposing it to the client.

43. **Add autocomplete input to AdminForm**

    * Replace the current “Restaurant Name” input with `<RestaurantAutocomplete />`.
    * Debounce requests to `/api/places?q=…` (250–300ms).
    * Show dropdown suggestions.

44. **Auto-fill address & hidden lat/lng on selection**

    * When an admin selects a suggestion:

      * Set `name` → restaurant name.
      * Set `address` → full formatted address.
      * Store `lat` / `lng` in hidden form state (not visible in UI).

45. **Update form layout**

    * Add a **read-only address field** below the restaurant name input.
    * Remove lat/lng inputs from the visible UI (keep them in state for submission).

46. **Update backend**

    * `/api/restaurants/post` should still validate and save `lat`, `lng`, `address`, `name`, etc.
    * Keep unique constraint on `(externalId, source)` to prevent duplicates.

47. **Test end-to-end**

    * Search for a restaurant in Admin Form.
    * Select a suggestion and see **address** fill in automatically.
    * Fill in ratings/review/tags, submit, and confirm DB has name, address, lat, and lng.
    * Check that it appears on the map at the correct location.

---

If you want, I can give you the **updated AdminForm component** that:

* Integrates the autocomplete search
* Shows the address field
* Stores lat/lng in hidden state
  so you can drop it straight into Phase 12.
