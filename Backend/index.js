import express from "express";
import configDB from "./src/config/configDB.js";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

import { adminLogin, adminLogOut } from "./src/controller/authController.js";
import { isAdmin } from "./src/middleware/isAdmin.js";
import {
  addPokemon,
  deletePokemon,
  getAllPokemon,
  updatePokemon,
} from "./src/controller/pokemonController.js";

const app = express();
const router = express.Router();

// Apply CORS before defining routes
app.use(
  cors({
    origin: "https://lise-infotech-task-1mf7.vercel.app", // Allow frontend origin
    credentials: true, // Allow cookies and authentication headers
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Handle preflight requests (important)
app.options("*", cors());

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json()); // Ensure body parsing

// Debugging: Log request headers
app.use((req, res, next) => {
  console.log("Request Headers:", req.headers);
  next();
});

// Database Connection
configDB();

// Routes
router.get("/adminDashboard", isAdmin, (req, res) => {
  res.json({ message: "Welcome to Admin Dashboard" });
});
router.post("/adminLogin", adminLogin);
router.post("/adminLogout", adminLogOut);

router.post("/addPokemon", isAdmin, addPokemon);
router.delete("/deletePokemon/:id", isAdmin, deletePokemon);
router.get("/getAllPokemon", isAdmin, getAllPokemon);
router.put("/updatePokemon/:id", isAdmin, updatePokemon);

// Use Router
app.use(router);

// Start Server
const PORT = process.env.PORT || 4500;
app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
