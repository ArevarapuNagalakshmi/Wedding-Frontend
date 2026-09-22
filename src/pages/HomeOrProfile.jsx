import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Home from "./Home";

/**
 * HomeOrProfile
 * - If user is not authenticated, show the public Home page
 * - If authenticated, redirect to a role-specific dashboard route
 * This keeps routing consistent and avoids rendering a profile inline
 */
const HomeOrProfile = () => {
  const { token, role } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return; // not logged in

    // Redirect logged-in users to the canonical dashboard route
    if (role === "ADMIN") {
      navigate("/admin", { replace: true });
    } else if (role === "VENDOR") {
      navigate("/vendor", { replace: true });
    } else if (role === "CUSTOMER") {
      // Customers should land on their customer home/dashboard
      navigate("/customer", { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  }, [token, role, navigate]);

  // If not authenticated, show public home
  if (!token) return <Home />;

  // While redirecting, render null to avoid flicker
  return null;
};

export default HomeOrProfile;
