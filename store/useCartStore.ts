import { create } from 'zustand';
import { persist } from 'zustand/middleware'; // 👈 අලුතින් ගෙනාපු Local Storage මතකය

interface CartItem {
  id?: number;
  name: string;
  price: string;
  image_url: string;
  item_code: string;
  quantity: number;
}

interface CartStore {
  cart: CartItem[];
  isCartOpen: boolean;
  addToCart: (item: any) => void;
  removeFromCart: (item_code: string) => void;
  decreaseQuantity: (item_code: string) => void;
  clearCart: () => void;
  toggleCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      cart: [],
      isCartOpen: false,
      
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

      addToCart: (item) => set((state) => {
        const existingItem = state.cart.find((c) => c.item_code === item.item_code);
        if (existingItem) {
          return { 
            cart: state.cart.map((c) => 
              c.item_code === item.item_code ? { ...c, quantity: c.quantity + 1 } : c
            ) 
          };
        }
        return { cart: [...state.cart, { ...item, quantity: 1 }] };
      }),

      decreaseQuantity: (item_code) => set((state) => ({
        cart: state.cart.map((c) => 
          c.item_code === item_code ? { ...c, quantity: Math.max(1, c.quantity - 1) } : c
        )
      })),

      removeFromCart: (item_code) => set((state) => ({
        cart: state.cart.filter((c) => c.item_code !== item_code)
      })),

      clearCart: () => set({ cart: [] }),
    }),
    {
      name: 'sk-cart-storage', // 👈 මේ නමින් තමයි Browser එකේ දත්ත සේව් වෙන්නේ
    }
  )
);