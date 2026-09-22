import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import VendorHeader from "./VendorHeader";
import "../../styles/Dashboard.css";

const VendorLayout = () => {
  const location = useLocation();
  const isDashboard = location.pathname === "/vendor/dashboard";

  return (
    <div className={`vendor-dashboard-page ${isDashboard ? "vendor-dashboard-shell" : "vendor-home-shell"}`}>
      <VendorHeader />
      <div className="vendor-dashboard-main">
        <Outlet />
      </div>
    </div>
  );
};

export default VendorLayout;
