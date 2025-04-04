import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { catchPokemon } from "../../Redux/Features/UserAuth/pokemonSlice";

const MainScreen = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const caughtPokemon = useSelector((state) => state.pokemon.caughtPokemon);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await axios.get(
          "https://liseinfotechtask.onrender.com/api/getAllPokemon"
        );
        setPokemonList(response.data.pokemon);
      } catch (error) {
        console.error("Error fetching Pokémon:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, []);

  const handleCatchPokemon = (pokemon) => {
    dispatch(catchPokemon(pokemon));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pokémon List</Text>

      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : (
        <FlatList
          data={pokemonList}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => {
            const isCaught = caughtPokemon.some((poke) => poke._id === item._id);

            return (
              <View style={styles.card}>
                <Text style={styles.pokemonName}>{item.name.trim()}</Text>
                <Text style={styles.text}>
                  <Text style={styles.bold}>Type:</Text> {item.types.join(", ")}
                </Text>
                <Text style={styles.text}>
                  <Text style={styles.bold}>Abilities:</Text>{" "}
                  {item.abilities.join(", ")}
                </Text>
                <TouchableOpacity
                  style={[styles.button, isCaught && styles.caughtButton]}
                  onPress={() => handleCatchPokemon(item)}
                  disabled={isCaught}
                >
                  <Text style={styles.buttonText}>
                    {isCaught ? "Caught!" : "Catch"}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  pokemonName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  text: {
    fontSize: 16,
    color: "#555",
  },
  bold: {
    fontWeight: "bold",
  },
  button: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#ff5733",
    borderRadius: 5,
    alignItems: "center",
  },
  caughtButton: {
    backgroundColor: "gray",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default MainScreen;
