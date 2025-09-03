import { useEffect } from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import useAuthStore from '@/stores/authStore';
import { Button } from './ui/button';
import { LogOut } from 'lucide-react';

const CMSWrapper = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading, getUser, signOutUser } = useAuthStore();
  const isSignInPage = location.pathname === '/dashboard/sign-in';

  const handleLogout = async () => {
    try {
      await signOutUser();
      navigate('/dashboard/sign-in');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

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
      <nav className='w-full text-right p-4'>
        <Button variant={'outline'} onClick={handleLogout}>
          <LogOut />
        </Button>
      </nav>
      <Outlet />
    </main>
  );
};

export default CMSWrapper;
