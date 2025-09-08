import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { ExperienceListFormType } from '@/pages/Dashboard/components/Experiences/schema';

export interface Experience {
  id: string;
  employer: string;
  role: string;
  start_date: string;
  end_date?: string | null;
  location: string;
  description: string;
  created_at: string;
}

interface ExperienceState {
  experiences: Experience[];
  loading: boolean;
  error: string | null;

  fetchExperiences: () => Promise<void>;
  addExperience: (data: ExperienceListFormType) => Promise<number | undefined>;
  updateExperience: (id: string, data: ExperienceListFormType) => Promise<void>;
  deleteExperience: (id: string) => Promise<number | undefined>;
}

const useExperienceStore = create<ExperienceState>((set, get) => ({
  experiences: [],
  loading: false,
  error: null,

  // 📌 Fetch all experiences
  fetchExperiences: async () => {
    set({ loading: true, error: null });
    const { data, error } = await supabase
      .from('experience_list')
      .select('*')
      .order('start_date', { ascending: false });

    if (error) {
      set({ error: error.message, loading: false });
      return;
    }

    set({ experiences: data || [], loading: false });
  },

  // 📌 Add new experience
  addExperience: async (data: ExperienceListFormType) => {
    set({ loading: true, error: null });

    const { error, status } = await supabase.from('experience_list').insert([
      {
        employer: data.employer,
        role: data.role,
        start_date: data.start_date,
        end_date: data.end_date || null,
        employment_type: data.employment_type,
        location: data.location,
        description: data.description,
      },
    ]);

    if (error) {
      set({ error: error.message, loading: false });
      return;
    }

    await get().fetchExperiences();
    set({ loading: false });

    return status;
  },

  // 📌 Update existing experience
  updateExperience: async (id: string, data: ExperienceListFormType) => {
    set({ loading: true, error: null });

    const { error } = await supabase
      .from('experience_list')
      .update({
        employer: data.employer,
        role: data.role,
        start_date: data.start_date,
        end_date: data.end_date || null,
        employment_type: data.employment_type,
        location: data.location,
        description: data.description,
      })
      .eq('id', id);

    if (error) {
      set({ error: error.message, loading: false });
      return;
    }

    await get().fetchExperiences();
    set({ loading: false });
  },

  // 📌 Delete experience
  deleteExperience: async (id: string) => {
    set({ loading: true, error: null });

    const { error, status } = await supabase
      .from('experience_list')
      .delete()
      .eq('id', id);

    if (error) {
      set({ error: error.message, loading: false });
      return;
    }

    set({
      experiences: get().experiences.filter((exp) => exp.id !== id),
      loading: false,
    });

    return status;
  },
}));

export default useExperienceStore;
