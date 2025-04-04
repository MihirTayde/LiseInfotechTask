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
    origin: "https://lise-infotech-task-1mf7.vercel.app/",
    credentials: true, // Allow credentials like cookies
  })
);

// Database Connection
configDB();

// Root Route
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
router.post("/adminLogin", adminLogin);
router.post("/adminLogout", adminLogOut);

// Pokémon Data Storage (Temporary - Replace with Database)
let pokemons = [];

// Create Pokémon (Add)
router.post("/addPokemon", isAdmin, (req, res) => {
  const { name, type, level } = req.body;
  if (!name || !type || !level) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const newPokemon = { id: pokemons.length + 1, name, type, level };
  pokemons.push(newPokemon);
  res
    .status(201)
    .json({ message: "Pokémon added successfully", pokemon: newPokemon });
});

// Read Pokémon (List All)
router.get("/listPokemon", isAdmin, (req, res) => {
  res.json({ pokemons });
});

// Update Pokémon (Edit)
router.put("/editPokemon/:id", isAdmin, (req, res) => {
  const { id } = req.params;
  const { name, type, level } = req.body;

  const pokemonIndex = pokemons.findIndex((p) => p.id === parseInt(id));
  if (pokemonIndex === -1) {
    return res.status(404).json({ message: "Pokémon not found" });
  }

  pokemons[pokemonIndex] = { ...pokemons[pokemonIndex], name, type, level };
  res.json({
    message: "Pokémon updated successfully",
    pokemon: pokemons[pokemonIndex],
  });
});

// Delete Pokémon
router.delete("/deletePokemon/:id", isAdmin, (req, res) => {
  const { id } = req.params;
  const initialLength = pokemons.length;
  pokemons = pokemons.filter((p) => p.id !== parseInt(id));

  if (pokemons.length === initialLength) {
    return res.status(404).json({ message: "Pokémon not found" });
  }

  res.json({ message: "Pokémon deleted successfully" });
});

// Use Router (After defining routes)
app.use(router);

// Start Server
const PORT = process.env.PORT || 4500;
app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
