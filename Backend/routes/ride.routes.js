import express from "express";
const router = express.Router();
import { body, query } from "express-validator";
import { authCaptain, authUser } from "../middlewares/auth.middleware.js";
import {
  confirmRide,
  createRide,
  endRide,
  getFare,
  startRide,
} from "../controllers/ride.controller.js";

router.post(
  "/create-ride",
  authUser,
  body("pickup")
    .isString()
    .isLength({ min: 3 })
    .withMessage("Invalid pickup address"),
  body("destination")
    .isString()
    .isLength({ min: 3 })
    .withMessage("Invalid destination address"),
  body("vehicleType")
    .isString()
    .isIn(["Auto", "Car", "Motorcycle"])
    .withMessage("Invalid vehicle type"),
  body("pickupCoords.lat").exists().isFloat(),
  body("pickupCoords.lng").exists().isFloat(),
  body("destinationCoords.lat").exists().isFloat(),
  body("destinationCoords.lng").exists().isFloat(),
  createRide
);

router.get(
  "/get-fare",
  authUser,

  query("pickupCoords[lat]")
    .exists()
    .withMessage("pickupCoords[lat] is required")
    .isFloat({ min: -90, max: 90 })
    .withMessage("pickupCoords[lat] must be valid")
    .toFloat(),

  query("pickupCoords[lng]")
    .exists()
    .withMessage("pickupCoords[lng] is required")
    .isFloat({ min: -180, max: 180 })
    .withMessage("pickupCoords[lng] must be valid")
    .toFloat(),

  query("destinationCoords[lat]")
    .exists()
    .withMessage("destinationCoords[lat] is required")
    .isFloat({ min: -90, max: 90 })
    .withMessage("destinationCoords[lat] must be valid")
    .toFloat(),

  query("destinationCoords[lng]")
    .exists()
    .withMessage("destinationCoords[lng] is required")
    .isFloat({ min: -180, max: 180 })
    .withMessage("destinationCoords[lng] must be valid")
    .toFloat(),

  getFare
);


router.post(
  "/confirm",
  authCaptain,
  body("rideId").isMongoId().withMessage("Invalid ride id"),
  confirmRide
);

router.get(
  "/start-ride",
  authCaptain,
  query("rideId").isMongoId().withMessage("Invalid ride id"),
  query("otp")
    .isString()
    .isLength({ min: 6, max: 6 })
    .withMessage("Invalid OTP"),
  startRide
);

router.post(
  "/end-ride",
  authCaptain,
  body("rideId").isMongoId().withMessage("Invalid ride id"),
  endRide
);

export default router;
