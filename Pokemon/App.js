import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "react-redux";
import { store } from "./Redux/Store.js";
import { StackNavigator } from "./assets/Components/StackNavigator .js";

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <StackNavigator></StackNavigator>
      </NavigationContainer>
    </Provider>
  );
}
