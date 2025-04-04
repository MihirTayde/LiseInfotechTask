import express from "express";
import configDB from "./src/config/configDB.js";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

// Import Controllers & Middleware
import { adminLogin, adminLogOut } from "./src/controller/authController.js";
import { isAdmin } from "./src/middleware/isAdmin.js";
import {
  addPokemon,
  deletePokemon,
  getAllPokemon,
  updatePokemon,
} from "./src/controller/pokemonController.js";

// Initialize Express App
const app = express();
const router = express.Router();

// 🛠 Apply Middleware
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());

// 🛠 CORS Configuration
app.use(
  cors({
    origin: "https://lise-infotech-task-1mf7.vercel.app", // Allow frontend origin
    credentials: true, // Allow cookies/auth headers
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 🛠 Handle Preflight Requests (CORS OPTIONS)
app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Origin",
    "https://lise-infotech-task-1mf7.vercel.app"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

// 🛠 Debugging: Log Request Headers (Remove in Production)
app.use((req, res, next) => {
  console.log("Request Headers:", req.headers);
  next();
});

// 🔗 Database Connection
configDB();

// 🚀 API Routes (Prefixed with `/api`)
router.get("/adminDashboard", isAdmin, (req, res) => {
  res.json({ message: "Welcome to Admin Dashboard" });
});


router.post("/adminLogin", adminLogin);
router.post("/adminLogout", adminLogOut);

router.post("/addPokemon", isAdmin, addPokemon);
router.delete("/deletePokemon/:id", isAdmin, deletePokemon);
router.get("/getAllPokemon", isAdmin, getAllPokemon);
router.put("/updatePokemon/:id", isAdmin, updatePokemon);

// 🛠 Use Router with `/api` Prefix
app.use("/api", router);

// 🚀 Start Server
const PORT = process.env.PORT || 4500;
app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
