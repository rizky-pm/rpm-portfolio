import { Button } from '@/components/ui/button';
import useAuthStore from '@/stores/authStore';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { signOutUser, user } = useAuthStore();

  const handleLogout = async () => {
    try {
      await signOutUser();
      navigate('/dashboard/sign-in');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div>
      <h1>Hi, {user.email}</h1>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum vel
        fugiat laboriosam id eaque iste corporis, libero dolorum quaerat. Soluta
        illo accusantium ducimus reiciendis optio odio alias voluptate
        aspernatur saepe!
      </p>
      <Button variant={'destructive'} onClick={handleLogout}>
        Sign Out
      </Button>
    </div>
  );
};

export default DashboardPage;
