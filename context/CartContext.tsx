"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define what a cart item looks like
export type CartItem = {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  quantity: number;
};

// Define everything the "Brain" can do
type CartContextType = {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // 1. Load cart from browser memory when they visit the site
  useEffect(() => {
    const savedCart = localStorage.getItem('gobaazaar_cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
    setIsLoaded(true);
  }, []);

  // 2. Save to browser memory every time the cart changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('gobaazaar_cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isLoaded]);

  // 3. Add item (or increase quantity if it already exists)
  const addToCart = (newItem: CartItem) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === newItem.id);
      if (existingItem) {
        return prevItems.map((item) => 
          item.id === newItem.id ? { ...item, quantity: item.quantity + newItem.quantity } : item
        );
      }
      return [...prevItems, newItem];
    });
    
    // Automatically slide the cart open!
    window.dispatchEvent(new Event('openCart'));
  };

  const removeFromCart = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) return;
    setCartItems((prev) => prev.map((item) => item.id === id ? { ...item, quantity } : item));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, subtotal }}>
      {children}
    </CartContext.Provider>
  );
}

// Helper hook to use the cart anywhere in your app
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};