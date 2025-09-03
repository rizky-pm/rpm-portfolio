import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import useAuthStore from '@/stores/authStore';

const CMSWrapper = () => {
  const location = useLocation();
  const { user, loading, getUser } = useAuthStore();
  const isSignInPage = location.pathname === '/dashboard/sign-in';

  useEffect(() => {
    if (!user) {
      getUser();
    }

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        useAuthStore.setState({ user: session?.user ?? null });
      }
    );

    return () => {
      subscription.subscription.unsubscribe();
    };
  }, [user, getUser]);

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <p className='text-gray-600'>Checking authentication...</p>
      </div>
    );
  }

  if (isSignInPage && user) {
    return <Navigate to='/dashboard' replace />;
  }

  if (!isSignInPage && !user) {
    return <Navigate to='/dashboard/sign-in' replace />;
  }

  return (
    <main className='flex flex-col items-center min-h-screen'>
      <Outlet />
    </main>
  );
};

export default CMSWrapper;
