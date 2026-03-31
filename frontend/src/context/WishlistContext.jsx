import { createContext, useContext, useState } from "react";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem("cf_wishlist") || "[]"); }
    catch { return []; }
  });

  // Returns true if college was ADDED, false if REMOVED
  const toggle = (college) => {
    let added = false;
    setWishlist((prev) => {
      const exists = prev.some((c) => c._id === college._id);
      added = !exists;
      const next = exists
        ? prev.filter((c) => c._id !== college._id)
        : [...prev, college];
      localStorage.setItem("cf_wishlist", JSON.stringify(next));
      return next;
    });
    return added;
  };

  const isSaved = (id) => wishlist.some((c) => c._id === id);

  return (
    <WishlistContext.Provider value={{ wishlist, toggle, isSaved }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);
