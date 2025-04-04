import { createSlice } from "@reduxjs/toolkit";

const pokemonSlice = createSlice({
  name: "pokemon",
  initialState: {
    caughtPokemon: [],
  },
  reducers: {
    catchPokemon: (state, action) => {
      const existingPokemon = state.caughtPokemon.find(
        (poke) => poke._id === action.payload._id
      );

      if (!existingPokemon) {
        state.caughtPokemon.push({ ...action.payload, caught: true });
      }
    },
  },
});

export const { catchPokemon } = pokemonSlice.actions;
export default pokemonSlice.reducer;
