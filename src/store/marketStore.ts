import { create } from 'zustand';
import { Product } from '../types';
import { mockProducts } from '../utils/mockData';

interface CartItem {
  product: Product;
  quantity: number;
}

interface MarketState {
  products: Product[];
  cart: CartItem[];
  isLoading: boolean;
  error: string | null;
  
  fetchProducts: () => Promise<void>;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
}

export const useMarketStore = create<MarketState>((set, get) => ({
  products: [],
  cart: [],
  isLoading: false,
  error: null,
  
  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 600));
      
      set({ products: mockProducts, isLoading: false });
    } catch (error) {
      set({ error: 'Erro ao carregar produtos', isLoading: false });
    }
  },
  
  addToCart: (product, quantity = 1) => {
    set(state => {
      const existingItem = state.cart.find(item => item.product.id === product.id);
      
      if (existingItem) {
        return {
          cart: state.cart.map(item => 
            item.product.id === product.id 
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        };
      } else {
        return { cart: [...state.cart, { product, quantity }] };
      }
    });
  },
  
  removeFromCart: (productId) => {
    set(state => ({
      cart: state.cart.filter(item => item.product.id !== productId)
    }));
  },
  
  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(productId);
      return;
    }
    
    set(state => ({
      cart: state.cart.map(item => 
        item.product.id === productId 
          ? { ...item, quantity }
          : item
      )
    }));
  },
  
  clearCart: () => {
    set({ cart: [] });
  },
  
  getCartTotal: () => {
    return get().cart.reduce(
      (total, item) => total + (item.product.price * item.quantity), 
      0
    );
  }
}));