import Pokemon from "../model/PokemonModel.js";  

export const addPokemon = async (req, res) => {
  try {
    const { name, types, abilities } = req.body;

    
    if (!name || !types || !abilities) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (!Array.isArray(types) || !Array.isArray(abilities)) {
      return res.status(400).json({ message: "Types and Abilities must be arrays" });
    }

    const newPokemon = new Pokemon({ name, types, abilities });
    await newPokemon.save();

    res.status(201).json({ message: "Pokémon added successfully", pokemon: newPokemon });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const deletePokemon = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPokemon = await Pokemon.findByIdAndDelete(id);
    if (!deletedPokemon) {
      return res.status(404).json({ message: "Pokémon not found" });
    }

    res.status(200).json({ message: "Pokémon deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getAllPokemon = async (req, res) => {
  try {
    const allPokemon = await Pokemon.find();
    res.status(200).json({ message: "Pokémon list retrieved", pokemon: allPokemon });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const updatePokemon = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, types, abilities } = req.body;

    // Validate optional fields
    if (types && !Array.isArray(types)) {
      return res.status(400).json({ message: "Types must be an array" });
    }
    if (abilities && !Array.isArray(abilities)) {
      return res.status(400).json({ message: "Abilities must be an array" });
    }

    const updatedPokemon = await Pokemon.findByIdAndUpdate(
      id,
      { name, types, abilities },
      { new: true, runValidators: true }
    );

    if (!updatedPokemon) {
      return res.status(404).json({ message: "Pokémon not found" });
    }

    res.status(200).json({ message: "Pokémon updated successfully", pokemon: updatedPokemon });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
