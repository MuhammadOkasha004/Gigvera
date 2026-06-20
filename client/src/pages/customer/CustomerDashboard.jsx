import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaFileAlt, FaCheckCircle, FaDollarSign } from 'react-icons/fa';
import api from '../../api/axios';
import { AuthContext } from '../../context/AuthContext';
import StatCard from '../../components/dashboard/StatCard';
import RequestTable from '../../components/dashboard/RequestTable';
import Loader from '../../components/common/Loader';

const CustomerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({ active: 0, completed: 0, totalSpent: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get('/requests/my');
        setRequests(data.slice(0, 5));
        setStats({
          active: data.filter((r) => ['Pending', 'Accepted', 'InProgress'].includes(r.status)).length,
          completed: data.filter((r) => r.status === 'Delivered').length,
          totalSpent: data.filter((r) => ['Completed', 'Delivered'].includes(r.status)).reduce((sum, r) => sum + r.budget, 0),
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
              <h1 className="text-2xl font-bold">Welcome, {user?.fullName?.split(' ')[0]}!</h1>
              <p className="text-gray-300 text-sm">Manage your service requests</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <StatCard icon={FaFileAlt} label="Active Requests" value={stats.active} color="gig-teal" />
          <StatCard icon={FaCheckCircle} label="Completed" value={stats.completed} color="gig-green" />
          <StatCard icon={FaDollarSign} label="Total Spent" value={`$${stats.totalSpent.toLocaleString()}`} color="gig-yellow" />
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800">Recent Requests</h2>
            <Link to="/requests/my" className="text-gig-teal text-sm font-medium hover:underline">View All</Link>
          </div>
          <RequestTable requests={requests} type="customer" />
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
