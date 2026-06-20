import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import useAuth from '../../hooks/useAuth';
import Loader from '../../components/common/Loader';
import { formatPrice } from '../../utils/formatPrice';
import toast from 'react-hot-toast';

const SubmitRequest = () => {
  const { listingId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [form, setForm] = useState({ requirements: '', budget: 0, deadline: '' });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const { data } = await api.get(`/services/${listingId}`);
        setService(data.service);
        setForm({ ...form, budget: data.service.price });
      } catch (error) {
        toast.error('Service not found');
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [listingId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.requirements.length < 20) {
      toast.error('Requirements must be at least 20 characters');
      return;
    }
    if (form.budget < 1) {
      toast.error('Budget must be at least $1');
      return;
    }
    if (!form.deadline) {
      toast.error('Please set a deadline');
      return;
    }
    if (new Date(form.deadline) <= new Date()) {
      toast.error('Deadline must be a future date');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/requests', { listingId, ...form });
      toast.success('Request submitted successfully!');
      navigate('/requests/my');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader /></div>;
  if (!service) return <div className="min-h-screen flex items-center justify-center text-gray-500">Service not found</div>;

  return (
    <div className="min-h-screen bg-gig-light">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Submit Service Request</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Requirements</label>
                <textarea
                  value={form.requirements}
                  onChange={(e) => setForm({ ...form, requirements: e.target.value })}
                  placeholder="Describe your project requirements in detail. What do you need? Any specific preferences?"
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gig-teal focus:border-transparent outline-none resize-none"
                />
                <p className={`text-xs mt-1 ${form.requirements.length >= 20 ? 'text-green-500' : 'text-red-500'}`}>
                  {form.requirements.length < 20 ? `Need ${20 - form.requirements.length} more characters` : 'Requirements look good'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Budget ($)</label>
                  <input
                    type="number"
                    value={form.budget}
                    onChange={(e) => setForm({ ...form, budget: Number(e.target.value) })}
                    min={1}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gig-teal focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                  <input
                    type="date"
                    value={form.deadline}
                    onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gig-teal focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gig-teal text-white py-3 rounded-lg font-semibold hover:bg-teal-600 transition-colors disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Request'}
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
                  <span className="text-gray-500">Price</span>
                  <span className="font-medium">{formatPrice(service.price)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Delivery</span>
                  <span className="font-medium">{service.deliveryDays} days</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="font-semibold">Budget</span>
                  <span className="font-bold text-gig-dark">{formatPrice(form.budget)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitRequest;
