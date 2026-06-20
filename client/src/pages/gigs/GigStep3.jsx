import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import api from '../../api/axios';
import StepProgress from '../../components/gigs/StepProgress';
import FaqManager from '../../components/gigs/FaqManager';
import toast from 'react-hot-toast';

const GigStep3 = () => {
  const { gigId } = useParams();
  const [form, setForm] = useState({ description: '', whatYouWillProvide: '', faqs: [] });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGig = async () => {
      try {
        const { data } = await api.get(`/gigs/${gigId}`);
        setForm({
          description: data.description || '',
          whatYouWillProvide: data.whatYouWillProvide || '',
          faqs: data.faqs || [],
        });
      } catch (error) {
        toast.error('Failed to load gig data');
      }
    };
    if (gigId) fetchGig();
  }, [gigId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.description.trim().length < 100) {
      toast.error('Description must be at least 100 characters');
      return;
    }
    setLoading(true);
    try {
      await api.put(`/gigs/${gigId}/step3`, form);
      toast.success('Description saved');
      navigate(`/gigs/create/step4/${gigId}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gig-dark">
      <div className="bg-gig-dark border-b border-white/10 px-4 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link to="/gigs/my" className="flex items-center space-x-2 text-gray-400 hover:text-white">
            <FaArrowLeft size={16} />
            <span>Exit</span>
          </Link>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gig-teal rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">G</span>
            </div>
            <span className="text-white font-bold">GIGVERA</span>
          </div>
          <div></div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <StepProgress currentStep={3} completedSteps={[1, 2]} />

        <div className="bg-white rounded-xl shadow-lg p-8 mt-8">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Description & FAQs</h2>
          <p className="text-gray-500 text-sm mb-6">Describe your service in detail</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-gray-400 font-normal">({form.description.length} chars, min 100)</span>
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Describe your service in detail. What does the buyer get? What makes you the best choice?"
                rows={8}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gig-teal focus:border-transparent outline-none resize-none text-gray-800"
              />
              <p className={`text-xs mt-1 ${form.description.length >= 100 ? 'text-green-500' : 'text-red-500'}`}>
                {form.description.length < 100 ? `Need ${100 - form.description.length} more characters` : 'Description meets minimum requirement'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">What You'll Provide (optional)</label>
              <textarea
                value={form.whatYouWillProvide}
                onChange={(e) => setForm({ ...form, whatYouWillProvide: e.target.value })}
                placeholder="List what the buyer will receive with this service"
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gig-teal focus:border-transparent outline-none resize-none text-gray-800"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Frequently Asked Questions</label>
              <FaqManager faqs={form.faqs} onChange={(faqs) => setForm({ ...form, faqs })} />
            </div>

            <div className="flex items-center justify-between pt-4">
              <Link to={`/gigs/create/step2/${gigId}`} className="text-gray-500 hover:text-gray-700 font-medium">
                Back
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="bg-gig-teal text-white px-8 py-3 rounded-lg font-semibold hover:bg-teal-600 transition-colors disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Next: Requirements'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GigStep3;