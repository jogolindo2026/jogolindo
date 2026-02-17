import { create } from 'zustand';
import { TryoutEvent } from '../types';
import { mockTryouts } from '../utils/mockData';

interface TryoutState {
  tryouts: TryoutEvent[];
  isLoading: boolean;
  error: string | null;
  
  fetchTryouts: () => Promise<void>;
  getTryoutById: (id: string) => TryoutEvent | undefined;
  registerForTryout: (tryoutId: string, userId: string) => Promise<boolean>;
}

export const useTryoutStore = create<TryoutState>((set, get) => ({
  tryouts: [],
  isLoading: false,
  error: null,
  
  fetchTryouts: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 700));
      
      set({ tryouts: mockTryouts, isLoading: false });
    } catch (error) {
      set({ error: 'Erro ao carregar peneiras', isLoading: false });
    }
  },
  
  getTryoutById: (id) => {
    return get().tryouts.find(tryout => tryout.id === id);
  },
  
  registerForTryout: async (tryoutId, userId) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // In a real app, this would update a registration database
      // For now, we'll just return success
      set({ isLoading: false });
      return true;
    } catch (error) {
      set({ error: 'Erro ao registrar para peneira', isLoading: false });
      return false;
    }
  }
}));