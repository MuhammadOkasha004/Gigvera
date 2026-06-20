import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom'; // Yeh line theek kardi
import { FaArrowLeft } from 'react-icons/fa';
import api from '../../api/axios';
import StepProgress from '../../components/gigs/StepProgress';
import toast from 'react-hot-toast';

const GigStep4 = () => {
  const { gigId } = useParams();
  const [form, setForm] = useState({ requirements: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGig = async () => {
      try {
        const { data } = await api.get(`/gigs/${gigId}`);
        setForm({ requirements: data.requirements || '' });
      } catch (error) {
        toast.error('Failed to load gig data');
      }
    };
    if (gigId) fetchGig();
  }, [gigId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.requirements.trim()) {
      toast.error('Please specify the requirements for the buyer');
      return;
    }
    setLoading(true);
    try {
      await api.put(`/gigs/${gigId}/step4`, form);
      toast.success('Requirements saved');
      navigate(`/gigs/create/step5/${gigId}`);
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
        <StepProgress currentStep={4} completedSteps={[1, 2, 3]} />

        <div className="bg-white rounded-xl shadow-lg p-8 mt-8">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Requirements</h2>
          <p className="text-gray-500 text-sm mb-6">What information do you need from the buyer to get started?</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project Requirements</label>
              <textarea
                value={form.requirements}
                onChange={(e) => setForm({ ...form, requirements: e.target.value })}
                placeholder="What do you need from the buyer to start working?"
                rows={10}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gig-teal focus:border-transparent outline-none resize-none text-gray-800"
              />
            </div>

            <div className="flex items-center justify-between pt-4">
              <Link to={`/gigs/create/step3/${gigId}`} className="text-gray-500 hover:text-gray-700 font-medium">
                Back
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="bg-gig-teal text-white px-8 py-3 rounded-lg font-semibold hover:bg-teal-600 transition-colors disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Next: Gallery'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GigStep4;