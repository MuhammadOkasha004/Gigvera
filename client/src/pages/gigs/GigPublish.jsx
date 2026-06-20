import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import api from '../../api/axios';
import StepProgress from '../../components/gigs/StepProgress';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

const GigPublish = () => {
  const { gigId } = useParams();
  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGig = async () => {
      try {
        const { data } = await api.get(`/gigs/${gigId}`);
        setGig(data);
      } catch (error) {
        toast.error('Failed to load gig');
      } finally {
        setLoading(false);
      }
    };
    if (gigId) fetchGig();
  }, [gigId]);

  const handlePublish = async () => {
    setPublishing(true);
    try {
      await api.put(`/gigs/${gigId}/publish`);
      toast.success('Gig published successfully!');
      navigate('/gigs/my');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to publish');
    } finally {
      setPublishing(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader /></div>;
  if (!gig) return <div className="min-h-screen flex items-center justify-center text-gray-500">Gig not found</div>;

  const checklist = [
    { label: 'Title', done: gig.title && gig.title.length >= 10 },
    { label: 'Category', done: !!gig.categoryId },
    { label: 'Tags', done: gig.tags && gig.tags.length >= 3 },
    { label: 'Pricing', done: gig.price > 0 },
    { label: 'Description (100+ chars)', done: gig.description && gig.description.length >= 100 },
    { label: 'Thumbnail', done: !!gig.thumbnailUrl },
  ];

  const allDone = checklist.every((c) => c.done);

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
        <StepProgress currentStep={5} completedSteps={[1, 2, 3, 4]} />

        <div className="bg-white rounded-xl shadow-lg p-8 mt-8">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Review & Publish</h2>
          <p className="text-gray-500 text-sm mb-6">Review your gig before publishing</p>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <div className="bg-gray-50 rounded-lg p-4">
                {gig.thumbnailUrl && (
                  <img src={gig.thumbnailUrl} alt={gig.title} className="w-full h-48 object-cover rounded-lg mb-4" />
                )}
                <h3 className="font-bold text-gray-800 mb-2">{gig.title}</h3>
                {gig.categoryId && (
                  <span className="text-xs bg-gig-light text-gig-teal px-2 py-0.5 rounded-full">{gig.categoryId.name}</span>
                )}
                <p className="text-gray-600 text-sm mt-3 line-clamp-3">{gig.description}</p>
                <div className="flex items-center space-x-4 mt-4 text-sm">
                  <span className="font-bold text-gig-dark">${gig.price}</span>
                  <span className="text-gray-500">{gig.deliveryDays} days delivery</span>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-64">
              <h4 className="font-semibold text-gray-800 mb-3">Publish Checklist</h4>
              <div className="space-y-2">
                {checklist.map((item, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <FaCheckCircle size={14} className={item.done ? 'text-gig-green' : 'text-gray-300'} />
                    <span className={`text-sm ${item.done ? 'text-gray-800' : 'text-gray-400'}`}>{item.label}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={handlePublish}
                disabled={!allDone || publishing}
                className="w-full mt-6 bg-gig-teal text-white py-3 rounded-lg font-semibold hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {publishing ? 'Publishing...' : 'Publish Now'}
              </button>
              {!allDone && (
                <p className="text-xs text-gray-500 text-center mt-2">Complete all items to publish</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GigPublish;
