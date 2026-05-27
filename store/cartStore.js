"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set) => ({
      cart: [],
      discountPercent: 0,

      addToCart: (product) =>
        set((state) => ({
          cart: [...state.cart, product],
        })),

      removeFromCart: (id) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== id),
        })),

      clearCart: () => set({ cart: [] }),

      setDiscountPercent: (discountPercent) =>
        set({ discountPercent: Number(discountPercent) || 0 }),
    }),
    {
      name: "cart",
    }
  )
);
