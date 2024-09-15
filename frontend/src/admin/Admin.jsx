import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./admin.css";

const Admin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Hook for navigation

const adminsisplay=async ()=>{
  try {
    const response = await axios.post(
      "http://localhost:3002/login",
      { username, password },
      { withCredentials: true } // Include credentials in the request
    );

    if (response.status === 200) {
      // Navigate to a different page upon successful login
      navigate("/admindisplay");
    }
  } catch (err) {
    // Handle errors (e.g., display an error message)
    setError(err.response?.data?.message || "Invalid username or password");
  }
}
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3002/login",
        { username, password },
        { withCredentials: true } // Include credentials in the request
      );

      if (response.status === 200) {
        // Navigate to a different page upon successful login
        navigate("/admindisplay");
      }
    } catch (err) {
      // Handle errors (e.g., display an error message)
      setError(err.response?.data?.message || "Invalid username or password");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        {error && <p className="error">{error}</p>}
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="login-btn">
          Login
        </button>
      </form>
    </div>
  );
};

export default Admin;
