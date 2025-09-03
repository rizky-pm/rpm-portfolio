import { Outlet } from 'react-router-dom';

const PortfolioWrapper = () => {
  return (
    <main className='flex flex-col items-center'>
      <Outlet />
    </main>
  );
};

export default PortfolioWrapper;
