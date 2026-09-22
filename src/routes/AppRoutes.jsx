import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../components/common/ProtectedRoute";

// Public Pages
import Login from "../pages/Login";
import Register from "../pages/Register";
import Unauthorized from "../pages/Unauthorized";
import About from "../pages/About";
import Contact from "../pages/Contact";
import ForgotPassword from "../pages/ForgotPassword";
import VendorProfilePage from "../pages/VendorProfilePage";
import HomeOrProfile from "../pages/HomeOrProfile";
import PlanningTips from "../pages/PlanningTips";

// Dashboards
import AdminDashboard from "../components/admin/AdminDashboard";
import VendorLayout from "../components/vendor/VendorLayout";
import VendorHome from "../components/vendor/VendorHome";
import VendorDashboardPage from "../components/vendor/VendorDashboard";
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

      <Route path="/" element={<HomeOrProfile />} />

      <Route path="/login" element={<Login />} />

      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route path="/register" element={<Register />} />

      <Route path="/about" element={<About />} />

      <Route path="/contact" element={<Contact />} />

      <Route path="/unauthorized" element={<Unauthorized />} />

      <Route path="/vendor/:vendorId" element={<VendorProfilePage />} />

      <Route path="/planning-tips" element={<PlanningTips />} />


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
            <VendorLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<VendorHome />} />
        <Route path="dashboard" element={<VendorDashboardPage />} />
        <Route path="profile" element={<VendorProfile />} />
        <Route path="services" element={<MyServices />} />
        <Route path="add-service" element={<AddService />} />
        <Route path="edit-service/:id" element={<EditService />} />
      </Route>

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
