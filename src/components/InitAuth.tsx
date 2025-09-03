// src/components/InitAuth.tsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { initAuth, setUser } from '@/stores/slices/authSlice';
import { supabase } from '@/lib/supabase';
import type { RootState, AppDispatch } from '@/stores';

const InitAuth = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector((state: RootState) => state.auth.loading);

  useEffect(() => {
    dispatch(initAuth());

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        dispatch(setUser(session?.user ?? null));
      }
    );

    return () => {
      subscription.subscription.unsubscribe();
    };
  }, [dispatch]);

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <p className='text-gray-600'>Loading authentication...</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default InitAuth;
