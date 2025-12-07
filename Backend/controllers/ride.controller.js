import { validationResult } from "express-validator";
import {
  confirmRideService,
  createRideService,
  endRideService,
  getFareService,
  startRideService,
} from "../services/ride.service.js";
import {
  getCaptainsInTheRadius,
} from "../services/maps.service.js";
import { sendMessageToSocketId } from "../socket.js";
import rideModel from "../models/ride.model.js";

export const createRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { pickup, destination, vehicleType, pickupCoords, destinationCoords } = req.body;
  console.log(
    pickup,
    destination,
    vehicleType,
    pickupCoords,
    destinationCoords,
    "ride details in create ride backend..."
  );

  try {
    const ride = await createRideService({
      user: req.user._id,
      pickup,
      destination,
      vehicleType,
      pickupCoords,
      destinationCoords,
    });

    console.log(ride,"from controller backend...");
    
    if (!pickupCoords) {
      return res.status(400).json({ message: "Pickup coordinates missing" });
    }

    const captainsInRadius = await getCaptainsInTheRadius(
      pickupCoords.lng,
      pickupCoords.lat,
      7000,
      vehicleType
    );

    console.log(captainsInRadius, "captains controller backend....");

    ride.otp = "";

    const rideWithUser = await rideModel
      .findOne({ _id: ride._id })
      .populate("user");

    captainsInRadius.map((captain) => {
      console.log(captain.socketId);

      sendMessageToSocketId(captain.socketId, {
        event: "new-ride",
        data: { rideWithUser, pickupCoords, destinationCoords },
      });
    });

    res.status(201).json({
      ride,
      captains: captainsInRadius.map((captain) => ({
        id: captain._id,
        location: captain.location?.coordinates,
      })),
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
};

export const getFare = async (req, res) => {
  // console.log("QUERY RECEIVED:", req.query);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { pickupCoords, destinationCoords } = req.query;

  console.log(pickupCoords, destinationCoords, "pick and drop");

  try {
    const fare = await getFareService(pickupCoords, destinationCoords);
    return res.status(200).json(fare);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const confirmRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rideId } = req.body;

  try {
    const ride = await confirmRideService({
      rideId,
      captain: req.captain,
    });

    sendMessageToSocketId(ride.user.socketId, {
      event: "ride-confirmed",
      data: ride,
    });
    //remove OTP for captain before sending response
    const captainSafeRide = ride.toObject();
    delete captainSafeRide.otp;

    return res.status(200).json(captainSafeRide);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
};

export const startRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rideId, otp } = req.query;

  try {
    const ride = await startRideService({
      rideId,
      otp,
      captain: req.captain,
    });

    console.log(ride);

    sendMessageToSocketId(ride.user.socketId, {
      event: "ride-started",
      data: ride,
    });

    return res.status(200).json(ride);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const endRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rideId } = req.body;

  try {
    const ride = await endRideService({ rideId, captain: req.captain });

    sendMessageToSocketId(ride.user.socketId, {
      event: "ride-ended",
      data: ride,
    });

    return res.status(200).json(ride);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  s;
};
