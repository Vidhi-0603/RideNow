# UberClone Backend

## Overview

This backend powers the UberClone ride-hailing app, providing REST APIs for user and captain management, ride creation, geolocation, and real-time updates. It integrates Google Maps APIs for geocoding, distance calculation, and address suggestions.

---

## Environment Setup

- **Google Maps API Key:**  
  Set your API key in `.env` as `GOOGLE_MAPS_API_KEY=your-google-maps-api-key`.
- **MongoDB URI:**  
  Set your database URI in `.env` as `MONGO_URI=mongodb://localhost:27017/UBERCLONE`.

---

## Models

- **User (`models/user.model.js`):**  
  Stores rider details (name, email, password, etc.).
- **Captain (`models/captain.model.js`):**  
  Stores captain details, vehicle info, and location as GeoJSON (`location: { type: "Point", coordinates: [lng, lat] }`).
- **Ride (`models/ride.model.js`):**  
  Stores ride details, including pickup, destination, fare, user, captain, and status.
- **Blacklist (`models/blacklist.model.js`):**  
  Stores blacklisted JWT tokens for logout and security.

---

## Authentication Middleware

- **`middlewares/auth.middleware.js`:**
  - `authUser`: Protects user routes, checks JWT in cookies, verifies token, and checks blacklist.
  - `authCaptain`: Protects captain routes, checks JWT in cookies, verifies token, and checks blacklist.

---

## Google Maps API Integration

- **Distance & Time Calculation:**
  - **Service:** `services/maps.service.js` (`getDistanceAndTime`)
  - **Usage:** Returns distance and estimated travel time between two points.

- **Nearby Captains:**
  - **Service:** `services/maps.service.js` (`getCaptainsInTheRadius`)
  - **Usage:** Finds captains within a radius (km) of a location using MongoDB geospatial queries.

- **Address Suggestions:**
  - **Service:** `services/maps.service.js` (`getSuggestions`)
  - **Usage:** Returns autocomplete suggestions for entered addresses.

---

## Routes

### User Routes (`routes/user.routes.js`)

- `POST /user/register` — Register a new rider.
- `POST /user/login` — Login rider and issue JWT.
- `GET /user/profile` — Get rider profile (protected).
- `POST /user/logout` — Logout rider (blacklist token).

### Captain Routes (`routes/captain.routes.js`)

- `POST /captain/register` — Register a new captain.
- `POST /captain/login` — Login captain and issue JWT.
- `GET /captain/profile` — Get captain profile (protected).
- `POST /captain/logout` — Logout captain (blacklist token).

### Ride Routes (`routes/ride.routes.js`)

- `POST /ride/create-ride` — Create a new ride (user books a ride).
- `GET /ride/get-fare` — Get fare estimate for a ride.
- `POST /ride/confirm` — Confirm ride by captain.
- `POST /ride/start-ride` — Start the ride (with OTP).
- `POST /ride/end-ride` — End the ride.

### Maps Routes (`routes/maps.routes.js`)

- `GET /maps/get-distance-time` — Get distance and time between two locations.
- `GET /maps/get-suggestions` — Get address autocomplete suggestions.

---

## How to Use

- **Register/Login:**  
  Use `/user/register` or `/captain/register` to create accounts. Login via `/user/login` or `/captain/login`.
- **Protected Routes:**  
  Access profile and ride actions only with valid JWT (handled by auth middlewares).
- **Create Ride:**  
  User creates a ride, backend finds nearby captains and calculates fare.
- **Confirm/Start/End Ride:**  
  Captain confirms, starts, and ends rides via respective endpoints.
- **Location & Maps:**  
  Use maps endpoints to fetch coordinates, distance, time, and suggestions for addresses.

---

## Real-Time Location Updates

- **Socket (`socket.js`):**  
  Captains update their location in real-time via socket events (`update-location-captain`), which updates their GeoJSON location in MongoDB.

---

## Example API Usage

- **Get Distance & Time:**
  ```
  GET /maps/get-distance-time?origin=12.9716,77.5946&destination=13.0827,80.2707
  Response: { distance: "350 km", duration: "6 hours" }
  ```
- **Get Suggestions:**
  ```
  GET /maps/get-suggestions?address=MG Road
  Response: [ "MG Road, Bengaluru", ... ]
  ```

---

## Troubleshooting

- Ensure your `.env` file has correct API keys and MongoDB URI.
- Check CORS settings in `app.js` for frontend-backend communication.
- Use correct field names and data formats for location queries.

---

For more details, see the source files in `controllers/`, `services/`, and `routes/`.