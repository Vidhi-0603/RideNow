import express from "express";
import jwt from "jsonwebtoken";
import blacListTokenModel from "../models/blacklist.model.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const { accessToken } = req.cookies;
  if (!accessToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const isBlacklisted = await blacListTokenModel.findOne({
    token: accessToken,
  });
  if (isBlacklisted) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    return res.json({ role: decoded.role });
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
});

export default router;
