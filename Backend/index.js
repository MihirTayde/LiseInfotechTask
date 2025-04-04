import express from "express";
import configDB from "./src/config/configDB.js";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

import { adminLogin, adminLogOut } from "./src/controller/authController.js";
import {
  addPokemon,
  deletePokemon,
  getAllPokemon,
  updatePokemon,
} from "./src/controller/pokemonController.js";

const app = express();
const router = express.Router();

// 🛠 Apply Middleware
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());

app.use(
  cors({
    origin: "https://lise-infotech-task-1mf7.vercel.app", 
    credentials: true, 
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

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

app.use((req, res, next) => {
  console.log("Request Headers:", req.headers);
  next();
});

configDB();

router.get("/adminDashboard", (req, res) => {
  res.json({ message: "Welcome to Admin Dashboard" });
});

router.post("/adminLogin", adminLogin);
router.post("/adminLogout", adminLogOut);

router.post("/addPokemon", addPokemon);
router.delete("/deletePokemon/:id", deletePokemon);
router.get("/getAllPokemon", getAllPokemon);
router.put("/updatePokemon/:id", updatePokemon);

app.use("/api", router);

const PORT = process.env.PORT || 4500;
app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
