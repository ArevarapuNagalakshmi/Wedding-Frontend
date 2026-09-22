import React, { createContext, useEffect, useState } from "react";

export const CartContext = createContext(null);

const CART_STORAGE_KEY = "customerCartItems";
const SAVED_VENDORS_STORAGE_KEY = "savedVendors";

const loadFromStorage = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => loadFromStorage(CART_STORAGE_KEY, []));
  const [savedVendors, setSavedVendors] = useState(() => loadFromStorage(SAVED_VENDORS_STORAGE_KEY, []));

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem(SAVED_VENDORS_STORAGE_KEY, JSON.stringify(savedVendors));
  }, [savedVendors]);

  const getVendorId = (vendor) => vendor?.vendorId || vendor?.id || vendor?.vendor?.id || vendor?._id || "";
  const getVendorName = (vendor, id) =>
    vendor?.vendorName || vendor?.name || vendor?.vendor?.name || `Vendor ${id}`;

  const addToCart = (service) => {
    if (!service?.id) return;

    setCartItems((current) => {
      if (current.some((item) => item.id === service.id)) {
        return current;
      }

      const vendorId = getVendorId(service);
      const vendorName = getVendorName(service, vendorId || "");

      return [
        ...current,
        {
          id: service.id,
          name: service.name || service.title || "Service",
          price: service.price || 0,
          vendorId,
          vendorName,
          description: service.description || "",
          category: service.category || "",
          city: service.city || "",
        },
      ];
    });
  };

  const removeFromCart = (serviceId) => {
    setCartItems((current) => current.filter((item) => item.id !== serviceId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const toggleSaveVendor = (vendor) => {
    const vendorId = getVendorId(vendor);
    if (!vendorId) return;

    const vendorName = getVendorName(vendor, vendorId);

    setSavedVendors((current) => {
      const existing = current.find((item) => item.vendorId === vendorId);
      if (existing) {
        return current.filter((item) => item.vendorId !== vendorId);
      }

      return [
        ...current,
        {
          vendorId,
          vendorName,
        },
      ];
    });
  };

  const isServiceInCart = (serviceId) => cartItems.some((item) => item.id === serviceId);

  const isVendorSaved = (vendorId) => savedVendors.some((item) => item.vendorId === vendorId);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        savedVendors,
        cartCount: cartItems.length,
        addToCart,
        removeFromCart,
        clearCart,
        toggleSaveVendor,
        isServiceInCart,
        isVendorSaved,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
