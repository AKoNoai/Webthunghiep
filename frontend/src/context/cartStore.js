import { create } from 'zustand';

const useCartStore = create((set, get) => ({
  items: JSON.parse(localStorage.getItem('cart')) || [],
  
  addItem: (product, quantity = 1) => {
    set((state) => {
      const existingItem = state.items.find((item) => item._id === product._id);
      let newItems;
      
      if (existingItem) {
        newItems = state.items.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newItems = [...state.items, { ...product, quantity }];
      }
      
      localStorage.setItem('cart', JSON.stringify(newItems));
      return { items: newItems };
    });
  },

  removeItem: (productId) => {
    set((state) => {
      const newItems = state.items.filter((item) => item._id !== productId);
      localStorage.setItem('cart', JSON.stringify(newItems));
      return { items: newItems };
    });
  },

  updateQuantity: (productId, quantity) => {
    set((state) => {
      const newItems = state.items.map((item) =>
        item._id === productId
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      );
      localStorage.setItem('cart', JSON.stringify(newItems));
      return { items: newItems };
    });
  },

  clearCart: () => {
    localStorage.removeItem('cart');
    set({ items: [] });
  },

  getTotalPrice: () => {
    const state = get();
    return state.items.reduce((total, item) => total + item.price * item.quantity, 0);
  },

  getTotalItems: () => {
    const state = get();
    return state.items.reduce((total, item) => total + item.quantity, 0);
  },
}));

export default useCartStore;
