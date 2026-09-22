import React, { useEffect, useState } from "react";
import { BrowserRouter, useLocation } from "react-router-dom";

import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import AppRoutes from "./routes/AppRoutes";

import "./styles/app.css";

const AppShell = () => {
  const [normalBg, setNormalBg] = useState(true);
  const location = useLocation();
  const isVendorRoute = location.pathname === "/vendor" || location.pathname.startsWith("/vendor/");

  useEffect(() => {
    // keep body and main background in sync with toggle state
    const body = document.body;
    if (normalBg) {
      body.classList.remove("bg-white");
      body.classList.add("bg-normal");
    } else {
      body.classList.remove("bg-normal");
      body.classList.add("bg-white");
    }

    // ensure .app-content also reflects the chosen background
    const appContent = document.querySelector(".app-content");
    if (appContent) {
      appContent.classList.toggle("bg-white", !normalBg);
      appContent.classList.toggle("bg-normal", normalBg);
    }
  }, [normalBg]);

  const toggleBackground = () => setNormalBg((s) => !s);

  return (
    <div className="app-layout">

      {!isVendorRoute && <Navbar onToggleBg={toggleBackground} normalBg={normalBg} />}

      <main className="app-content">
        <AppRoutes />
      </main>

      <Footer />

    </div>
  );

};

const App = () => (
  <BrowserRouter>
    <AppShell />
  </BrowserRouter>
);

export default App;
