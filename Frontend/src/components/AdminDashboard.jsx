import React, { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import {
  TextField,
  MenuItem,
  Button,
  Typography,
  Card,
  CardContent,
  Grid,
  Container,
} from "@mui/material";
import "./styles.css";

const API_BASE_URL = "https://liseinfotechtask-2.onrender.com/api";

const AdminDashboard = () => {
  const [pokemons, setPokemons] = useState([]);
  const [filteredPokemons, setFilteredPokemons] = useState([]);
  const [filterName, setFilterName] = useState("");
  const [filterType, setFilterType] = useState("");
  const [backendError, setBackendError] = useState(null);

  const [newPokemon, setNewPokemon] = useState({
    name: "",
    types: [],
    abilities: [],
  });

  const availableTypes = ["Fire", "Water", "Air"];
  const availableAbilities = [
    "Blaze",
    "Torrent",
    "Intimidate",
    "Swift Swim",
    "Levitate",
  ];

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/getAllPokemon`);
        console.log("API Response:", response.data); 

        const data = Array.isArray(response.data.pokemon)
          ? response.data.pokemon
          : [];

        setPokemons(data);
        setFilteredPokemons(data);
      } catch (error) {
        console.error("Error fetching Pokémon:", error);
        setBackendError("Failed to fetch Pokémon. Please try again later.");
      }
    };
    fetchPokemon();
  }, []);

  useEffect(() => {
    let filtered = pokemons;
    if (filterName) {
      filtered = filtered.filter((pokemon) =>
        pokemon.name?.toLowerCase().includes(filterName.toLowerCase())
      );
    }
    if (filterType) {
      filtered = filtered.filter((pokemon) =>
        pokemon.types?.includes(filterType)
      );
    }
    setFilteredPokemons(filtered);
  }, [filterName, filterType, pokemons]);

  const handleInputChange = (e) => {
    setNewPokemon({ ...newPokemon, [e.target.name]: e.target.value });
  };

  const handleMultiSelectChange = (selectedOptions, field) => {
    const values = Array.isArray(selectedOptions)
      ? selectedOptions.map((option) => option.value)
      : [];
    setNewPokemon((prev) => ({ ...prev, [field]: values }));
  };

  const addPokemon = async () => {
    try {
      setBackendError(null);
      const response = await axios.post(
        `${API_BASE_URL}/addPokemon`,
        newPokemon
      );
      setPokemons([...pokemons, response.data]);
      setNewPokemon({ name: "", types: [], abilities: [] });
    } catch (error) {
      setBackendError(
        error.response?.data?.message || "Failed to add Pokémon."
      );
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
    <Container>
      <Typography variant="h4" align="center" sx={{ my: 3 }}>
      Admin Dashboard
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Filter by Name"
            variant="outlined"
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            select
            label="Filter by Type"
            variant="outlined"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <MenuItem value="">All Types</MenuItem>
            {availableTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>

      <Card sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5">Add a New Pokémon</Typography>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Name"
              variant="outlined"
              name="name"
              value={newPokemon.name}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Select
              isMulti
              options={availableTypes.map((type) => ({
                value: type,
                label: type,
              }))}
              onChange={(selected) =>
                handleMultiSelectChange(selected, "types")
              }
              value={newPokemon.types.map((type) => ({
                value: type,
                label: type,
              }))}
            />
          </Grid>

          <Grid item xs={12}>
            <Select
              isMulti
              options={availableAbilities.map((ability) => ({
                value: ability,
                label: ability,
              }))}
              onChange={(selected) =>
                handleMultiSelectChange(selected, "abilities")
              }
              value={newPokemon.abilities.map((ability) => ({
                value: ability,
                label: ability,
              }))}
            />
          </Grid>
        </Grid>

        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={addPokemon}
        >
          Add Pokémon
        </Button>
        {backendError && (
          <Typography color="error" sx={{ mt: 1 }}>
            Error: {backendError}
          </Typography>
        )}
      </Card>

      {/* Pokémon List */}
      <Grid container spacing={2}>
        {filteredPokemons.map((pokemon) => (
          <Grid item xs={12} sm={6} md={4} key={pokemon._id}>
            <Card sx={{ p: 2 }}>
              <CardContent>
                <Typography variant="h6">
                  {pokemon.name || "Unknown Name"}
                </Typography>
                <Typography variant="body2">
                  <strong>Types:</strong>{" "}
                  {Array.isArray(pokemon.types) && pokemon.types.length > 0
                    ? pokemon.types.join(", ")
                    : "N/A"}
                </Typography>
                <Typography variant="body2">
                  <strong>Abilities:</strong>{" "}
                  {Array.isArray(pokemon.abilities) && pokemon.abilities.length > 0
                    ? pokemon.abilities.join(", ")
                    : "N/A"}
                </Typography>
                <Button
                  variant="contained"
                  color="error"
                  sx={{ mt: 1 }}
                  onClick={() => deletePokemon(pokemon._id)}
                >
                  Delete
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default AdminDashboard;