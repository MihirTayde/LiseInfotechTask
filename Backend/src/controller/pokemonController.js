


// ✅ Add a new Pokémon
export const addPokemon = async (req, res) => {
  try {
    const { name, types, abilities } = req.body;

    if (!name || !types || !abilities) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newPokemon = new Pokemon({ name, types, abilities });
    await newPokemon.save();

    res.status(201).json({ message: "Pokemon added successfully", newPokemon });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Delete a Pokémon by ID
export const deletePokemon = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPokemon = await Pokemon.findByIdAndDelete(id);

    if (!deletedPokemon) {
      return res.status(404).json({ message: "Pokemon not found" });
    }

    res.status(200).json({ message: "Pokemon deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Get all Pokémon
export const getAllPokemon = async (req, res) => {
  try {
    const allPokemon = await Pokemon.find();
    res.status(200).json(allPokemon);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Update a Pokémon by ID
export const updatePokemon = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, types, abilities } = req.body;

    const updatedPokemon = await Pokemon.findByIdAndUpdate(
      id,
      { name, types, abilities },
      { new: true, runValidators: true }
    );

    if (!updatedPokemon) {
      return res.status(404).json({ message: "Pokemon not found" });
    }

    res
      .status(200)
      .json({ message: "Pokemon updated successfully", updatedPokemon });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
