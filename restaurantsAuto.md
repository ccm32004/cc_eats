Alright — so for your **Phase 12 Admin Form flow**, you want:

1. **One API call only after user presses Enter/search**, not on every keystroke.
2. **Prompt admin for their location first**, so we can send `proximity` to the Search Box API.
3. **Hide all other form fields** until a restaurant is selected.
4. Show the **address** in a **read-only field**.
5. Still keep `lat`/`lng` hidden for DB submission.

Here’s the updated **Phase 12 tasks** reflecting that flow:

---

### **Phase 12 – Admin Form Restaurant Search (Mapbox Search Box)**

42. **Prompt for admin’s location**

* When the Admin Form mounts, ask for geolocation via `navigator.geolocation.getCurrentPosition()`.
* Store the `[lng, lat]` in component state for use in the API search.

43. **Add `/api/searchbox/suggest/route.ts` proxy**

* Accept query params: `q`, `session_token`, and `proximity=lng,lat`.
* Call `https://api.mapbox.com/search/searchbox/v1/suggest` with `types=poi` and `poi_category=restaurant`.
* Return `{ id, name, fullAddress }` for the top 5 matches.

44. **Add `/api/searchbox/retrieve/route.ts` proxy**

* Accept `id` and `session_token`.
* Call `https://api.mapbox.com/search/searchbox/v1/retrieve/{id}`.
* Return `{ name, address, lat, lng, externalId }`.

45. **Implement search-on-submit behavior**

* In the form’s search box, **don’t call the API on every keystroke**.
* Only trigger `/api/searchbox/suggest` when the admin presses **Enter** or clicks a **Search** button.
* Pass the `proximity` from step 42 in the API request.

46. **Restaurant selection & reveal rest of form**

* Show a list of suggestions returned from `/suggest`.
* When admin clicks a suggestion:

  * Call `/retrieve` to get lat/lng + address.
  * Fill `name` and **read-only** `address` field.
  * Store `lat`, `lng`, `externalId`, `source="mapbox-searchbox"` in hidden form state.
  * **Reveal** the rest of the form fields: tags, rating, vibeRating, review, image URL.

47. **Submit & store**

* `/api/restaurants/post` should validate all required fields.
* Store name, address, lat, lng, tags, rating, vibeRating, etc. in MongoDB.
* Keep unique constraint on `(externalId, source)`.

48. **Test complete flow**

* On load, allow location access.
* Search for a restaurant → see suggestions → pick one.
* Verify name/address fill correctly, lat/lng hidden, rest of form visible.
* Submit → confirm DB has correct fields.
* Check the restaurant appears on the map at correct location.

---