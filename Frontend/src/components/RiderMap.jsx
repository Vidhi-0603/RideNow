import React, { useEffect, useState, useRef, useContext } from "react";
import { SocketDataContext } from "../context/SocketContext";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import { Polyline } from "react-leaflet";

const defaultIcon = L.icon({
  iconUrl,
  iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const RiderMap = ({
  ride = null,
  user,
  nearbyCaptains = [],
  showCaptains = false,
  captainFound = false,
  isrideStarted = false,
  pickupCoords = null,
  destinationCoords = null,
  ConfirmRide = false,
}) => {
  const { socket } = useContext(SocketDataContext);

  const [riderPosition, setriderPosition] = useState({
    lat: 28.6139,
    lng: 77.209,
  });
  const [driverPosition, setDriverPosition] = useState(null);
  const [routeCoords, setRouteCoords] = useState(null);

  const riderRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef({
    rider: null,
    pickup: null,
    destination: null,
    driver: null,
    captains: [],
    route: null,
  });

  //Initialize Leaflet Map
  useEffect(() => {
    if (!mapRef.current && riderRef.current) {
      mapRef.current = L.map(riderRef.current).setView(
        riderPosition || { lat: 28.6139, lng: 77.209 },
        16
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(mapRef.current);
    }
  }, []);

  //live user location
  useEffect(() => {
    if (!user || !navigator.geolocation) return;
    socket.emit("join", { userId: user._id, userType: "user" });

    let bestAccuracy = Infinity;
    const handlePos = (pos) => {
      const { latitude, longitude, accuracy } = pos.coords;
      // Ignore very bad accuracy (> 300m)
      if (accuracy > 300) {
        console.log("⚠ Ignoring bad GPS reading:", accuracy);
        return;
      }
      // Only update if accuracy is better than last known
      if (accuracy < bestAccuracy) {
        bestAccuracy = accuracy;
        setriderPosition({ lat: latitude, lng: longitude });
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
  }, [user, socket]);

  //Rider Marker
  useEffect(() => {
    if (!mapRef.current) return;
    if (ConfirmRide) {
      if (markersRef.current.rider) {
        mapRef.current.removeLayer(markersRef.current.rider);
        markersRef.current.rider = null;
      }
      return;
    }

    if (!ConfirmRide && !captainFound) {
      if (!markersRef.current.rider) {
        markersRef.current.rider = L.marker(riderPosition, {
          icon: defaultIcon,
        })
          .addTo(mapRef.current)
          .bindPopup("You");
      } else {
        markersRef.current.rider.setLatLng(riderPosition);
      }
      mapRef.current.panTo(riderPosition);
    }
  }, [riderPosition, captainFound, ConfirmRide]);

  //Pickup Marker
  useEffect(() => {
    if (!mapRef.current) return;
    // remove if cancelled
    if (!ConfirmRide) {
      if (markersRef.current.pickup) {
        mapRef.current.removeLayer(markersRef.current.pickup);
        markersRef.current.pickup = null;
      }
      return;
    }

    if (!pickupCoords) return;

    if (!markersRef.current.pickup && ConfirmRide) {
      markersRef.current.pickup = L.marker(pickupCoords, { icon: defaultIcon })
        .addTo(mapRef.current)
        .bindPopup("Pickup");
    } else {
      markersRef.current.pickup.setLatLng(pickupCoords);
    }
    mapRef.current.panTo(pickupCoords);
  }, [pickupCoords, ConfirmRide]);

  //when pickup changes
  useEffect(() => {
    console.log(pickupCoords, ConfirmRide);
  }, [pickupCoords, ConfirmRide]);

  //Show nearby captains...
  useEffect(() => {
    if (!mapRef.current || !showCaptains || captainFound) return;

    markersRef.current.captains.forEach((m) => {
      mapRef.current.removeLayer(m);
    });
    markersRef.current.captains = [];

    console.log(nearbyCaptains, "captains...");

    nearbyCaptains.forEach((cap) => {
      if (!cap.location) return;
      const lat = cap.location[1];
      const lng = cap.location[0];

      const m = L.marker([lat, lng], { icon: defaultIcon })
        .addTo(mapRef.current)
        .bindPopup("Captain");
      markersRef.current.captains.push(m);
    });
  }, [nearbyCaptains, showCaptains, captainFound]);

  //Driver position when CaptainFound is true
  useEffect(() => {
    if (!captainFound || !ride?.captain?.location) return;

    const [Lng, Lat] = ride.captain.location.coordinates;
    const driverPos = { lat: Number(Lat), lng: Number(Lng) };
    setDriverPosition(driverPos);

    if (!markersRef.current.driver) {
      markersRef.current.driver = L.marker(driverPos, { icon: defaultIcon })
        .addTo(mapRef.current)
        .bindPopup("Driver");
    } else {
      markersRef.current.driver.setLatLng(driverPos);
    }
  }, [captainFound, JSON.stringify(ride?.captain?.location)]);

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

  //fetch route directions
  useEffect(() => {
    if (!driverPosition || !captainFound) return;

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
          mapRef.current.fitBounds(leafletCoords);
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
    captainFound,
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
    mapRef.current.fitBounds(polyline.getBounds());
  }, [routeCoords]);

  if (!riderPosition && !pickupCoords) return <p>Loading map...</p>;

  return (
    <div
      ref={riderRef}
      style={{ width: "inherit", height: "inherit", zIndex: "0" }}
    ></div>
  );
};
export default RiderMap;
