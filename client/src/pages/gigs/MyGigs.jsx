import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaEdit, FaEye, FaTrash, FaPause, FaPlay, FaExclamationTriangle } from 'react-icons/fa';
import api from '../../api/axios';
import StatCard from '../../components/dashboard/StatCard';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';
import { formatPrice } from '../../utils/formatPrice';

const MyGigs = () => {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('All');
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchGigs();
  }, []);

  const fetchGigs = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/gigs/my');
      setGigs(Array.isArray(data) ? data : []);
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to load gigs';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this gig? This action cannot be undone.')) return;
    setActionLoading(id);
    try {
      await api.delete(`/gigs/${id}`);
      setGigs((prev) => prev.filter((g) => g._id !== id));
      toast.success('Gig deleted successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete gig');
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggle = async (id) => {
    setActionLoading(id);
    try {
      const { data } = await api.put(`/gigs/${id}/toggle`);
      setGigs((prev) => prev.map((g) => (g._id === id ? data : g)));
      toast.success(data?.status === 'Published' ? 'Gig published' : 'Gig paused');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    } finally {
      setActionLoading(null);
    }
  };

  const filteredGigs = filter === 'All' ? gigs : gigs.filter((g) => g.status === filter);
  const publishedCount = gigs.filter((g) => g.status === 'Published').length;
  const draftCount = gigs.filter((g) => g.status === 'Draft').length;
  const pausedCount = gigs.filter((g) => g.status === 'Paused').length;

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader /></div>;

  if (error && gigs.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <FaExclamationTriangle className="text-red-400 mb-4" size={48} />
        <p className="text-gray-600 text-lg mb-4">{error}</p>
        <button onClick={fetchGigs} className="bg-gig-teal text-white px-6 py-2 rounded-lg hover:bg-teal-600 font-medium">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-800">My Gigs</h1>
        <Link to="/gigs/create/step1" className="flex items-center space-x-2 bg-gig-teal text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors font-medium">
          <FaPlus size={14} />
          <span>Create New Gig</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Gigs" value={gigs.length} color="gig-teal" />
        <StatCard label="Published" value={publishedCount} color="gig-green" />
        <StatCard label="Drafts" value={draftCount} color="gig-yellow" />
        <StatCard label="Paused" value={pausedCount} color="gig-red" />
      </div>

      <div className="flex items-center space-x-2 mb-6 overflow-x-auto pb-2">
        {['All', 'Published', 'Draft', 'Paused'].map((f) => (
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

      {filteredGigs.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-md">
          <p className="text-gray-500 text-lg mb-4">No {filter === 'All' ? '' : filter.toLowerCase()} gigs found</p>
          <Link to="/gigs/create/step1" className="inline-flex items-center space-x-2 bg-gig-teal text-white px-6 py-3 rounded-lg hover:bg-teal-600 font-medium">
            <FaPlus size={14} />
            <span>Create Your First Gig</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredGigs.map((gig) => (
            <div key={gig._id} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="flex">
                <div className="w-40 h-36 bg-gray-100 flex-shrink-0">
                  {gig.thumbnailUrl ? (
                    <img src={gig.thumbnailUrl} alt={gig.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-teal-50 to-blue-50">
                      <span className="text-2xl text-gig-teal font-bold">G</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      {gig.categoryId && (
                        <span className="text-xs bg-gig-light text-gig-teal px-2 py-0.5 rounded-full">{gig.categoryId.name}</span>
                      )}
                      <h3 className="font-semibold text-gray-800 text-sm mt-1 line-clamp-2">{gig.title || 'Untitled'}</h3>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      gig.status === 'Published' ? 'bg-green-100 text-green-700' :
                      gig.status === 'Paused' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {gig.status || 'Draft'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                    <span>{gig.price != null ? formatPrice(gig.price) : '$0'}</span>
                    <span>{gig.deliveryDays || 0}d delivery</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Link to={`/gigs/edit/${gig._id}`} className="px-3 py-1.5 bg-yellow-50 text-yellow-700 rounded-lg text-xs font-medium hover:bg-yellow-100 flex items-center space-x-1">
                      <FaEdit size={10} />
                      <span>Edit</span>
                    </Link>
                    <Link to={`/services/${gig._id}`} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-100 flex items-center space-x-1">
                      <FaEye size={10} />
                      <span>View</span>
                    </Link>
                    <button
                      onClick={() => handleToggle(gig._id)}
                      disabled={actionLoading === gig._id}
                      className="px-3 py-1.5 bg-gig-light text-gig-dark rounded-lg text-xs font-medium hover:bg-gray-200 flex items-center space-x-1 disabled:opacity-50"
                    >
                      {gig.status === 'Published' ? <FaPause size={10} /> : <FaPlay size={10} />}
                      <span>{gig.status === 'Published' ? 'Pause' : 'Activate'}</span>
                    </button>
                    <button
                      onClick={() => handleDelete(gig._id)}
                      disabled={actionLoading === gig._id}
                      className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100 flex items-center space-x-1 disabled:opacity-50"
                    >
                      <FaTrash size={10} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyGigs;
