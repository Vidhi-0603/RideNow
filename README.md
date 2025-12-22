# RideNow

## Overview

RideNow is a full-stack ride-hailing application inspired by Uber, allowing riders (users) to book rides and captains (drivers) to accept and complete them. The project now uses **free and open-source mapping and geolocation services** (Leaflet, Geoapify) for real-time location tracking, route visualization, and secure authentication for both roles.

---

## Features

- **User & Captain Registration/Login:**  
  Secure authentication for riders and captains.
- **Ride Booking:**  
  Riders can search for destinations, view fare estimates, and book rides.
- **Captain Discovery:**  
  Nearby captains are shown on the map when a ride is requested.
- **Real-Time Location Tracking:**  
  Captains update their location via sockets; riders see captain movement live.
- **Route & Directions:**  
  Maps and directions are rendered using **Leaflet** and **Geoapify APIs**.
- **Ride Lifecycle:**  
  Includes ride confirmation, start (with OTP), and end.
- **Address Suggestions:**  
  Autocomplete and geocoding now powered by **Geoapify Places API**.
- **Fare Calculation:**  
  Distance and time calculations use **Geoapify Routing API**.

---

## Tech Stack

### Frontend
- **React** ![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
- **Leaflet (Maps Rendering)** ![Leaflet](https://img.shields.io/badge/Leaflet-4A9FCE?style=for-the-badge&logo=leaflet&logoColor=white)
- **Context API** ![Context API](https://img.shields.io/badge/ContextAPI-ff69b4?style=for-the-badge)
- **GSAP (Animations)** ![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge)

### Backend
- **Node.js** ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
- **Express** ![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
- **MongoDB (Mongoose)** ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
- **Socket.io** ![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)
- **Geoapify APIs** ![Geoapify](https://img.shields.io/badge/Geoapify-FF6D00?style=for-the-badge)

### Other Technologies
- **JWT (Authentication)** ![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white)
- **Cookie-based Sessions**
- **CORS (Cross-Origin Requests)**

---

## API Integrations

- **Leaflet:**  
  Renders interactive maps for riders and captains.
- **Geoapify Geocoding API:**  
  Converts addresses to latitude/longitude.
- **Geoapify Routing API:**  
  Calculates distance, estimated time, and routes between locations.
- **Geoapify Places API:**  
  Provides address autocomplete suggestions.

---

## Project Structure
```
UberClone/
│
├── Backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── middlewares/
│   ├── config/
│   ├── app.js
│   ├── server.js
│   └── README.md
│
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── auth/
│   │   ├── api/
│   │   └── utils/
│   ├── public/
│   ├── package.json
│   └── README.md
│
├── README.md

```
---

## Screenshots

- [Landing Page](https://github.com/Vidhi-0603/UberClone/blob/main/Screenshot%202025-09-27%20123746.png)  
- [User Login Page](https://github.com/Vidhi-0603/UberClone/blob/main/Screenshot%202025-09-27%20123811.png)  
- [Captain Login Page](https://github.com/Vidhi-0603/UberClone/blob/main/Screenshot%202025-09-27%20124124.png)  
- [Location Search Suggestions](https://github.com/Vidhi-0603/UberClone/blob/main/Screenshot%202025-09-27%20132540.png)  
- [Rider Home Page](https://github.com/Vidhi-0603/UberClone/blob/main/Screenshot%202025-09-27%20131232.png)  
- [Nearby Captains](https://github.com/Vidhi-0603/UberClone/blob/main/Screenshot%202025-09-27%20143019.png)  
- [Location Tracking](https://github.com/Vidhi-0603/UberClone/blob/main/Screenshot%202025-09-27%20132846.png)  

**Mobile View:**  
- [Waiting For Captain](https://github.com/Vidhi-0603/UberClone/blob/main/Screenshot%202025-09-27%20132927.png)  
- [Sharing OTP](https://github.com/Vidhi-0603/UberClone/blob/main/Screenshot%202025-09-27%20133010.png)  
- [Live Ride Location After Ride Started](https://github.com/Vidhi-0603/UberClone/blob/main/Screenshot%202025-09-27%20133103.png)  
- [Location Tracing](https://github.com/Vidhi-0603/UberClone/blob/main/Screenshot%202025-09-27%20133112.png)  
- [Ride Details After Completion](https://github.com/Vidhi-0603/UberClone/blob/main/Screenshot%202025-09-27%20133123.png)  

---

## Author
[Vidhi-0603](https://github.com/Vidhi-0603)

---

## License
MIT

---

## Additional Resources

- [Backend Documentation](./Backend/README.md)  
- [Frontend Documentation](./Frontend/README.md)

---

## Getting Started

1. Clone the repository.
2. Set up `.env` files in both `Backend` and `Frontend` folders with your **Geoapify API key** and **MongoDB URI**.
3. Install dependencies in both folders:
   ```bash
   cd Backend && npm install
   cd ../Frontend && npm install
   ```
