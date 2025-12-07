import { validationResult } from "express-validator";
import captainModel from "../models/captain.model.js";
import { createCaptain } from "../services/captain.service.js";
import { cookieOptions } from "../config/jwtToken.config.js";
import blacListTokenModel from "../models/blacklist.model.js";

export const registerCaptain = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { firstname, lastname, email, password, color, plate, capacity, type } =
    req.body;

  const captainExists = await captainModel.findOne({ email });
  if (captainExists) {
    return res.status(400).json({ message: "Captain already exists" });
  }

  const hashedPassword = await captainModel.hashPassword(password);
  const captain = await createCaptain(
    firstname,
    lastname,
    email,
    hashedPassword,
    color,
    plate,
    capacity,
    type
  );
  const token = captain.generateAuthToken();
  res.cookie("accessToken", token, cookieOptions);
  res
    .status(201)
    .json({ message: "register done", token, captain, role: "captain" });
};

export const loginCaptain = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  const captain = await captainModel.findOne({ email }).select("+password");
  if (!captain)
    return res.status(401).json({ meaasge: "Invalid email or password!" });

  const isMatch = await captain.comparePassword(password);
  if (!isMatch)
    return res.status(401).json({ meaasge: "Invalid email or password!" });

  const token = captain.generateAuthToken();
  res.cookie("accessToken", token, cookieOptions);
  res
    .status(200)
    .json({ message: "login done", token, captain, role: "captain" });
};

export const getCaptainProfile = async (req, res, next) => {
  res
    .status(200)
    .json({ message: "Profile is: ", captain: req.captain, role: req.role });
};

export const logoutCaptain = async (req, res, next) => {
  res.clearCookie("accessToken");
  const { accessToken } = req.cookies;

  const newToken = new blacListTokenModel({
    token: accessToken,
  });
  await newToken.save();

  res.status(200).json({ message: "Logged out captain!" });
};
