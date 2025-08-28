import axios from "axios";
import React, { createContext, useEffect, useState } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState("");
  const [food_list, setFoodList] = useState([]);
  const url = "http://localhost:4000";

  // Configure Axios instance
  const api = axios.create({
    baseURL: url,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Interceptor: attach JWT as Authorization: Bearer <token>
  api.interceptors.request.use(
    (config) => {
      // Always get the fresh token from state
      const currentToken = token || localStorage.getItem("token");
      if (currentToken) {
        config.headers.Authorization = `Bearer ${currentToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  const addToCart = async (itemId) => {
    setCartItems((prev) => {
      const newCartItems = { ...prev };
      newCartItems[itemId] = (newCartItems[itemId] || 0) + 1;
      return newCartItems;
    });

    if (token) {
      try {
        await api.post("/api/cart/add", { itemId });
      } catch (error) {
        console.error("Failed to add item to cart on server:", error);
      }
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => {
      const newCartItems = { ...prev };
      if (newCartItems[itemId] > 1) {
        newCartItems[itemId] -= 1;
      } else {
        delete newCartItems[itemId];
      }
      return newCartItems;
    });

    if (token) {
      try {
        await api.post("/api/cart/remove", { itemId });
      } catch (error) {
        console.error("Failed to remove item from cart on server:", error);
      }
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = food_list.find((product) => product._id === item);
        if (itemInfo) {
          totalAmount += Number(itemInfo.price) * cartItems[item];
        }
      }
    }
    return totalAmount;
  };

  const fetchFoodList = async () => {
    try {
      const response = await api.get("/api/food/list");
      setFoodList(response.data.data);
    } catch (error) {
      console.error("Error fetching food list:", error);
    }
  };

  const loadCartData = async () => {
    if (!token) return;
    try {
      const response = await api.post("/api/cart/get");
      setCartItems(response.data.cartData || {});
    } catch (error) {
      console.error("Could not load cart data", error);
    }
  };

  // Login function to handle setting the token
  const login = (userToken) => {
    setToken(userToken);
    localStorage.setItem("token", userToken);
    loadCartData(); // Load cart data immediately after login
  };

  // Logout function to properly clear user session.
  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setCartItems({});
  };

  // Load food list and token (if available) on mount
  useEffect(() => {
    async function loadData() {
      await fetchFoodList();
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
      }
    }
    loadData();
  }, []);

  // Reload cart when token changes
  useEffect(() => {
    if (token) {
      loadCartData();
    }
  }, [token]);

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
    logout,
    login,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
