"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type CartItem = {
  id: any;
  cartItemId?: string; // ✨ NEW: Unique signature for variations
  name: string;
  price: number;
  image: string;
  category: string;
  quantity: number;
  color?: string;
  customText?: string;
  note?: string;
};

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (cartItemId: string | number) => void;
  updateQuantity: (cartItemId: string | number, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load from local storage
  useEffect(() => {
    const stored = localStorage.getItem('cartio_cart');
    if (stored) {
      try { setCartItems(JSON.parse(stored)); } catch (e) {}
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem('cartio_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (newItem: CartItem) => {
    setCartItems(prev => {
      // ✨ CORE FIX: Create a unique signature for this specific variation
      const signature = `${newItem.id}-${newItem.color || 'none'}-${newItem.customText || 'none'}-${newItem.note || 'none'}`;

      const existingIndex = prev.findIndex(item => {
        const itemSignature = item.cartItemId || `${item.id}-${item.color || 'none'}-${item.customText || 'none'}-${item.note || 'none'}`;
        return itemSignature === signature;
      });

      // If exact same product + color + note exists, increase quantity
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex].quantity += (newItem.quantity || 1);
        return updated;
      }

      // Otherwise, add as a completely new item in the cart!
      return [...prev, { ...newItem, cartItemId: signature }];
    });
  };

  // We now remove items based on their unique signature, not just their DB ID
  const removeFromCart = (cartItemIdOrId: string | number) => {
    setCartItems(prev => prev.filter(item => {
      const idToCheck = item.cartItemId || item.id;
      return idToCheck !== cartItemIdOrId;
    }));
  };

  const updateQuantity = (cartItemIdOrId: string | number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemIdOrId);
      return;
    }
    setCartItems(prev => prev.map(item => {
      const idToCheck = item.cartItemId || item.id;
      if (idToCheck === cartItemIdOrId) {
        return { ...item, quantity };
      }
      return item;
    }));
  };

  const clearCart = () => setCartItems([]);

  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, subtotal }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};