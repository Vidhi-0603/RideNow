import React, { useEffect, useState, useRef, useContext } from "react";
import { SocketDataContext } from "../context/SocketContext";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const defaultIcon = L.icon({
  iconUrl,
  iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const CaptainMap = ({
  captain,
  showRoute,
  isrideStarted = false,
  pickupCoords = null,
  destinationCoords = null,
  captainLocation = null,
}) => {
  const [driverPosition, setDriverPosition] = useState(() => {
    // Initialize with captain location if available
    if (captainLocation && Array.isArray(captainLocation)) {
      const [lng, lat] = captainLocation;
      return { lat, lng };
    }
    return { lat: 28.6139, lng: 77.209 }; // Default fallback
  });
  const [routeCoords, setRouteCoords] = useState(null);
  const [shouldFollowDriver, setShouldFollowDriver] = useState(true);
  const hasFitRoute = useRef(false);

  const { socket } = useContext(SocketDataContext); // backend URL

  const lastUpdateRef = useRef(0);
  const captainRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef({
    captain: null,
    pickup: null,
    destination: null,
    route: null,
  });

  //live driver location
  useEffect(() => {
    if (!captain || !navigator.geolocation) return;
    socket.emit("join", { userId: captain._id, userType: "captain" });

    let bestAccuracy = Infinity;
    const handlePos = (pos) => {
      const { latitude, longitude, accuracy } = pos.coords;
      // Ignore very bad accuracy (> 300m)
      if (accuracy > 300) {
        console.log("⚠ Ignoring bad GPS reading:", accuracy);
        return;
      }
      if (accuracy < bestAccuracy) {
        bestAccuracy = accuracy;
        setDriverPosition({ lat: latitude, lng: longitude });
      }

      const now = Date.now();
      // Throttle: update only if 5s passed since last emit
      if (now - lastUpdateRef.current > 5000) {
        socket.emit("update-location-captain", {
          userId: captain._id,
          location: { lat: latitude, lng: longitude },
        });
        lastUpdateRef.current = now;
      }
    };

    const handleErr = (err) => {
      console.error("Geolocation error:", err);
    };

    // First quick update
    navigator.geolocation.getCurrentPosition(handlePos, handleErr, {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0,
    });

    // Continuous accurate watch
    const watchId = navigator.geolocation.watchPosition(handlePos, handleErr, {
      enableHighAccuracy: true,
      timeout: 25000,
      maximumAge: 0,
    });

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [socket, captain]);

  //Iitialize leaflet map
  useEffect(() => {
    if (!mapRef.current && captainRef.current) {
      mapRef.current = L.map(captainRef.current).setView(
        driverPosition || { lat: 28.6139, lng: 77.209 },
        18
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 17,
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(mapRef.current);
    }
  }, []);

  //driver marker
  useEffect(() => {
    if (!mapRef.current) return;

    if (!markersRef.current.captain) {
      markersRef.current.captain = L.marker(driverPosition, {
        icon: defaultIcon,
      })
        .addTo(mapRef.current)
        .bindPopup("You");
    } else {
      markersRef.current.captain.setLatLng(driverPosition);
    }

    if (shouldFollowDriver) {
      mapRef.current.setView(driverPosition, 17, {
        animate: true,
        duration: 0.5,
      });
    }

    // mapRef.current.panTo(driverPosition);
  }, [driverPosition, shouldFollowDriver]);

  //Pickup Marker
  useEffect(() => {
    if (!mapRef.current) return;
    // remove if cancelled
    if (isrideStarted) {
      if (markersRef.current.pickup) {
        mapRef.current.removeLayer(markersRef.current.pickup);
        markersRef.current.pickup = null;
      }
      return;
    }

    if (!pickupCoords) return;

    if (!markersRef.current.pickup && !isrideStarted && showRoute) {
      markersRef.current.pickup = L.marker(pickupCoords, { icon: defaultIcon })
        .addTo(mapRef.current)
        .bindPopup("Pickup");
    } else {
      markersRef.current.pickup.setLatLng(pickupCoords);
    }
    mapRef.current.panTo(pickupCoords);
  }, [pickupCoords, isrideStarted, showRoute]);

  //destination marker
  useEffect(() => {
    if (!isrideStarted || !destinationCoords || !mapRef.current) return;

    if (!markersRef.current.destination) {
      markersRef.current.destination = L.marker(destinationCoords, {
        icon: defaultIcon,
      })
        .addTo(mapRef.current)
        .bindPopup("Destination");
    } else {
      markersRef.current.destination.setLatLng(destinationCoords);
    }
  }, [isrideStarted, destinationCoords]);

  //fetch directions..
  useEffect(() => {
    if (!driverPosition || !driverPosition.lat || !driverPosition.lng) return;
    if (!pickupCoords || !pickupCoords.lat || !pickupCoords.lng) return;
    if (!driverPosition || !showRoute) return;

    console.log("ROUTE ORIGIN:", driverPosition);
    console.log("ROUTE DEST:", pickupCoords);

    let origin = driverPosition;
    let destination = null;
    if (!isrideStarted && pickupCoords) {
      destination = pickupCoords;
    }

    if (isrideStarted && destinationCoords) {
      destination = destinationCoords;
    }

    if (!origin || !destination) return;

    const fetchRoute = async () => {
      try {
        const url = `https://router.project-osrm.org/route/v1/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson`;
        const respomse = await fetch(url);
        const data = await respomse.json();

        if (data.code === "Ok") {
          const route = data.routes[0].geometry.coordinates;
          const leafletCoords = route.map((coord) => [coord[1], coord[0]]);
          setRouteCoords(leafletCoords);
          mapRef.current.fitBounds(leafletCoords, { padding: [50, 50] });
        } else {
          console.error("Routing failed:", data.code);
        }
      } catch (err) {
        console.error("Error fetching directions:", err);
      }
    };
    fetchRoute();
  }, [
    driverPosition,
    pickupCoords,
    destinationCoords,
    showRoute,
    isrideStarted,
  ]);

  useEffect(() => {
    if (!mapRef.current || !routeCoords) return;

    // Remove old polyline
    if (markersRef.current.route) {
      mapRef.current.removeLayer(markersRef.current.route);
    }

    const polyline = L.polyline(routeCoords, {
      color: "blue", // 🔹 optional
    }).addTo(mapRef.current);

    markersRef.current.route = polyline;

    // Fit map to route

    if (!hasFitRoute.current) {
      hasFitRoute.current = true;

      // Step 1: Show full route (like Google Maps does initially)
      mapRef.current.fitBounds(polyline.getBounds(), { padding: [50, 50] });

      // Step 2: AFTER a short animation delay → shift camera to driver
      setTimeout(() => {
        setShouldFollowDriver(true);
        mapRef.current.setView(driverPosition, 17, {
          animate: true,
        });
      }, 600); // small delay so fitBounds completes first
    }
  }, [routeCoords, driverPosition]);

  useEffect(() => {
    if (!mapRef.current) return;

    mapRef.current.on("dragstart", () => {
      setShouldFollowDriver(false);
    });

    return () => {
      mapRef.current.off("dragstart");
    };
  }, []);

  useEffect(() => {
    if (isrideStarted) {
      hasFitRoute.current = false;
      setShouldFollowDriver(true);
    }
  }, [isrideStarted]);

  if (!driverPosition) return <p>Loading map...</p>;

  return (
    <div
      ref={captainRef}
      style={{ width: "inherit", height: "inherit", zIndex: "0" }}
    ></div>
  );
};

export default CaptainMap;
