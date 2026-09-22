import React, { useState, useContext } from "react";
import { FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import { login } from "../api/authApi";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Login.css";
import { getErrorMessage } from "../utils/errorUtils";

const Login = () => {
  const navigate = useNavigate();
  const { login: contextLogin } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    emailOrPhone: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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

      // Normalize role values to uppercase and strip common prefixes
      const normalizedRole = data.role
        ? data.role.toUpperCase().replace(/^ROLE_/, "")
        : "";

      // Save token + role + display name if available
      contextLogin(
        data.token,
        normalizedRole,
        data.displayName || data.fullName || formData.emailOrPhone
      );

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
      setError(getErrorMessage(err) || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-intro">
        <span className="login-kicker">PLAN E WEDDINGS</span>
        <h1>Bring every celebration into focus.</h1>
        <p>Manage your wedding journey, services, bookings, and conversations from one calm workspace.</p>
        <div className="login-intro-points">
          <span>Secure access</span>
          <span>Role-based workspace</span>
          <span>Built for better events</span>
        </div>
      </div>
      <div className="login-card">
        <div className="login-card-eyebrow">Account access</div>
        <h2 className="login-title">Welcome Back</h2>
        <p className="login-subtitle">Sign in to continue planning with confidence.</p>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <label className="login-field">
            <span>Email or phone</span>
            <input
              type="text"
              name="emailOrPhone"
              placeholder="you@example.com"
              value={formData.emailOrPhone}
              onChange={handleChange}
              autoComplete="username"
              required
            />
          </label>

          <label className="login-field">
            <span>Password</span>
            <div className="login-password-field">
              <FaLock className="login-password-icon" aria-hidden="true" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="login-password-toggle"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </label>

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
