import React, { useEffect, useState } from "react";
import axios from "axios";
import "./styles.css";

const API_BASE_URL = "https://liseinfotechtask-2.onrender.com/isAdmin";

const AdminDashboard = () => {
  const [pokemons, setPokemons] = useState([]);
  const [newPokemon, setNewPokemon] = useState({
    name: "",
    types: "",
    abilities: "",
  });

  const fetchPokemon = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/getAllPokemon`);
      setPokemons(response.data);
    } catch (error) {
      console.error("Error fetching Pokémon:", error);
    }
  };

  useEffect(() => {
    fetchPokemon();
  }, []);

  const addPokemon = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/addPokemon`, {
        name: newPokemon.name,
        types: newPokemon.types.split(","),
        abilities: newPokemon.abilities.split(","),
      });

      setPokemons([...pokemons, response.data]); // Add to list
      setNewPokemon({ name: "", types: "", abilities: "" }); // Reset form
    } catch (error) {
      console.error("Error adding Pokémon:", error);
    }
  };


  const updatePokemon = async (id, updatedData) => {
    try {
      await axios.put(`${API_BASE_URL}/updatePokemon/${id}`, updatedData);
      fetchPokemon(); // Refresh list
    } catch (error) {
      console.error("Error updating Pokémon:", error);
    }
  };

  const deletePokemon = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/deletePokemon/${id}`);
      setPokemons(pokemons.filter((pokemon) => pokemon._id !== id)); // Remove from UI
    } catch (error) {
      console.error("Error deleting Pokémon:", error);
    }
  };

  return (
    <div className="dashboard">
      <h1>⚡ Welcome, Admin! ⚡</h1>

      <div className="pokemon-form">
        <input
          type="text"
          placeholder="Name"
          value={newPokemon.name}
          onChange={(e) => setNewPokemon({ ...newPokemon, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Types (comma-separated)"
          value={newPokemon.types}
          onChange={(e) => setNewPokemon({ ...newPokemon, types: e.target.value })}
        />
        <input
          type="text"
          placeholder="Abilities (comma-separated)"
          value={newPokemon.abilities}
          onChange={(e) => setNewPokemon({ ...newPokemon, abilities: e.target.value })}
        />
        <button onClick={addPokemon}>Add Pokémon</button>
      </div>

      <div>
        <h2>Pokémon List</h2>
        <ul>
          {pokemons.map((pokemon) => (
            <li key={pokemon._id}>
              <strong>{pokemon.name}</strong> | Types: {pokemon.types.join(", ")} | Abilities: {pokemon.abilities.join(", ")}
              <button onClick={() => updatePokemon(pokemon._id, { name: "Updated Name" })}>Update</button>
              <button onClick={() => deletePokemon(pokemon._id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
