import mongoose from "mongoose";

const pokemonSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  types: [String],
  abilities: [String],
});

module.exports = mongoose.model("Pokemon", pokemonSchema);
