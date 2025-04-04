import { configureStore } from "@reduxjs/toolkit";
import pokemonReducer from "./Features/UserAuth/pokemonSlice";

export const store = configureStore({
  reducer: {
    pokemon: pokemonReducer,
  },
});
