import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./LoginScreen";

import Register from "./RegisterScreen";
import MainScreen from "./MainScreen";
const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="MainScreen" component={MainScreen} />
    </Stack.Navigator>
  );
}
