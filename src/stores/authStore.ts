import { supabase } from '@/lib/supabase';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AuthState {
  user: any | null;
  loading: boolean;
  getUser: () => Promise<void>;
  signInUser: (
    email: string,
    password: string
  ) => Promise<{ error: string | null }>;
  signOutUser: () => Promise<void>;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      loading: false,

      getUser: async () => {
        console.log('GETuSER');
        set({ loading: true });
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error(error.message);
          set({ user: null, loading: false });
        } else {
          set({ user: data.session?.user ?? null, loading: false });
        }
      },

      signInUser: async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          return { error: error.message };
        }

        set({ user: data.user });
        return { error: null };
      },

      signOutUser: async () => {
        console.log('Sign Out');
        await supabase.auth.signOut();
        set({ user: null });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default useAuthStore;
