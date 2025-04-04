import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "./styles.css";
import Select from 'react-select'; // Import the react-select component

const API_BASE_URL = "https://liseinfotechtask-2.onrender.com/api";

const AdminDashboard = () => {
  const [pokemons, setPokemons] = useState([]);
  const [filteredPokemons, setFilteredPokemons] = useState([]);
  const [newPokemon, setNewPokemon] = useState({
    name: "",
    types: [], // Changed to array for multiple select
    abilities: [], // Changed to array for multiple select
  });
  const [filterName, setFilterName] = useState("");
  const [filterType, setFilterType] = useState("");
  const availableTypes = ["Fire", "Water", "Air"];
  const availableAbilities = ["Blaze", "Torrent", "Intimidate", "Swift Swim", "Levitate"]; // Example abilities

  useEffect(() => {
    fetchPokemon();
  }, []);

  const fetchPokemon = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/getAllPokemon`);
      setPokemons(response.data);
      setFilteredPokemons(response.data);
    } catch (error) {
      console.error("Error fetching Pokémon:", error);
    }
  };

  const applyFilters = useCallback(() => {
    let filtered = pokemons;
    if (filterName) {
      filtered = filtered.filter(pokemon =>
        pokemon.name.toLowerCase().includes(filterName.toLowerCase())
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

  const handleTypeChange = (selectedOptions) => {
    setNewPokemon({ ...newPokemon, types: selectedOptions.map(option => option.value) });
  };

  const handleAbilityChange = (selectedOptions) => {
    setNewPokemon({ ...newPokemon, abilities: selectedOptions.map(option => option.value) });
  };

  const addPokemon = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/addPokemon`, {
        name: newPokemon.name,
        types: newPokemon.types,
        abilities: newPokemon.abilities,
      });
      setPokemons([...pokemons, response.data]);
      setNewPokemon({ name: "", types: [], abilities: [] });
    } catch (error) {
      console.error("Error adding Pokémon:", error);
    }
  };

  const deletePokemon = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/deletePokemon/${id}`);
      setPokemons(pokemons.filter((pokemon) => pokemon._id !== id));
    } catch (error) {
      console.error("Error deleting Pokémon:", error);
    }
  };

  return (
    <div className="dashboard">
      <h1>⚡ Welcome, Admin! ⚡</h1>

      <div className="filters">
        <input
          type="text"
          placeholder="Filter by Name"
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
        />
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="">All Types</option>
          {availableTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div className="pokemon-form">
        <input
          type="text"
          placeholder="Name"
          value={newPokemon.name}
          onChange={(e) => setNewPokemon({ ...newPokemon, name: e.target.value })}
        />
        <div className="select-container">
          <label htmlFor="types-select">Types:</label>
          <Select
            id="types-select"
            isMulti
            name="types"
            options={availableTypes.map(type => ({ value: type, label: type }))}
            className="basic-multi-select"
            classNamePrefix="select"
            onChange={handleTypeChange}
            value={newPokemon.types.map(type => ({ value: type, label: type }))}
          />
        </div>
        <div className="select-container">
          <label htmlFor="abilities-select">Abilities:</label>
          <Select
            id="abilities-select"
            isMulti
            name="abilities"
            options={availableAbilities.map(ability => ({ value: ability, label: ability }))}
            className="basic-multi-select"
            classNamePrefix="select"
            onChange={handleAbilityChange}
            value={newPokemon.abilities.map(ability => ({ value: ability, label: ability }))}
          />
        </div>
        <button onClick={addPokemon}>Add Pokémon</button>
      </div>

      <h2>Pokémon List</h2>
      <ul>
        {filteredPokemons.map((pokemon) => (
          <li key={pokemon._id}>
            <strong>{pokemon.name}</strong> | Types: {pokemon.types.join(", ")} | Abilities: {pokemon.abilities.join(", ")}
            <button onClick={() => deletePokemon(pokemon._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;