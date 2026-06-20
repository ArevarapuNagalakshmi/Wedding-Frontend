import React, { useState, useContext } from "react";
import { login } from "../api/authApi";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Login.css";

const Login = () => {
  const navigate = useNavigate();
  const { login: contextLogin } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    emailOrPhone: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await login(formData);

      // 🔥 IMPORTANT FIX — Normalize role
      const normalizedRole = data.role.startsWith("ROLE_")
        ? data.role.replace("ROLE_", "")
        : data.role;

      // Save token + role
      contextLogin(data.token, normalizedRole);

      // Redirect based on role
      if (normalizedRole === "ADMIN") {
        navigate("/admin");
      } else if (normalizedRole === "VENDOR") {
        navigate("/vendor/profile");
      } else if (normalizedRole === "CUSTOMER") {
        navigate("/customer");
      } else {
        navigate("/");
      }

    } catch (err) {
      if (err.response?.data) {
        const msg =
          typeof err.response.data === "string"
            ? err.response.data
            : Object.values(err.response.data)[0];

        setError(msg || "Invalid credentials");
      } else {
        setError("Server error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2 className="login-title">Welcome Back</h2>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="emailOrPhone"
            placeholder="Email or Phone"
            value={formData.emailOrPhone}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="login-footer">
          Don’t have an account? <Link to="/register">Register</Link>
        </p>
        <p className="login-footer">
          Forgot your password? <Link to="/forgot-password">Reset it here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
