import axios from "axios";
import captainModel from "../models/captain.model.js";

export const getDistanceAndTime = async (origin, destination) => {
  const api_key = process.env.GEOAPIFY_API_KEY;

  const formatLocation = (loc) => {
    if (typeof loc === "string") return encodeURIComponent(loc);
    if (typeof loc === "object" && loc.lat && loc.lng)
      return `${loc.lat},${loc.lng}`;
    throw new Error("Invalid location format");
  };

  const originParam = formatLocation(origin);
  const destinationParam = formatLocation(destination);

  console.log(originParam, destinationParam, "params...");

  const url = `https://api.geoapify.com/v1/routing?waypoints=${originParam}|${destinationParam}&mode=drive&apiKey=${api_key}`;
  try {
    const { data } = await axios.get(url);
    console.log(data, "distance res...");

    if (!data?.features?.[0]?.properties) {
      throw new Error("Invalid routing response");
    }

    const props = data.features[0].properties;
    console.log("distance: ", props.distance, "Time: ", props.time);

    return {
      distance: {
        text: (props.distance / 1000).toFixed(1) + " km",
        value: props.distance,
      },
      duration: {
        text: Math.round(props.time / 60) + " mins",
        value: props.time,
      },
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getSuggestions = async (address) => {
  if (!address) {
    throw new Error("query is required");
  }

  const API_KEY = process.env.GEOAPIFY_API_KEY;
  const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
    address
  )}&apiKey=${API_KEY}`;

  try {
    const res = await axios.get(url);

    if (!res.data || !res.data.features) return [];

    return res.data.features.map((feature) => ({
      description: feature.properties.formatted,
      lat: feature.properties.lat,
      lng: feature.properties.lon,
    }));
  } catch (err) {
    console.error("Geoapify error:", err);
    return [];
  }
};

export const getCaptainsInTheRadius = async (
  lng,
  lat,
  radiusMeters,
  vehicleType
) => {
  // radius in km
  const radiusInRadians = (radiusMeters / 1000) / 6371;

  console.log(lat, lng, "pickupCoords...");

  const captains = await captainModel.find({
    location: {
      $geoWithin: {
        $centerSphere: [[lng, lat], radiusInRadians],
      },
    },
    "vehicle.vehicleType": vehicleType,
  });

  return captains;
};
