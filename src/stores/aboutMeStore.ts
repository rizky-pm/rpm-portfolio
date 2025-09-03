import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

interface AboutMe {
  id: string;
  title: string;
  description: string;
}

interface AboutMeState {
  aboutMe: AboutMe | null;
  loading: boolean;
  error: string | null;
  fetchAbout: () => Promise<void>;
  updateAbout: (updatedData: Partial<AboutMe>) => Promise<void>;
}

const useAboutMeState = create<AboutMeState>((set) => ({
  aboutMe: null,
  loading: false,
  error: null,

  fetchAbout: async () => {
    set({ loading: true, error: null });

    const { data, error } = await supabase
      .from('about_me')
      .select('*')
      .limit(1)
      .single();

    if (error) {
      set({ loading: false, error: error.message });
    } else {
      set({ aboutMe: data, loading: false });
    }
  },

  updateAbout: async (updatedData) => {
    set({ loading: true, error: null });

    const { data: existing } = await supabase
      .from('about_me')
      .select('id')
      .limit(1)
      .single();

    let data, error;

    if (existing) {
      ({ data, error } = await supabase
        .from('about_me')
        .update(updatedData)
        .eq('id', existing.id)
        .select()
        .single());
    } else {
      ({ data, error } = await supabase
        .from('about_me')
        .insert(updatedData)
        .select()
        .single());
    }

    if (error) {
      set({ loading: false, error: error.message });
    } else {
      set({ aboutMe: data, loading: false });
    }
  },
}));

export default useAboutMeState;
