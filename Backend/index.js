import express from "express";
import configDB from "./src/config/configDB.js";
import "dotenv/config";
import { adminLogin, adminLogOut } from "./src/controller/authController.js";
import { isAdmin } from "./src/middleware/isAdmin.js";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
const router = express.Router();

// Middleware
app.use(express.json()); // Important for parsing JSON requests
app.use(cookieParser());
app.use(
  cors({
    origin: "https://lise-infotech-task-1mf7.vercel.app", // Correct origin (no trailing slash)
    credentials: true, // Allow credentials like cookies
  })
);

// Database Connection
configDB();

// Root Route (You can keep this or remove it if not needed)
app.get("/", (req, res) => {
  try {
    res.send("Hi there");
  } catch (error) {
    console.log(error);
  }
});

// Admin Routes
router.get("/adminDashboard", isAdmin, (req, res) => {
  res.json({ message: "Welcome to Admin Dashboard" });
});
router.post("/adminLogin", adminLogin); // Corrected route
router.post("/adminLogout", adminLogOut);

// Use Router (After defining routes)
app.use(router);

// Start Server
const PORT = process.env.PORT || 4500;
app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
