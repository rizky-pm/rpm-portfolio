import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

interface Skill {
  id: string;
  name: string;
  icon_url: string | null;
}

interface SkillsSection {
  id: string;
  title: string;
  description: string;
}

interface SkillsState {
  loading: boolean;
  error: string | null;
  section: SkillsSection | null;
  skills: Skill[];
  fetchSection: () => Promise<void>;
  updateSection: (title: string, description: string) => Promise<void>;
  fetchSkills: () => Promise<void>;
  addSkill: (name: string, iconFile?: File) => Promise<void>;
  updateSkill: (id: string, name: string, iconFile?: File) => Promise<void>;
  deleteSkill: (id: string) => Promise<void>;
}

const useSkillsState = create<SkillsState>((set, get) => ({
  loading: false,
  error: null,
  section: null,
  skills: [],

  fetchSection: async () => {
    set({ loading: true, error: null });

    const { data, error } = await supabase
      .from('skills_section')
      .select('*')
      .single();

    if (error) set({ error: error.message });
    else set({ section: data });

    set({ loading: false });
  },

  updateSection: async (title, description) => {
    set({ loading: true, error: null });

    try {
      const current = get().section;

      if (current) {
        const { error } = await supabase
          .from('skills_section')
          .update({ title, description, updated_at: new Date() })
          .eq('id', current.id);

        if (error) throw error;

        set({ section: { ...current, title, description } });
      } else {
        const { data, error } = await supabase
          .from('skills_section')
          .insert([{ title, description }])
          .select()
          .single();

        if (error) throw error;
        set({ section: data });
      }
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  fetchSkills: async () => {
    set({ loading: true, error: null });

    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) set({ error: error.message });
    else set({ skills: data });

    set({ loading: false });
  },

  addSkill: async (name, iconFile) => {
    set({ loading: true, error: null });

    try {
      let icon_url = null;

      if (iconFile) {
        const fileExt = iconFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { data, error } = await supabase.storage
          .from('skills')
          .upload(fileName, iconFile);

        if (error) throw error;

        const { data: publicUrlData } = supabase.storage
          .from('skills')
          .getPublicUrl(data.path);

        icon_url = publicUrlData.publicUrl;
      }

      const { data, error } = await supabase
        .from('skills')
        .insert([{ name, icon_url }])
        .select()
        .single();

      if (error) throw error;

      set((state) => ({ skills: [...state.skills, data] }));
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  updateSkill: async (id, name, iconFile) => {
    set({ loading: true, error: null });

    try {
      let icon_url = undefined;

      if (iconFile) {
        const fileExt = iconFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { data, error } = await supabase.storage
          .from('skills')
          .upload(fileName, iconFile);

        if (error) throw error;

        const { data: publicUrlData } = supabase.storage
          .from('skills')
          .getPublicUrl(data.path);

        icon_url = publicUrlData.publicUrl;
      }

      const { data, error } = await supabase
        .from('skills')
        .update({ name, ...(icon_url && { icon_url }) })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      set((state) => ({
        skills: state.skills.map((s) => (s.id === id ? data : s)),
      }));
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  deleteSkill: async (id) => {
    set({ loading: true, error: null });

    try {
      const { error } = await supabase.from('skills').delete().eq('id', id);
      if (error) throw error;

      set((state) => ({
        skills: state.skills.filter((s) => s.id !== id),
      }));
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },
}));

export default useSkillsState;
