import express from 'express';
const app = express();

import cors from 'cors';
import cookieParser from 'cookie-parser';

import connectToDB from './config/mongodb.config.js';
import authRoutes from './routes/user.routes.js';
import captainRoutes from './routes/captain.routes.js';
import authUser from './routes/authUser.routes.js';
import mapRoutes from "./routes/maps.routes.js";
import rideRoutes from "./routes/ride.routes.js"

import dotenv from 'dotenv';
dotenv.config();
const allowedOrigins = [
  process.env.FRONTEND_URL,
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, "http://localhost:5173");
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS blocked"));
    },
    credentials: true,
  })
);

connectToDB();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("query parser", "extended");

app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} took ${duration} ms`);
  });
  next();
});

app.use("/me", authUser);

app.use('/user', authRoutes);
app.use('/captain', captainRoutes);
app.use('/maps', mapRoutes);
app.use('/ride', rideRoutes);


export default app;
