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

const getDistance = (lat1, lon1, lat2, lon2) => {
  //convert GPS coords (degrees) to radians
  const toRad = (v) => (v * Math.PI) / 180;
  const R = 6371; // Earth's average radius in km

  //difference in both latitudes and longitudes
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  //angular distance between two points on earth
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  //convert angular distance into kms
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};


export const getSuggestions = async (address, userLat, userLng) => {
  if (!address) {
    throw new Error("query is required");
  }

  const API_KEY = process.env.GEOAPIFY_API_KEY;
  const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
    address
  )}&apiKey=${API_KEY}`;

  try {
    const res = await axios.get(url);

    if (!res.data || !res.data?.features) return [];

    const places = res.data.features.map((f) => {
      const lat = f.properties.lat;
      const lng = f.properties.lon;

      return {
        description: f.properties.formatted,
        lat,
        lng,
        distance: userLat && userLng ? getDistance(userLat, userLng, lat, lng) : null,
      };
    });

    // return res.data.features.map((feature) => ({
    //   description: feature.properties.formatted,
    //   lat: feature.properties.lat,
    //   lng: feature.properties.lon,
    // }));

    return places.sort((a,b)=> a.distance - b.distance)
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
