import CMSWrapper from '@/components/CMSWrapper';
import PortfolioWrapper from '@/components/PortfolioWrapper';
import DashboardPage from '@/pages/Dashboard';
import HomePage from '@/pages/Home';
import SignInPage from '@/pages/SignIn';
import { createBrowserRouter } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <PortfolioWrapper />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
    ],
  },
  {
    path: '/dashboard',
    element: <CMSWrapper />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'sign-in',
        element: <SignInPage />,
      },
    ],
  },
]);

export default router;
