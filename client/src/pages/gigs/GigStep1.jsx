import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import api from '../../api/axios';
import StepProgress from '../../components/gigs/StepProgress';
import TagInput from '../../components/gigs/TagInput';
import toast from 'react-hot-toast';

const FALLBACK_CATEGORIES = [
  { _id: '60c72b2f9b1d8b2bad000001', name: 'Website Development' },
  { _id: '60c72b2f9b1d8b2bad000002', name: 'Logo Design' },
  { _id: '60c72b2f9b1d8b2bad000003', name: 'Social Media Management' },
  { _id: '60c72b2f9b1d8b2bad000004', name: 'Content Writing' },
];

const GigStep1 = () => {
  const [categories, setCategories] = useState(FALLBACK_CATEGORIES);
  const [catLoading, setCatLoading] = useState(false);
  const [form, setForm] = useState({ title: '', categoryId: '', tags: [] });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/services/categories');
        const cats = Array.isArray(data) ? data : (data?.categories || []);
        if (cats && cats.length > 0) {
          setCategories(cats);
        } else {
          setCategories(FALLBACK_CATEGORIES);
        }
      } catch (error) {
        console.log("Backend API categories not found, using stable local fallbacks.");
        setCategories(FALLBACK_CATEGORIES);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (form.title.trim().length < 10 || form.title.length > 80) {
      toast.error('Title must be between 10 and 80 characters');
      return;
    }
    if (!form.categoryId) {
      toast.error('Please select a valid category');
      return;
    }
    if (!form.tags || form.tags.length < 3) {
      toast.error('At least 3 tags are required');
      return;
    }

    setLoading(true);

    try {
      const { data } = await api.post('/gigs', form);
      toast.success('Step 1 saved successfully!');
      navigate(`/gigs/create/step2/${data._id || data.gig?._id}`);
    } catch (error) {
      console.error("Backend Error:", error.response?.data);
      toast.error(error.response?.data?.message || error.response?.data?.error || 'Failed to create gig structure');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gig-dark py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <Link to="/gigs/my" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
            <FaArrowLeft size={16} />
            <span>Back to My Gigs</span>
          </Link>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gig-teal rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">G</span>
            </div>
            <span className="text-white font-bold">GIGVERA</span>
          </div>
        </div>

        <StepProgress currentStep={1} completedSteps={[]} />

        <div className="bg-white rounded-xl shadow-lg p-8 mt-8">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Gig Overview</h2>
          <p className="text-gray-500 text-sm mb-6">Provide basic information about your gig</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gig Title <span className="text-gray-400 font-normal">({form.title.length}/80)</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="I will build a full-stack MERN application"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gig-teal focus:border-transparent outline-none text-gray-800 font-medium"
                maxLength={80}
              />
              <p className="text-xs text-gray-400 mt-1">Start with "I will" to describe your service</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gig-teal focus:border-transparent outline-none bg-white text-gray-800 font-medium"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags (3-5 required)</label>
              <TagInput tags={form.tags} onChange={(tags) => setForm({ ...form, tags })} min={3} max={5} />
            </div>

            <div className="flex items-center justify-between pt-4">
              <div />
              <button
                type="submit"
                disabled={loading}
                className="bg-gig-teal text-white px-8 py-3 rounded-lg font-semibold hover:bg-teal-600 transition-colors disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Next: Pricing'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GigStep1;