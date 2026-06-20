import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../components/common/ProtectedRoute";

// Public Pages
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Unauthorized from "../pages/Unauthorized";
import About from "../pages/About";
import Contact from "../pages/Contact";
import ForgotPassword from "../pages/ForgotPassword";
import VendorProfilePage from "../pages/VendorProfilePage";

// Dashboards
import AdminDashboard from "../components/admin/AdminDashboard";
import VendorDashboard from "../components/vendor/VendorDashboardNew";
import VendorProfile from "../components/vendor/VendorProfile";
import MyServices from "../components/vendor/MyServices";
import AddService from "../components/vendor/AddService";
import EditService from "../components/vendor/EditService";
import CustomerDashboard from "../components/customer/CustomerDashboard";
import CustomerProfile from "../components/customer/CustomerProfile";
import ServiceList from "../components/customer/ServiceList";
import ServiceDetails from "../components/customer/ServiceDetails";
import CustomerCart from "../components/customer/CustomerCart";
import CustomerBilling from "../components/customer/CustomerBilling";
import SavedVendors from "../components/customer/SavedVendors";
import MyBookings from "../components/customer/MyBookings";


const AppRoutes = () => {

  return (

    <Routes>

      {/* ================= PUBLIC ROUTES ================= */}

      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />

      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route path="/register" element={<Register />} />

      <Route path="/about" element={<About />} />

      <Route path="/contact" element={<Contact />} />

      <Route path="/unauthorized" element={<Unauthorized />} />

      <Route path="/vendor/:vendorId" element={<VendorProfilePage />} />


      {/* ================= ADMIN ================= */}

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />


      {/* ================= VENDOR ================= */}

      <Route
        path="/vendor"
        element={
          <ProtectedRoute allowedRoles={["VENDOR"]}>
            <VendorDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/vendor/profile"
        element={
          <ProtectedRoute allowedRoles={["VENDOR"]}>
            <VendorProfile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/vendor/services"
        element={
          <ProtectedRoute allowedRoles={["VENDOR"]}>
            <MyServices />
          </ProtectedRoute>
        }
      />

      <Route
        path="/vendor/add-service"
        element={
          <ProtectedRoute allowedRoles={["VENDOR"]}>
            <AddService />
          </ProtectedRoute>
        }
      />

      <Route
        path="/vendor/edit-service/:id"
        element={
          <ProtectedRoute allowedRoles={["VENDOR"]}>
            <EditService />
          </ProtectedRoute>
        }
      />

      {/* ================= CUSTOMER ================= */}

      <Route
        path="/customer"
        element={
          <ProtectedRoute allowedRoles={["CUSTOMER"]}>
            <CustomerDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/customer/profile"
        element={
          <ProtectedRoute allowedRoles={["CUSTOMER"]}>
            <CustomerProfile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/customer/services"
        element={
          <ProtectedRoute allowedRoles={["CUSTOMER"]}>
            <ServiceList />
          </ProtectedRoute>
        }
      />

      <Route
        path="/customer/service/:serviceId"
        element={
          <ProtectedRoute allowedRoles={["CUSTOMER"]}>
            <ServiceDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/customer/cart"
        element={
          <ProtectedRoute allowedRoles={["CUSTOMER"]}>
            <CustomerCart />
          </ProtectedRoute>
        }
      />

      <Route
        path="/customer/billing"
        element={
          <ProtectedRoute allowedRoles={["CUSTOMER"]}>
            <CustomerBilling />
          </ProtectedRoute>
        }
      />

      <Route
        path="/customer/billing/:serviceId"
        element={
          <ProtectedRoute allowedRoles={["CUSTOMER"]}>
            <CustomerBilling />
          </ProtectedRoute>
        }
      />

      <Route
        path="/customer/saved-vendors"
        element={
          <ProtectedRoute allowedRoles={["CUSTOMER"]}>
            <SavedVendors />
          </ProtectedRoute>
        }
      />

      <Route
        path="/customer/bookings"
        element={
          <ProtectedRoute allowedRoles={["CUSTOMER"]}>
            <MyBookings />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>

  );

};

export default AppRoutes;
