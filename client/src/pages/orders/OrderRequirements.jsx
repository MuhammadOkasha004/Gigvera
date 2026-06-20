import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../api/axios';
import useAuth from '../../hooks/useAuth';
import Loader from '../../components/common/Loader';
import { formatPrice } from '../../utils/formatPrice';
import toast from 'react-hot-toast';

const OrderRequirements = () => {
  const { gigId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    projectName: '',
    tagline: '',
    description: '',
  });

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return; }
    if (user?.role !== 'Customer') { toast.error('Only buyers can place orders'); navigate('/'); return; }

    const fetchService = async () => {
      try {
        const { data } = await api.get(`/services/${gigId}`);
        setService(data.service);
      } catch (error) {
        toast.error('Service not found');
        navigate('/services');
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [gigId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.projectName.trim()) { toast.error('Project name is required'); return; }
    if (form.description.length < 20) { toast.error('Description must be at least 20 characters'); return; }

    setSubmitting(true);
    try {
      const pkg = searchParams.get('package') || 'basic';
      await api.post('/orders', {
        gigId,
        package: pkg,
        requirements: {
          projectName: form.projectName.trim(),
          tagline: form.tagline.trim(),
          description: form.description.trim(),
        },
      });
      toast.success('Order placed successfully!');
      navigate('/orders/my');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader /></div>;
  if (!service) return null;

  const pkg = searchParams.get('package') || 'basic';
  let price = service.price;
  let deliveryDays = service.deliveryDays;
  if (pkg === 'standard') {
    price = service.packageStandardPrice || service.price * 2;
    deliveryDays = service.packageStandardDelivery || service.deliveryDays * 2;
  } else if (pkg === 'premium') {
    price = service.packagePremiumPrice || service.price * 3;
    deliveryDays = service.packagePremiumDelivery || service.deliveryDays * 3;
  }

  return (
    <div className="min-h-screen bg-gig-light">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Place Your Order</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project / Logo Name *</label>
                <input
                  type="text"
                  value={form.projectName}
                  onChange={(e) => setForm({ ...form, projectName: e.target.value })}
                  placeholder="e.g. My Brand Logo"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gig-teal focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
                <input
                  type="text"
                  value={form.tagline}
                  onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                  placeholder="A short tagline for your project (optional)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gig-teal focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Detailed Description *</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe your project in detail. What do you need? Any preferences, colors, styles?"
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gig-teal focus:border-transparent outline-none resize-none"
                />
                <p className={`text-xs mt-1 ${form.description.length >= 20 ? 'text-green-500' : 'text-red-500'}`}>
                  {form.description.length < 20 ? `Need ${20 - form.description.length} more characters` : 'Looks good'}
                </p>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gig-teal text-white py-3 rounded-lg font-semibold hover:bg-teal-600 transition-colors disabled:opacity-50"
              >
                {submitting ? 'Placing Order...' : `Place Order - ${formatPrice(price)}`}
              </button>
            </form>
          </div>

          <div className="w-full lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <h3 className="font-semibold text-gray-800 mb-4">Order Summary</h3>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                  {service.thumbnailUrl ? (
                    <img src={service.thumbnailUrl} alt={service.title} className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <span className="text-gig-teal font-bold">G</span>
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-800 text-sm line-clamp-2">{service.title}</p>
                  <p className="text-xs text-gray-500">by {service.providerId?.fullName}</p>
                </div>
              </div>
              <div className="border-t pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Package</span>
                  <span className="font-medium capitalize">{pkg}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Price</span>
                  <span className="font-medium">{formatPrice(price)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Delivery</span>
                  <span className="font-medium">{deliveryDays} days</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderRequirements;
