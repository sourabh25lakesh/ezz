  import { createContext, useContext, useState, useEffect } from "react";
  import { authFetch } from "../utils/auth";

  const CartContext = createContext();

  export const CartProvider = ({ children }) => {
    const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);

    // FETCH CART
    const fetchCart = async () => {
      try {
        const res = await authFetch(`${BASEURL}/api/cart/`);

        if (!res.ok) {
          console.error("Cart fetch failed:", res.status);
          return;
        }

        const data = await res.json();

        console.log("Cart data:", data);

        setCartItems(data.items || []);
        setTotal(data.total || 0);

      } catch (err) {
        console.error("Fetch cart error:", err);
      }
    };

    useEffect(() => {
      fetchCart();
    }, []);

    // ADD TO CART
    const addToCart = async (productId) => {
      try {
        const res = await authFetch(`${BASEURL}/api/cart/add/`, {
          method: "POST",
          body: JSON.stringify({ product_id: productId }),
        });

        if (!res.ok) {
          console.error("Add failed:", res.status);
          return;
        }

        const data = await res.json();

        console.log("Added:", data);

        if (data.cart) {
          setCartItems(data.cart.items || []);
          setTotal(data.cart.total || 0);
        } else {
          fetchCart();
        }

      } catch (err) {
        console.error("Add error:", err);
      }
    };

    // REMOVE ITEM
    const removeFromCart = async (itemId) => {
      try {
        const res = await authFetch(`${BASEURL}/api/cart/remove/`, {
          method: "POST",
          body: JSON.stringify({ item_id: itemId }),
        });

        if (!res.ok) {
          console.error("Remove failed:", res.status);
          return;
        }

        fetchCart();

      } catch (err) {
        console.error("Remove error:", err);
      }
    };

    // UPDATE QUANTITY
    const updateQuantity = async (itemId, quantity) => {
      try {
        if (quantity < 1) {
          return removeFromCart(itemId);
        }

        const res = await authFetch(`${BASEURL}/api/cart/update/`, {
          method: "POST",
          body: JSON.stringify({
            item_id: itemId,
            quantity: quantity,
          }),
        });

        if (!res.ok) {
          console.error("Update failed:", res.status);
          return;
        }

        fetchCart();

      } catch (err) {
        console.error("Update error:", err);
      }
    };

    // CLEAR CART (FRONTEND ONLY)
    const clearCart = () => {
      setCartItems([]);
      setTotal(0);
    };

    return (
      <CartContext.Provider
        value={{
          cartItems,
          total,
          addToCart,
          removeFromCart,
          updateQuantity,
          clearCart,
        }}
      >
        {children}
      </CartContext.Provider>
    );
  };

  export const useCart = () => useContext(CartContext);