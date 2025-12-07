import rideModel from "../models/ride.model.js";
import { getDistanceAndTime } from "./maps.service.js";
import crypto from "crypto";

export const getFareService = async (pickupCoords, destinationCoords) => {
  if (!pickupCoords || !destinationCoords) {
    throw new Error("Pickup and destination are required");
  }

  const distanceTime = await getDistanceAndTime(pickupCoords, destinationCoords);

  const baseFare = {
    Auto: 30,
    Car: 50,
    Motorcycle: 20,
  };

  const perKmRate = {
    Auto: 10,
    Car: 15,
    Motorcycle: 8,
  };

  const perMinuteRate = {
    Auto: 2,
    Car: 3,
    Motorcycle: 1.5,
  };

  const fare = {
    Auto: Math.round(
      baseFare.Auto +
        (distanceTime.distance.value / 1000) * perKmRate.Auto +
        (distanceTime.duration.value / 60) * perMinuteRate.Auto
    ),
    Car: Math.round(
      baseFare.Car +
        (distanceTime.distance.value / 1000) * perKmRate.Car +
        (distanceTime.duration.value / 60) * perMinuteRate.Car
    ),
    Motorcycle: Math.round(
      baseFare.Motorcycle +
        (distanceTime.distance.value / 1000) * perKmRate.Motorcycle +
        (distanceTime.duration.value / 60) * perMinuteRate.Motorcycle
    ),
  };

  return fare;
};

function getOtp(num) {
  function generateOtp(num) {
    const otp = crypto
      .randomInt(Math.pow(10, num - 1), Math.pow(10, num))
      .toString();
    return otp;
  }
  return generateOtp(num);
}

export const createRideService = async ({
  user,
  pickup,
  destination,
  vehicleType,
  pickupCoords,
  destinationCoords,
}) => {
  if (!user || !pickup || !destination || !vehicleType || !pickupCoords || !destinationCoords) {
    throw new Error("All fields are required");
  }

  const fare = await getFareService(pickupCoords, destinationCoords);
  console.log(fare,"fare", fare[vehicleType]);
  
  const ride = rideModel.create({
    user,
    pickup,
    destination,
    otp: getOtp(6),
    fare: fare[vehicleType],
  });

  return ride;
};

export const confirmRideService = async ({ rideId, captain }) => {
  if (!rideId) {
    throw new Error("Ride id is required");
  }

  await rideModel.findOneAndUpdate(
    {
      _id: rideId,
    },
    {
      status: "accepted",
      captain: captain._id,
    }
  );

  const ride = await rideModel
    .findOne({
      _id: rideId,
    })
    .populate("user")
    .populate("captain")
    .select("+otp");

  if (!ride) {
    throw new Error("Ride not found");
  }

  return ride;
};

export const startRideService = async ({ rideId, otp, captain }) => {
  if (!rideId || !otp) {
    throw new Error("Ride id and OTP are required");
  }

  const ride = await rideModel
    .findOne({
      _id: rideId,
    })
    .populate("user")
    .populate("captain")
    .select("+otp");

  if (!ride) {
    throw new Error("Ride not found");
  }

  if (ride.status !== "accepted") {
    throw new Error("Ride not accepted");
  }

  if (ride.otp !== otp) {
    throw new Error("Invalid OTP");
  }

  await rideModel.findOneAndUpdate(
    {
      _id: rideId,
    },
    {
      status: "ongoing",
    }
  );

  return ride;
};

export const endRideService = async ({ rideId, captain }) => {
  if (!rideId) {
    throw new Error("Ride id is required");
  }

  const ride = await rideModel
    .findOne({
      _id: rideId,
      captain: captain._id,
    })
    .populate("user")
    .populate("captain")
    .select("+otp");

  if (!ride) {
    throw new Error("Ride not found");
  }

  if (ride.status !== "ongoing") {
    throw new Error("Ride not ongoing");
  }

  await rideModel.findOneAndUpdate(
    {
      _id: rideId,
    },
    {
      status: "completed",
    }
  );

  return ride;
};
