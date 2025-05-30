import React, { useState } from "react";
import axios from "axios";
import "./loginStyles.css";

const Login = ({ onLogin }) => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); 

    try {
      const response = await axios.post(
        "https://liseinfotechtask-2.onrender.com/api/adminLogin",
        {
          userName,
          password,
        }
      );

      if (response.data.token) {
        localStorage.setItem("adminToken", response.data.token);
        onLogin(); 
      }
    } catch (error) {
      console.error("Login Error:", error);
      setError("Invalid Username or Password");
    }
  };

  return (
    <div className="login-container">
      <h1 className="pikachu-title">⚡ Pikachu Admin Panel ⚡</h1>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default Login;
