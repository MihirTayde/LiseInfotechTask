import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Select from "react-select";
import "./styles.css";

const API_BASE_URL = "https://liseinfotechtask-2.onrender.com/api";

const AdminDashboard = () => {
  // State Variables
  const [pokemons, setPokemons] = useState([]);
  const [filteredPokemons, setFilteredPokemons] = useState([]);
  const [filterName, setFilterName] = useState("");
  const [filterType, setFilterType] = useState("");
  const [backendError, setBackendError] = useState(null);

  const [newPokemon, setNewPokemon] = useState({ name: "", types: [], abilities: [] });

  const availableTypes = ["Fire", "Water", "Air"];
  const availableAbilities = ["Blaze", "Torrent", "Intimidate", "Swift Swim", "Levitate"];

  // Fetch Pokémon from API
  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/getAllPokemon`);
        setPokemons(response.data);
        setFilteredPokemons(response.data);
      } catch (error) {
        console.error("Error fetching Pokémon:", error);
      }
    };
    fetchPokemon();
  }, []);

  // Apply Filters
  const applyFilters = useCallback(() => {
    let filtered = pokemons;
    if (filterName) {
      filtered = filtered.filter(pokemon =>
        pokemon.name?.toLowerCase().includes(filterName.toLowerCase())
      );
    }
    if (filterType) {
      filtered = filtered.filter(pokemon => pokemon.types.includes(filterType));
    }
    setFilteredPokemons(filtered);
  }, [filterName, filterType, pokemons]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Handle Input Changes
  const handleInputChange = (e) => {
    setNewPokemon({ ...newPokemon, [e.target.name]: e.target.value });
  };

  const handleMultiSelectChange = (selectedOptions, field) => {
    setNewPokemon({
      ...newPokemon,
      [field]: selectedOptions ? selectedOptions.map(option => option.value) : [],
    });
  };

  // Add Pokémon
  const addPokemon = async () => {
    try {
      setBackendError(null);
      const response = await axios.post(`${API_BASE_URL}/addPokemon`, newPokemon);
      setPokemons([...pokemons, response.data]);
      setNewPokemon({ name: "", types: [], abilities: [] });
    } catch (error) {
      setBackendError(error.response?.data?.message || "Failed to add Pokémon.");
    }
  };

  // Delete Pokémon
  const deletePokemon = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/deletePokemon/${id}`);
      setPokemons(pokemons.filter(pokemon => pokemon._id !== id));
    } catch (error) {
      console.error("Error deleting Pokémon:", error);
    }
  };

  return (
    <div className="dashboard">
      <h1>⚡ Admin Dashboard ⚡</h1>

      {/* Filters */}
      <div className="filters">
        <input
          type="text"
          name="filterName"
          placeholder="Filter by Name"
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
          className="input-field"
        />
        <select
          name="filterType"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="select-field"
        >
          <option value="">All Types</option>
          {availableTypes.map(type => <option key={type} value={type}>{type}</option>)}
        </select>
      </div>

      {/* Pokémon Form */}
      <div className="pokemon-form">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={newPokemon.name}
          onChange={handleInputChange}
          className="input-field"
        />

        <Select
          isMulti
          options={availableTypes.map(type => ({ value: type, label: type }))}
          className="select-box"
          onChange={(selected) => handleMultiSelectChange(selected, "types")}
          value={newPokemon.types.map(type => ({ value: type, label: type }))}
        />

        <Select
          isMulti
          options={availableAbilities.map(ability => ({ value: ability, label: ability }))}
          className="select-box"
          onChange={(selected) => handleMultiSelectChange(selected, "abilities")}
          value={newPokemon.abilities.map(ability => ({ value: ability, label: ability }))}
        />

        <button onClick={addPokemon} className="add-btn">Add Pokémon</button>
        {backendError && <p className="error-message">Error: {backendError}</p>}
      </div>

      {/* Pokémon List */}
      <h2>Pokémon List</h2>
      <ul className="pokemon-list">
        {filteredPokemons.map(pokemon => (
          <li key={pokemon._id} className="pokemon-card">
            <strong>{pokemon.name}</strong>
            <p>Types: {pokemon.types.join(", ")}</p>
            <p>Abilities: {pokemon.abilities.join(", ")}</p>
            <button onClick={() => deletePokemon(pokemon._id)} className="delete-btn">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
