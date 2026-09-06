"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getPrimaryImageUrl } from "@/lib/products/images";
import type { CartItem, Product } from "@/types/product";

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  bumpKey: number;
  addItem: (product: Product, quantity?: number) => void;
  addItems: (entries: { product: Product; quantity: number }[]) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
  hasFrozenItems: () => boolean;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      bumpKey: 0,

      addItem: (product, quantity = 1) => {
        set((state) => {
          const existing = state.items.find(
            (item) => item.productId === product.id,
          );

          const items = existing
            ? state.items.map((item) =>
                item.productId === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item,
              )
            : [
                ...state.items,
                {
                  productId: product.id,
                  slug: product.slug,
                  name: product.name,
                  price: product.price,
                  quantity,
                  image: getPrimaryImageUrl(product.images),
                  shippingClass: product.shippingClass,
                },
              ];

          return { items, bumpKey: state.bumpKey + 1, isOpen: true };
        });
      },

      addItems: (entries) => {
        if (entries.length === 0) return;

        set((state) => {
          let items = [...state.items];

          for (const { product, quantity } of entries) {
            const existing = items.find((item) => item.productId === product.id);

            items = existing
              ? items.map((item) =>
                  item.productId === product.id
                    ? { ...item, quantity: item.quantity + quantity }
                    : item,
                )
              : [
                  ...items,
                  {
                    productId: product.id,
                    slug: product.slug,
                    name: product.name,
                    price: product.price,
                    quantity,
                    image: getPrimaryImageUrl(product.images),
                    shippingClass: product.shippingClass,
                  },
                ];
          }

          return { items, bumpKey: state.bumpKey + 1, isOpen: true };
        });
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId ? { ...item, quantity } : item,
          ),
        }));
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        }));
      },

      clearCart: () => set({ items: [] }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      getItemCount: () =>
        get().items.reduce((total, item) => total + item.quantity, 0),

      getSubtotal: () =>
        get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0,
        ),

      hasFrozenItems: () =>
        get().items.some((item) => item.shippingClass === "frozen"),
    }),
    {
      name: "magali-cart",
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
