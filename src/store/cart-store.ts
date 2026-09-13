"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getCartLineKey } from "@/lib/bundles/catalog";
import { getPrimaryImageUrl } from "@/lib/products/images";
import type { Bundle } from "@/types/bundle";
import type { CartItem, Product } from "@/types/product";

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  bumpKey: number;
  addItem: (product: Product, quantity?: number) => void;
  addBundle: (bundle: Bundle, quantity?: number) => void;
  addItems: (
    entries: {
      product: Product;
      quantity: number;
      fbtDiscountEligible?: boolean;
    }[],
  ) => void;
  updateQuantity: (lineKey: string, quantity: number) => void;
  removeItem: (lineKey: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
  hasFrozenItems: () => boolean;
}

function bundleUnitPrice(bundle: Bundle): number {
  return bundle.priceCents / 100;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      bumpKey: 0,

      addItem: (product, quantity = 1) => {
        set((state) => {
          const lineKey = product.id;
          const existing = state.items.find(
            (item) => getCartLineKey(item) === lineKey,
          );

          const items = existing
            ? state.items.map((item) =>
                getCartLineKey(item) === lineKey
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

      addBundle: (bundle, quantity = 1) => {
        set((state) => {
          const lineKey = bundle.id;
          const existing = state.items.find(
            (item) => getCartLineKey(item) === lineKey,
          );

          const items = existing
            ? state.items.map((item) =>
                getCartLineKey(item) === lineKey
                  ? { ...item, quantity: item.quantity + quantity }
                  : item,
              )
            : [
                ...state.items,
                {
                  bundleId: bundle.id,
                  slug: bundle.slug,
                  name: bundle.name,
                  price: bundleUnitPrice(bundle),
                  quantity,
                  image: getPrimaryImageUrl(bundle.images),
                  shippingClass: "standard" as const,
                  includedText: bundle.includedText,
                },
              ];

          return { items, bumpKey: state.bumpKey + 1, isOpen: true };
        });
      },

      addItems: (entries) => {
        if (entries.length === 0) return;

        set((state) => {
          let items = [...state.items];

          for (const { product, quantity, fbtDiscountEligible } of entries) {
            const lineKey = product.id;
            const existing = items.find(
              (item) => getCartLineKey(item) === lineKey,
            );

            items = existing
              ? items.map((item) =>
                  getCartLineKey(item) === lineKey
                    ? {
                        ...item,
                        quantity: item.quantity + quantity,
                        fbtDiscountEligible:
                          fbtDiscountEligible ?? item.fbtDiscountEligible,
                      }
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
                    fbtDiscountEligible,
                  },
                ];
          }

          return { items, bumpKey: state.bumpKey + 1, isOpen: true };
        });
      },

      updateQuantity: (lineKey, quantity) => {
        if (quantity <= 0) {
          get().removeItem(lineKey);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            getCartLineKey(item) === lineKey ? { ...item, quantity } : item,
          ),
        }));
      },

      removeItem: (lineKey) => {
        set((state) => ({
          items: state.items.filter((item) => getCartLineKey(item) !== lineKey),
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
