import {
  FaTachometerAlt,
  FaConciergeBell,
  FaPlusCircle,
  FaIdCard,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

/**
 * Navigation menu items for Vendor Sidebar
 * Each item includes: label, path, and icon component
 */
export const SIDEBAR_NAV_ITEMS = [
  {
    label: "Dashboard",
    to: "/vendor",
    icon: FaTachometerAlt,
    description: "View your dashboard",
  },
  {
    label: "Services",
    to: "/vendor/services",
    icon: FaConciergeBell,
    description: "Manage your services",
  },
  {
    label: "Add Service",
    to: "/vendor/add-service",
    icon: FaPlusCircle,
    description: "Create a new service",
  },
  {
    label: "Profile",
    to: "/vendor/profile",
    icon: FaIdCard,
    description: "Edit your profile",
  },
  {
    label: "Settings",
    to: "/vendor/profile",
    icon: FaCog,
    description: "Manage settings",
  },
];

/**
 * Logout action configuration
 */
export const SIDEBAR_LOGOUT_ACTION = {
  label: "Logout",
  icon: FaSignOutAlt,
  description: "Sign out of your account",
};
