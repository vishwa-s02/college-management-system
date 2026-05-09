import { useState } from "react";
import "./App.css";

function Login({ setIsLoggedIn }) {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {

    if (username === "admin" && password === "1234") {

      setIsLoggedIn(true);

    } else {

      alert("Invalid Username or Password");
    }
  };

  return (
    <div className="login-container">

      <div className="login-box">

        <h1>College Management System 🎓</h1>

        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>
          Login
        </button>

      </div>

    </div>
  );
}

export default Login;