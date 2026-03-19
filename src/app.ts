import cors from "cors";
import express from "express";
import session from "express-session";
import morgan from "morgan";

import passport from "./config/passport";
import { notFoundHandler } from "./middlewares/notFoundHandler";
import { errorHandler } from "./middlewares/errorHandler";
import routes from "./routes";

const app = express();

app.use(
  cors({
    origin: [
      "https://gateway-holidays-ltd.vercel.app",
      "https://gateway-holidays-frontend.vercel.app",
      "http://localhost:3000",
      "http://localhost:3001",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "authorization"],
    exposedHeaders: ["Content-Type", "Authorization"],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  }),
);
app.use(express.json());
app.use(morgan("dev"));

// Session configuration for Passport
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your_session_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  }),
);

app.get("/", (_req, res) =>
  res.json({
    message: "Gateway Holidays Backend API is running successfully! 🚀",
    status: "active",
  }),
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

app.use("/api", routes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
