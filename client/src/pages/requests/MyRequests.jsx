import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../api/axios';
import Loader from '../../components/common/Loader';
import { formatDate } from '../../utils/formatDate';

const MyRequests = () => {
  const { user } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const { data } = await api.get('/requests/my');
      setRequests(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this request?')) return;
    try {
      await api.put(`/requests/${id}/cancel`);
      setRequests(requests.map((r) => (r._id === id ? { ...r, status: 'Cancelled' } : r)));
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to cancel');
    }
  };

  const statusColors = {
    Pending: 'bg-yellow-100 text-yellow-700',
    Accepted: 'bg-blue-100 text-blue-700',
    InProgress: 'bg-purple-100 text-purple-700',
    Completed: 'bg-green-100 text-green-700',
    Delivered: 'bg-gig-teal/10 text-gig-teal',
    Cancelled: 'bg-red-100 text-red-700',
  };

  const filtered = filter === 'All' ? requests : requests.filter((r) => r.status === filter);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader /></div>;

  return (
    <div className="min-h-screen bg-gig-light">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">My Requests</h1>

        <div className="flex items-center space-x-2 mb-6 overflow-x-auto pb-2">
          {['All', 'Pending', 'Accepted', 'InProgress', 'Completed', 'Delivered', 'Cancelled'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                filter === f ? 'bg-gig-teal text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-md">
            <p className="text-gray-500 text-lg">No requests found</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">Service</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600 hidden sm:table-cell">
                      {user?.role === 'Customer' ? 'Provider' : 'Customer'}
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">Budget</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600 hidden md:table-cell">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((req) => (
                    <tr key={req._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <p className="font-medium text-gray-800 truncate max-w-[200px]">{req.listingId?.title || 'N/A'}</p>
                      </td>
                      <td className="py-3 px-4 hidden sm:table-cell">
                        <p className="text-gray-600">{user?.role === 'Customer' ? req.providerId?.fullName : req.customerId?.fullName}</p>
                      </td>
                      <td className="py-3 px-4 font-medium text-gray-800">${req.budget}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[req.status] || 'bg-gray-100 text-gray-700'}`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-500 hidden md:table-cell">{formatDate(req.createdAt)}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <Link to={`/requests/track/${req._id}`} className="text-gig-teal hover:underline font-medium text-sm">
                            Track
                          </Link>
                          {user?.role === 'Customer' && req.status === 'Pending' && (
                            <button onClick={() => handleCancel(req._id)} className="text-red-500 hover:underline text-sm">
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRequests;
