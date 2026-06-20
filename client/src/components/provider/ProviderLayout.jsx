import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const ProviderLayout = () => {
  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <Sidebar />
      <div className="flex-1 bg-gig-light overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default ProviderLayout;
