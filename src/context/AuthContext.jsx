import { createContext, useState } from "react";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [displayName, setDisplayName] = useState(
    localStorage.getItem("displayName") || ""
  );

  const login = (jwtToken, userRole, userDisplayName = "") => {
    localStorage.setItem("token", jwtToken);
    localStorage.setItem("role", userRole);
    if (userDisplayName) {
      localStorage.setItem("displayName", userDisplayName);
    }
    setToken(jwtToken);
    setRole(userRole);
    setDisplayName(userDisplayName);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("displayName");
    setToken(null);
    setRole(null);
    setDisplayName("");
  };

  return (
    <AuthContext.Provider
      value={{ token, role, displayName, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
