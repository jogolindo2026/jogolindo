import { create } from 'zustand';
import { User } from '../types';
import { supabase, testConnection } from '../lib/supabase';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isEmailConfirmationRequired: boolean;

  // Init
  initialize: () => Promise<void>;

  // Auth
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  register: (userData: Partial<User>, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  resendConfirmation: (email: string) => Promise<void>;

  // Profile
  updateProfile: (userData: Partial<User>) => Promise<void>;
  deleteProfile: () => Promise<void>;
  fetchUserProfile: () => Promise<void>;

  // System
  logout: () => Promise<void>;
  clearError: () => void;
  testSupabaseConnection: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isEmailConfirmationRequired: false,

  clearError: () => set({ error: null }),

  testSupabaseConnection: async () => {
    console.log('🔄 Testando conexão...');
    return await testConnection();
  },

  initialize: async () => {
    try {
      console.log('🚀 Inicializando Auth...');
      set({ isLoading: true });
      await get().fetchUserProfile();
    } catch (err) {
      console.error('❌ Erro no initialize:', err);
    } finally {
      set({ isLoading: false });
    }
  },

  // =====================
  // FETCH PROFILE (CORRIGIDO)
  // =====================
  fetchUserProfile: async () => {
    try {
      console.log('🔄 Buscando usuário...');
      const { data, error } = await supabase.auth.getUser();

      if (error || !data.user) {
        set({ user: null, isAuthenticated: false });
        return;
      }

      const { data: userData, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError) {
        console.error('❌ Erro perfil:', profileError);
        return;
      }

      if (userData) {
        // Mapeamento simplificado: nomes iguais aos da tabela do Supabase
        const user: User = {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          role: userData.role,
          phone: userData.phone || '',
          gender: userData.gender || '',
          birth_date: userData.birth_date || '', // Linha 94 corrigida
          country: userData.country || '',
          city: userData.city || '',
          position: userData.position || '',
          company: userData.company || '',
          is_profile_public: userData.is_profile_public ?? true,
          profile_picture: userData.profile_picture || '',
          height: userData.height || undefined,
          weight: userData.weight || undefined,
          created_at: userData.created_at,
        };

        set({ user, isAuthenticated: true });
      }
    } catch (err) {
      console.error('❌ Erro fetchUserProfile:', err);
      set({ user: null, isAuthenticated: false });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (data.user) {
        await get().fetchUserProfile();
        return true;
      }
      return false;
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  loginWithGoogle: async () => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/auth/callback` }
      });
      if (error) throw error;
      return true;
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      return false;
    }
  },

  register: async (userData, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email!,
        password,
        options: { data: { name: userData.name, role: userData.role } }
      });
      if (error) throw error;
      if (data.user) {
        await supabase.from('users').insert([{
          id: data.user.id,
          email: userData.email,
          name: userData.name,
          role: userData.role
        }]);
        if (!data.session) {
          set({ isEmailConfirmationRequired: true });
        } else {
          await get().fetchUserProfile();
        }
      }
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  resetPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      });
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  updatePassword: async (newPassword) => {
    set({ isLoading: true, error: null });
    try {
      await supabase.auth.updateUser({ password: newPassword });
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  resendConfirmation: async (email) => {
    set({ isLoading: true, error: null });
    try {
      await supabase.auth.resend({ type: 'signup', email });
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  updateProfile: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const user = get().user;
      if (!user) throw new Error('Não autenticado');
      const { error } = await supabase.from('users').update(userData).eq('id', user.id);
      if (error) throw error;
      await get().fetchUserProfile();
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const user = get().user;
      if (!user) return;
      await supabase.from('users').delete().eq('id', user.id);
      await supabase.auth.signOut();
      set({ user: null, isAuthenticated: false });
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    try {
      await supabase.auth.signOut();
      set({
        user: null,
        isAuthenticated: false,
        error: null,
        isLoading: false,
        isEmailConfirmationRequired: false
      });
      console.log('✅ Logout OK');
    } catch (err) {
      console.error('❌ Erro logout:', err);
    }
  }
}));