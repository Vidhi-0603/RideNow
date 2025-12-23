<<<<<<< HEAD

# 🚗 RideNow

A full-featured ride-hailing application built with the MERN stack that replicates core Uber functionalities. RideNow allows users to book rides and captains (drivers) to accept and fulfill ride requests in real-time with live location tracking and interactive maps.

-[Landing Page](https://github.com/Vidhi-0603/UberClone/blob/main/Screenshot%202025-09-27%20123746.png)

## ✨ Features

### For Riders (Users)

- 🔐 Secure authentication and registration
- 🗺️ Interactive map interface with Leaflet
- 📍 Real-time location-based ride booking
- 🔍 Address autocomplete and suggestions
- 💰 Instant fare estimation before booking
- 🚕 View nearby available captains on the map
- 📱 Live captain location tracking during rides
- 🔢 OTP-based ride verification
- 📊 Ride history and details
- 🎯 Route visualization and turn-by-turn directions

### For Captains (Drivers)

- 🔐 Secure authentication with vehicle details
- 🗺️ Interactive captain dashboard with map view
- 📬 Real-time ride request notifications
- ✅ Accept or decline ride requests
- 🧭 Optimized routing to pickup and drop locations
- 🔢 OTP verification system
- 📍 Automatic location updates via WebSocket
- 💵 Earnings tracking
- 🕐 Ride history management

### Core Capabilities

- ⚡ Real-time bidirectional communication with Socket.IO
- 🗺️ Free and open-source mapping with **Leaflet**
- 🌍 Geocoding and routing powered by **Geoapify API**
- 📍 Live location tracking and updates
- 🔒 JWT-based authentication
- 🍪 Secure cookie-based sessions
- 📱 Responsive design for mobile and desktop
- ✨ Smooth animations with GSAP

## 🛠️ Tech Stack

### Frontend

- **React** - UI library for building interactive interfaces
- **Leaflet** - Open-source JavaScript library for interactive maps
- **React-Leaflet** - React components for Leaflet maps
- **Context API** - State management
- **Axios** - HTTP client for API requests
- **Socket.IO Client** - Real-time WebSocket communication
- **GSAP** - Animation library
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Socket.IO** - Real-time bidirectional communication
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing
- **cookie-parser** - Cookie parsing middleware
- **cors** - Cross-Origin Resource Sharing
- **dotenv** - Environment variable management

### External APIs

- **Geoapify Geocoding API** - Convert addresses to coordinates
- **Geoapify Routing API** - Calculate routes, distances, and travel times
- **Geoapify Places API** - Address autocomplete and suggestions

---

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Geoapify API Key (free tier available at [Geoapify](https://www.geoapify.com/))

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Vidhi-0603/RideNow.git
cd RideNow
```

### 2. Backend Setup

```bash
cd Backend
npm install
```

Create a `.env` file in the Backend folder:

```env
PORT=4000
FRONTEND_URL=your_frontend_url
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GEOAPIFY_API_KEY=your_geoapify_api_key
```

Start the backend server:

<<<<<<< HEAD

```bash
npm start
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd Frontend
npm install
```

Create a `.env` file in the Frontend folder:

```env
VITE_BASE_URL=your_backend_url
```

Start the frontend development server:

```bash
npm start
```

The frontend will run on `http://localhost:3000`

## 📁 Project Structure

=======

## Project Structure

```
RideNow/
│
├── Backend/
│   ├── controllers/        # Request handlers
│   ├── models/            # Database schemas
│   ├── routes/            # API routes
│   ├── services/          # Business logic & external API calls
│   ├── middlewares/       # Authentication & validation
│   ├── config/            # Configuration files
│   ├── app.js             # Express app setup
│   └── server.js          # Server entry point
│
├── Frontend/
│   ├── src/
│   │   ├── components/    # Reusable React components
│   │   ├── pages/         # Page components
│   │   ├── context/       # Context API providers
│   │   ├── auth/          # Authentication utilities
│   │   ├── api/           # API service functions
│   │   └── utils/         # Helper functions
│   ├── public/
│   └── package.json
│
└── README.md
```

## 🔑 API Endpoints

### Authentication

- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get user profile
- `GET /api/users/logout` - User logout
- `POST /api/captains/register` - Register new captain
- `POST /api/captains/login` - Captain login
- `GET /api/captains/profile` - Get captain profile
- `GET /api/captains/logout` - Captain logout

### Rides

- `POST /api/rides/create` - Create new ride request
- `GET /api/rides/get-fare` - Calculate ride fare
- `POST /api/rides/confirm` - Confirm ride by captain
- `GET /api/rides/start-ride` - Start ride with OTP
- `POST /api/rides/end-ride` - Complete ride

### Maps & Location

- `GET /api/maps/get-distance-time` - Calculate distance and time
- `GET /api/maps/get-suggestions` - Get address suggestions

## 🗺️ Geoapify Integration

RideNow uses Geoapify's free APIs for all mapping and location features:

## 🔄 Real-Time Features

RideNow uses Socket.IO for real-time communication:

### WebSocket Events

- `join` - User/Captain joins their room
- `update-location-captain` - Captain sends location updates
- `ride-requested` - Notify captains of new ride requests
- `ride-confirmed` - Notify user when captain accepts
- `ride-started` - Notify user when ride begins
- `ride-ended` - Notify both parties when ride completes

## 📱 Screenshots

### User Interface

- Landing page with call-to-action
- User/Captain authentication
- Interactive map with real-time location
- Ride booking flow with fare estimation
- Live tracking during rides

### Captain Interface

- Captain dashboard with nearby ride requests
- Accept/decline ride interface
- Navigation to pickup and drop locations
- OTP verification screen
- Ride completion interface

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

## 🔒 Security Features

- Password hashing with bcrypt
- JWT-based authentication
- HTTP-only cookies for session management
- Protected API routes with middleware
- Input validation and sanitization
- CORS configuration for secure cross-origin requests

## 🎯 Future Enhancements

- [ ] Payment gateway integration
- [ ] Ride rating and review system
- [ ] Push notifications
- [ ] Ride scheduling
- [ ] Multi-stop rides
- [ ] Ride sharing options

---

## Author

[Vidhi-0603](https://github.com/Vidhi-0603)

---

## 🙏 Acknowledgments

- [Leaflet](https://leafletjs.com/) - Open-source mapping library
- [Geoapify](https://www.geoapify.com/) - Free geocoding and routing APIs
- [Socket.IO](https://socket.io/) - Real-time communication
- Inspired by Uber's ride-hailing platform

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
