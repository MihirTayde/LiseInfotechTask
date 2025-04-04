import mongoose from "mongoose";

const pokemonSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  types: { type: [String], required: true },
  abilities: { type: [String], required: true },
});

export default mongoose.model("Pokemon", pokemonSchema);
