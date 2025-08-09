## 🚀 Tasks

### **Phase 1 – Project & Theme Setup**
1. Create Next.js project (`npx create-next-app@latest restaurant-map`) and verify dev server.
2. Install Tailwind CSS (`tailwindcss postcss autoprefixer`) and init config.
3. Configure Tailwind content paths for `/pages` and `/components`.
4. Create `/styles/theme.css` with Neo-Night CSS variables, import into `globals.css`, test with sample div.
5. Extend Tailwind config to use theme tokens, test with `bg-bg` class.

---

### **Phase 2 – Shell Layout**
6. Create `/components/Shell.tsx` with `<header>` and `<main>`, render in `index.tsx`.
7. Add glassmorphic header styles, test visually.
8. Implement two-column layout (sidebar + map) with placeholder blocks, test resizing.

---

### **Phase 3 – Collapsible Sidebar**
9. Create `/components/Sidebar.tsx` with placeholder text, import into `Shell`.
10. Add collapse/expand state with toggle button.
11. Add smooth transition animation for collapse.
12. Style sidebar with glassmorphic background, blur, and shadows.

---

### **Phase 4 – Map Setup**
13. Install Mapbox GL JS.
14. Create `/components/Map.tsx` with Mapbox dark style, verify map renders.
15. Adjust road/label colors to match Neo-Night palette, test styles.
16. Make map fill right column in Shell layout.

---

### **Phase 5 – Restaurant Data Rendering**
17. Add dummy restaurant array (`name`, `coordinates`, `rating`, `vibeRating`) in `Map.tsx`.
18. Render Mapbox markers for each restaurant.
19. Make marker click log restaurant name to console.

---

### **Phase 6 – Popup Component**
20. Create `/components/RestaurantPopup.tsx` with props: `name`, `rating`, `vibeRating`, `tags`, `image`, `review`.
21. Integrate popup into marker click.
22. Add glassmorphic + glow styling to popup.
23. Display rating and vibeRating separately with distinct icons.

---

### **Phase 7 – Sidebar Content**
24. Add search bar to Sidebar, log query on change.
25. Add filter chips for dummy tags, log selection.
26. Add dummy restaurant list to Sidebar with name, rating, vibeRating, tags.
27. Clicking a restaurant recenters map.

---

### **Phase 8 – Geolocation**
28. Add "Locate Me" button in map that logs location.
29. Pan map to user location when found.

---

### **Phase 9 – Admin Form**
30. Create `/components/AdminForm.tsx` with inputs for name, review, tags, rating, vibeRating, image URL.
31. Render AdminForm in `/pages/admin/index.tsx`.
32. Style form with Tailwind.
33. Add validation: required fields and rating/vibeRating range 1–5.

---

### **Phase 10 – Backend Integration**
34. Install MongoDB driver.
35. Create `/lib/db.ts` to connect to MongoDB, test with dummy query.
36. Create `/api/restaurants/get.ts` to return all restaurants, test with fetch.
37. Create `/api/restaurants/post.ts` to add restaurant, validate rating/vibeRating, test with POST.
38. Replace dummy data in Map + Sidebar with API data.

---

### **Phase 11 – Filtering & Sorting**
39. Connect search bar to filter results from API.
40. Connect tag chips to API filter.
41. Add sort-by-vibeRating to Sidebar list.

---

✅ After Phase 11, MVP includes:
- Neo-Night theme
- Collapsible sidebar
- Search/filter/sort
- Ratings + vibeRating
- Map markers + popups
- Admin add restaurants
- MongoDB backend