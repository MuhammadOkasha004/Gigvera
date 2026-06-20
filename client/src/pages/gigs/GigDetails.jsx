import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import Loader from '../../components/common/Loader';

const GigDetails = () => {
  const { gigId } = useParams();
  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGig = async () => {
      try {
        const { data } = await api.get(`/gigs/${gigId}`);
        setGig(data);
      } catch (error) {
        toast.error('Gig not found');
        navigate('/gigs/my');
      } finally {
        setLoading(false);
      }
    };
    fetchGig();
  }, [gigId, navigate]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader /></div>;
  if (!gig) return null;

  return (
    <div className="min-h-screen bg-gig-light">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Gig</h1>
        <div className="bg-white rounded-xl shadow-md p-6">
          <p className="text-gray-600 mb-4">Use the gig creation flow to edit this gig.</p>
          <Link to={`/gigs/create/step1`} className="text-gig-teal hover:underline font-medium">
            Create New Gig
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GigDetails;
