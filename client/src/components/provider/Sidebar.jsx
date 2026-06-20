import { NavLink } from 'react-router-dom';
import { FaChartBar, FaUser, FaList, FaSignOutAlt } from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';

const links = [
  { to: '/provider/dashboard', icon: FaChartBar, label: 'Dashboard' },
  { to: '/provider/profile', icon: FaUser, label: 'Profile' },
  { to: '/gigs/my', icon: FaList, label: 'My Gigs' },
];

const Sidebar = () => {
  const { logout } = useAuth();

  return (
    <aside className="w-64 bg-gig-dark flex flex-col flex-shrink-0">
      <div className="h-4" />
      <nav className="flex-1 px-3 space-y-1">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-gig-teal text-white'
                  : 'text-gray-300 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <Icon size={16} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="px-3 pb-6">
        <button
          onClick={logout}
          className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
        >
          <FaSignOutAlt size={16} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
