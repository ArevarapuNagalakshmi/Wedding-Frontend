export const getRole = () => {
  return localStorage.getItem("role");
};

export const setRole = (role) => {
  localStorage.setItem("role", role);
};

export const hasRole = (allowedRoles = []) => {
  const role = getRole();
  return allowedRoles.includes(role);
};

export const clearRole = () => {
  localStorage.removeItem("role");
};
