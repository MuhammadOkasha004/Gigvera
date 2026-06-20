import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaTags, FaArrowRight } from 'react-icons/fa';
import api from '../../api/axios';
import Loader from '../../components/common/Loader';

const MyServices = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/services/categories');
        setCategories(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Services</h1>
          <p className="text-gray-500 text-sm mt-1">Browse all available service categories</p>
        </div>
        <Link
          to="/gigs/create/step1"
          className="flex items-center space-x-2 bg-gig-teal text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors font-medium"
        >
          <FaPlus size={14} />
          <span>Create New Gig</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {categories.map((cat) => (
          <Link
            key={cat._id}
            to={`/services?categoryId=${cat._id}`}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow group"
          >
            <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-teal-100 transition-colors">
              <FaTags className="text-gig-teal" size={20} />
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">{cat.name}</h3>
            <p className="text-sm text-gray-500 mb-3">{cat.description || 'Find expert freelancers for your needs'}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gig-teal font-medium">
                {cat.serviceCount || 0} services
              </span>
              <FaArrowRight className="text-gray-300 group-hover:text-gig-teal transition-colors" size={12} />
            </div>
          </Link>
        ))}
      </div>

      <div className="bg-gradient-to-r from-gig-dark to-gray-800 rounded-xl p-8 text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-xl font-bold mb-1">Want to offer your services?</h2>
            <p className="text-gray-300 text-sm">Create a new gig and start earning today</p>
          </div>
          <Link
            to="/gigs/create/step1"
            className="inline-flex items-center space-x-2 bg-gig-teal text-white px-6 py-3 rounded-lg hover:bg-teal-600 font-medium transition-colors"
          >
            <FaPlus size={14} />
            <span>Create Gig</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MyServices;
