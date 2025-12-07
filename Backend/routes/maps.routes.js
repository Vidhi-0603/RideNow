import express from "express";
import { authCaptain, authUser } from "../middlewares/auth.middleware.js";
const router = express.Router();
import { query } from "express-validator";
import { getAutoCompleteSuggestions, getDistanceTime } from "../controllers/maps.controller.js";


router.get(
  "/get-distance-time",
  [
    query("origin[lat]")
      .exists()
      .withMessage("origin[lat] is required")
      .isFloat({ min: -90, max: 90 })
      .withMessage("origin[lat] must be valid")
      .toFloat(),

    query("origin[lng]")
      .exists()
      .withMessage("origin[lng] is required")
      .isFloat({ min: -180, max: 180 })
      .withMessage("origin[lng] must be valid")
      .toFloat(),
    query("destination[lat]")
      .exists()
      .withMessage("destination[lat] is required")
      .isFloat({ min: -90, max: 90 })
      .withMessage("destination[lat] must be valid")
      .toFloat(),

    query("destination[lng]")
      .exists()
      .withMessage("destination[lng] is required")
      .isFloat({ min: -180, max: 180 })
      .withMessage("destination[lng] must be valid")
      .toFloat(),
  ],
  authCaptain,
  getDistanceTime
);

router.get(
  "/get-suggestions",
  authUser,
  [
    query("address").notEmpty().withMessage("Address is required"),
    query("address")
      .isString()
      .isLength({ min: 3 })
      .withMessage("Address must be 3 characters long"),
  ],
  getAutoCompleteSuggestions
);

export default router;
