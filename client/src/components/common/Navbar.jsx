import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useContext } from 'react';
import { FaBars, FaTimes, FaSearch, FaUserAlt, FaChartBar, FaList, FaTags, FaSignOutAlt, FaClipboardList } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';
import { ModeContext } from '../../context/ModeContext';
import NotificationBell from './NotificationBell';
import ModeSwitcher from './ModeSwitcher';

const headerLinks = [
  { to: '/provider/dashboard', label: 'Dashboard', icon: FaChartBar, roles: ['ServiceProvider', 'Customer'] },
  { to: '/provider/profile', label: 'Profile', icon: FaUserAlt, roles: ['ServiceProvider'] },
  { to: '/services', label: 'Services', icon: FaTags, roles: null },
  { to: '/orders/my', label: 'Orders', icon: FaClipboardList, roles: ['Customer', 'ServiceProvider'] },
  { to: '/gigs/my', label: 'My Gigs', icon: FaList, roles: ['ServiceProvider'] },
];

const Navbar = () => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const { isSellerMode } = useContext(ModeContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/services?keyword=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setMobileOpen(false);
  };

  const isActive = (to) => {
    if (to === '/') return location.pathname === '/';
    return location.pathname.startsWith(to);
  };

  return (
    <nav className="bg-gig-dark sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
            <div className="w-9 h-9 bg-gig-teal rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">G</span>
            </div>
            <span className="text-white font-bold text-xl tracking-tight">GIGVERA</span>
          </Link>

          <div className="hidden lg:flex items-center space-x-1">
            {headerLinks.map(({ to, label, icon: Icon, roles }) => {
              if (roles && !isAuthenticated) return null;
              if (roles && !roles.includes(user?.role)) return null;
              if (to === '/gigs/my' && !isSellerMode) return null;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(to)
                      ? 'bg-white/15 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon size={14} />
                  <span>{label}</span>
                </Link>
              );
            })}
          </div>

          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xs mx-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/10 text-white placeholder-gray-400 rounded-lg pl-4 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gig-teal"
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                <FaSearch size={14} />
              </button>
            </div>
          </form>

          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                {user?.role === 'Customer' && (
                  <Link
                    to="/customer/dashboard"
                    className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive('/customer/dashboard')
                        ? 'bg-white/15 text-white'
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <FaChartBar size={14} />
                    <span>Dashboard</span>
                  </Link>
                )}
                <ModeSwitcher />
                <NotificationBell />
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-white hover:text-gig-teal transition-colors">
                    <div className="w-8 h-8 bg-gig-teal rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {user?.fullName?.charAt(0)?.toUpperCase()}
                    </div>
                    <span className="text-sm font-medium">{user?.fullName?.split(' ')[0]}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 hidden group-hover:block border">
                    {user?.role === 'ServiceProvider' && (
                      <>
                        <Link to="/provider/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gig-light">Dashboard</Link>
                        <Link to="/orders/my" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gig-light">Orders</Link>
                        <Link to="/gigs/my" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gig-light">My Gigs</Link>
                        <Link to="/provider/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gig-light">Profile</Link>
                      </>
                    )}
                    {user?.role === 'Customer' && (
                      <>
                        <Link to="/customer/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gig-light">Dashboard</Link>
                        <Link to="/orders/my" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gig-light">Orders</Link>
                        <Link to="/requests/my" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gig-light">My Requests</Link>
                      </>
                    )}
                    <hr className="my-1 border-gray-100" />
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                      <FaSignOutAlt size={12} className="inline mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/services" className="text-gray-300 hover:text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors">Services</Link>
                <Link to="/login" className="text-white border border-white/30 px-4 py-2 rounded-lg text-sm hover:bg-white/10 transition-colors">Login</Link>
                <Link to="/register" className="bg-gig-teal text-white px-4 py-2 rounded-lg text-sm hover:bg-teal-600 transition-colors font-medium">Join</Link>
              </>
            )}
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-white">
            {mobileOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-gig-dark border-t border-white/10 px-4 py-4">
          <form onSubmit={handleSearch} className="mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/10 text-white placeholder-gray-400 rounded-lg pl-4 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gig-teal"
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
                <FaSearch size={14} />
              </button>
            </div>
          </form>
          <div className="space-y-1 mb-4 pb-4 border-b border-white/10">
            <Link to="/services" onClick={() => setMobileOpen(false)} className="block px-2 py-2 text-gray-300 hover:text-white rounded-lg text-sm">Services</Link>
            {isAuthenticated && (
              <>
                {user?.role === 'ServiceProvider' && (
                  <>
                    <Link to="/provider/dashboard" onClick={() => setMobileOpen(false)} className="block px-2 py-2 text-gray-300 hover:text-white rounded-lg text-sm">Dashboard</Link>
                    <Link to="/orders/my" onClick={() => setMobileOpen(false)} className="block px-2 py-2 text-gray-300 hover:text-white rounded-lg text-sm">Orders</Link>
                    <Link to="/provider/profile" onClick={() => setMobileOpen(false)} className="block px-2 py-2 text-gray-300 hover:text-white rounded-lg text-sm">Profile</Link>
                    {isSellerMode && <Link to="/gigs/my" onClick={() => setMobileOpen(false)} className="block px-2 py-2 text-gray-300 hover:text-white rounded-lg text-sm">My Gigs</Link>}
                  </>
                )}
                {user?.role === 'Customer' && (
                  <>
                    <Link to="/customer/dashboard" onClick={() => setMobileOpen(false)} className="block px-2 py-2 text-gray-300 hover:text-white rounded-lg text-sm">Dashboard</Link>
                    <Link to="/orders/my" onClick={() => setMobileOpen(false)} className="block px-2 py-2 text-gray-300 hover:text-white rounded-lg text-sm">Orders</Link>
                    <Link to="/requests/my" onClick={() => setMobileOpen(false)} className="block px-2 py-2 text-gray-300 hover:text-white rounded-lg text-sm">My Requests</Link>
                  </>
                )}
              </>
            )}
          </div>
          {isAuthenticated ? (
            <div className="space-y-2">
              <div className="flex justify-center px-2 py-3 border-b border-white/10">
                <ModeSwitcher />
              </div>
              <div className="flex items-center space-x-2 px-2 py-2">
                <div className="w-8 h-8 bg-gig-teal rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {user?.fullName?.charAt(0)?.toUpperCase()}
                </div>
                <span className="text-white font-medium">{user?.fullName}</span>
              </div>
              <button onClick={handleLogout} className="block w-full text-left px-2 py-2 text-red-400 hover:text-red-300">Logout</button>
            </div>
          ) : (
            <div className="space-y-2">
              <Link to="/login" onClick={() => setMobileOpen(false)} className="block text-center border border-white/30 text-white px-4 py-2 rounded-lg hover:bg-white/10">Login</Link>
              <Link to="/register" onClick={() => setMobileOpen(false)} className="block text-center bg-gig-teal text-white px-4 py-2 rounded-lg hover:bg-teal-600 font-medium">Join</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
