// src/context/CartContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';

// Create the Cart Context
const CartContext = createContext();

// Custom hook to use the Cart Context
export const useCart = () => {
  return useContext(CartContext);
};

// Cart Provider Component
export const CartProvider = ({ children }) => {
  // Initialize cart from localStorage or an empty array
  const [cartItems, setCartItems] = useState(() => {
    try {
      const localCart = localStorage.getItem('cartItems');
      return localCart ? JSON.parse(localCart) : [];
    } catch (error) {
      console.error("Failed to parse cart items from localStorage:", error);
      return []; // Return empty array if parsing fails
    }
  });

  // Effect to save cart items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // Function to add an item to the cart
  const addToCart = (product, quantity = 1, selectedSize = null) => {
    // Create a unique ID for the cart item based on product ID and size
    // This ensures different sizes of the same product are treated as separate items
    const cartItemId = selectedSize ? `${product._id}-${selectedSize}` : product._id;

    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item._id === product._id && item.selectedSize === selectedSize
      );

      if (existingItemIndex > -1) {
        // If item already exists, update its quantity
        const updatedItems = [...prevItems];
        const existingItem = updatedItems[existingItemIndex];
        updatedItems[existingItemIndex] = {
          ...existingItem,
          quantity: existingItem.quantity + quantity,
        };
        return updatedItems;
      } else {
        // If item is new, add it to the cart
        return [
          ...prevItems,
          {
            _id: product._id, // Keep product ID for reference
            name: product.name,
            // Changed from 'image: product.image' to 'images: product.images'
            images: product.images, // Store the array of images
            price: product.price,
            countInStock: product.countInStock, // Keep stock info for validation
            quantity,
            selectedSize,
          },
        ];
      }
    });
  };

  // Function to remove an item from the cart
  const removeFromCart = (productId, selectedSize = null) => {
    setCartItems((prevItems) =>
      prevItems.filter(
        (item) => !(item._id === productId && item.selectedSize === selectedSize)
      )
    );
  };

  // Function to update the quantity of an item
  const updateQuantity = (productId, selectedSize, newQuantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item._id === productId && item.selectedSize === selectedSize
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  // Function to clear the entire cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Calculate total number of items in the cart (for Navbar badge)
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Calculate total price of items in the cart
  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
