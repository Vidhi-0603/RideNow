import { validationResult } from "express-validator";
import { createUser } from "../services/user.service.js";
import userModel from "../models/user.model.js";
import { cookieOptions } from "../config/jwtToken.config.js";
import blacListTokenModel from "../models/blacklist.model.js";


export const registerUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const {firstname, lastname, email, password } = req.body;
  
  const userExists = await userModel.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'User already exist' });
  }

  const hashedPassword = await userModel.hashPassword(password);
  const user = await createUser(firstname, lastname, email, hashedPassword);

  const token = user.generateAuthToken();
  res.cookie("accessToken", token, cookieOptions);
  
  res.status(201).json({ message: "register done",token, user, role:"user" });
}

export const loginUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  const user = await userModel.findOne({ email }).select('+password');
  if (!user) return res.status(401).json({meaasge: "Invalid email or password!"});

  const isMatch = await user.comparePassword(password);
  if(!isMatch) return res.status(401).json({meaasge: "Invalid email or password!"});
  
  const token = user.generateAuthToken();
  
  res.cookie("accessToken", token, cookieOptions);
  
  res.status(200).json({ message: "login done",token, user, role:"user" });
}

export const getUserProfile = async (req, res, next) => {
  res.status(200).json({ message: "Profile is: ",user: req.user,role: req.role });
}

export const logoutUser = async (req, res, next) => {
  const { accessToken } = req.cookies;
  
  const newToken = new blacListTokenModel({
    token: accessToken
  })
  await newToken.save();

  res.clearCookie('accessToken');
  res.status(200).json({ message: 'Logged out!' });
}
