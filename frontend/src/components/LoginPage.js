import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "CRC",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password, role } = formData;
  
    if (!email || !password || !role) {
      setError("All fields are required!");
      return;
    }
  
    try {
      console.log("Sending Request:", { email, password, role }); // Log payload
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });
  
      console.log("Response Status:", response.status); // Log status
      const data = await response.json();
      console.log("Response Data:", data); // Log response data
  
      if (response.ok) {
        onLogin();
        navigate(role === "CRC" ? "/CRC" : "/PI");
      } else {
        setError(data.error || "Invalid credentials");
      }
    } catch (err) {
      console.error("Error in login request:", err);
      setError("Internal server error. Please try again.");
    }
  };
   

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Login</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        {error && <p style={styles.error}>{error}</p>}
        <label style={styles.label}>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          style={styles.input}
          placeholder="Enter your email"
        />
        <label style={styles.label}>Password:</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          style={styles.input}
          placeholder="Enter your password"
        />
        <label style={styles.label}>Role:</label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          style={styles.input}
        >
          <option value="CRC">CRC</option>
          <option value="PI">PI</option>
        </select>
        <button type="submit" style={styles.button}>
          Login
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "400px",
    margin: "50px auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  heading: { textAlign: "center", color: "#333" },
  form: { display: "flex", flexDirection: "column" },
  label: { marginBottom: "5px", color: "#555" },
  input: {
    padding: "10px",
    marginBottom: "15px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    fontSize: "16px",
  },
  button: {
    padding: "10px",
    backgroundColor: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },
  error: { color: "red", marginBottom: "10px", textAlign: "center" },
};

export default LoginPage;
