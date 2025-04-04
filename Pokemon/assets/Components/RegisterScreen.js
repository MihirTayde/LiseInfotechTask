import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Alert } from "react-native";
import axios from "axios";

const API = axios.create({
  baseURL: "https://liseinfotechtask.onrender.com/api/playerRegister",
  headers: { "Content-Type": "application/json" },
});

const Register = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    if (username.trim() === "" || email.trim() === "" || password.length < 6) {
      Alert.alert("Error", "Enter a valid username, email, and password (min 6 characters)");
      return;
    }

    try {
      const response = await API.post("/register", { username, email, password });

      Alert.alert("Success", "Registration Successful");
      navigation.navigate("Login"); // Navigate to login page after registration
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Something went wrong. Try again later.";
      Alert.alert("Error", errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.loginText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginText: {
    fontSize: 14,
    color: "blue",
    textDecorationLine: "underline",
    marginTop: 10,
  },
});

export default Register;
