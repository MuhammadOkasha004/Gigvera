import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { AuthContext } from '../../context/AuthContext';
import Loader from '../../components/common/Loader';

const CustomerProfile = () => {
  const { user } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get('/requests/my');
        setRequests(data);
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
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-20 h-20 bg-gig-teal rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {user?.fullName?.charAt(0)?.toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{user?.fullName}</h1>
              <p className="text-gray-500">{user?.email}</p>
              <p className="text-sm text-gig-teal capitalize">{user?.role === 'Customer' ? 'Buyer' : 'Seller'}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="bg-gig-light rounded-lg p-4">
              <p className="text-2xl font-bold text-gig-dark">{requests.length}</p>
              <p className="text-sm text-gray-500">Total Requests</p>
            </div>
            <div className="bg-gig-light rounded-lg p-4">
              <p className="text-2xl font-bold text-gig-green">{requests.filter(r => r.status === 'Delivered').length}</p>
              <p className="text-sm text-gray-500">Completed</p>
            </div>
            <div className="bg-gig-light rounded-lg p-4">
              <p className="text-2xl font-bold text-gig-yellow">{requests.filter(r => ['Pending', 'Accepted', 'InProgress'].includes(r.status)).length}</p>
              <p className="text-sm text-gray-500">Active</p>
            </div>
            <div className="bg-gig-light rounded-lg p-4">
              <p className="text-2xl font-bold text-gig-dark">${requests.filter(r => ['Completed', 'Delivered'].includes(r.status)).reduce((s, r) => s + r.budget, 0)}</p>
              <p className="text-sm text-gray-500">Total Spent</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;
