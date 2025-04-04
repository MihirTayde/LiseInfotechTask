import React, { useState } from "react";
import Login from "./components/Login";
import AdminDashboard from "./components/AdminDashboard";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div>
      {isLoggedIn ? (
        <AdminDashboard />
      ) : (
        <Login onLogin={() => setIsLoggedIn(true)} />
      )}
    </div>
  );
};

export default App;
