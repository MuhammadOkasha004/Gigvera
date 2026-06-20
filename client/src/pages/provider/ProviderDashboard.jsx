import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaDollarSign, FaBriefcase, FaClock, FaStar, FaAward } from 'react-icons/fa';
import api from '../../api/axios';
import { AuthContext } from '../../context/AuthContext';
import StatCard from '../../components/dashboard/StatCard';
import EarningsChart from '../../components/dashboard/EarningsChart';
import RequestTable from '../../components/dashboard/RequestTable';
import Loader from '../../components/common/Loader';
import { formatDate } from '../../utils/formatDate';

const ProviderDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({ earnings: 0, activeProjects: 0, pendingRequests: 0, avgRating: 0 });
  const [requests, setRequests] = useState([]);
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [requestsRes, gigsRes] = await Promise.all([
          api.get('/requests/my'),
          api.get('/gigs/my'),
        ]);

        const allRequests = requestsRes.data;
        const activeProjects = allRequests.filter((r) => ['Accepted', 'InProgress'].includes(r.status)).length;
        const pendingRequests = allRequests.filter((r) => r.status === 'Pending').length;

        setRequests(allRequests.slice(0, 5));
        setGigs(gigsRes.data.slice(0, 3));
        setStats({
          earnings: allRequests.filter((r) => r.status === 'Delivered').reduce((sum, r) => sum + r.budget, 0),
          activeProjects,
          pendingRequests,
          avgRating: 4.8,
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader /></div>;

  return (
    <div className="min-h-screen bg-gig-light">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-gig-dark to-gray-800 rounded-xl p-6 mb-8 text-white">
          <div className="flex items-center space-x-3">
            <div className="w-14 h-14 bg-gig-teal rounded-full flex items-center justify-center text-2xl font-bold">
              {user?.fullName?.charAt(0)?.toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold">Welcome back, {user?.fullName?.split(' ')[0]}!</h1>
              <p className="text-gray-300 text-sm">Here's what's happening with your gigs</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={FaDollarSign} label="Total Earnings" value={`$${stats.earnings.toLocaleString()}`} color="gig-green" />
          <StatCard icon={FaBriefcase} label="Active Projects" value={stats.activeProjects} color="gig-teal" />
          <StatCard icon={FaClock} label="Pending Requests" value={stats.pendingRequests} color="gig-yellow" />
          <StatCard icon={FaStar} label="Avg Rating" value={stats.avgRating} color="gig-yellow" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <EarningsChart />
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="font-semibold text-gray-800 mb-4">My Gigs</h3>
            <div className="space-y-3">
              {gigs.length === 0 ? (
                <p className="text-gray-500 text-sm">No gigs yet</p>
              ) : (
                gigs.map((gig) => (
                  <div key={gig._id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-gig-light rounded-lg flex-shrink-0 flex items-center justify-center">
                      <span className="text-gig-teal font-bold text-sm">G</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 text-sm truncate">{gig.title}</p>
                      <p className="text-xs text-gray-500">{gig.status}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <Link to="/gigs/my" className="block text-center text-gig-teal text-sm font-medium mt-4 hover:underline">
              View All Gigs
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Recent Requests</h3>
          <RequestTable requests={requests} type="provider" />
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;
