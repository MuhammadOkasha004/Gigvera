import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import api from '../../api/axios';
import StepProgress from '../../components/gigs/StepProgress';
import ImageUpload from '../../components/gigs/ImageUpload';
import GalleryUpload from '../../components/gigs/GalleryUpload';
import toast from 'react-hot-toast';

const GigStep5 = () => {
  const { gigId } = useParams();
  const [gallery, setGallery] = useState([]);
  const [currentThumbnail, setCurrentThumbnail] = useState('');
  const [currentGallery, setCurrentGallery] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGig = async () => {
      try {
        const { data } = await api.get(`/gigs/${gigId}`);
        setCurrentThumbnail(data.thumbnailUrl || '');
        setCurrentGallery(data.galleryImages || []);
      } catch (error) {
        toast.error('Failed to load gig data');
      }
    };
    if (gigId) fetchGig();
  }, [gigId]);

  const handleThumbnailUpload = useCallback(async (file) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const { data } = await api.put(`/gigs/${gigId}/step5`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setCurrentThumbnail(data.thumbnailUrl);
      toast.success('Thumbnail uploaded');
    } catch (error) {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  }, [gigId]);

  const handleGalleryChange = useCallback((files) => {
    setGallery(files);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (gallery.length > 0) {
        const formData = new FormData();
        gallery.forEach((file) => {
          if (file instanceof File) {
            formData.append('images', file);
          }
        });
        await api.put(`/gigs/${gigId}/step5`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      toast.success('Gallery saved');
      navigate(`/gigs/my`); // Redirecting cleanly back to dashboard page list
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
        <StepProgress currentStep={5} completedSteps={[1, 2, 3, 4]} />

        <div className="bg-white rounded-xl shadow-lg p-8 mt-8">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Thumbnail & Gallery</h2>
          <p className="text-gray-500 text-sm mb-6">Upload images to showcase your gig</p>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Main Thumbnail (required to publish)</label>
              <ImageUpload onUpload={handleThumbnailUpload} currentImage={currentThumbnail} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Gallery Images (up to 4)</label>
              <GalleryUpload
                images={[...currentGallery, ...gallery.filter(g => !(g instanceof File) || !currentGallery.includes(g))]}
                onChange={handleGalleryChange}
                maxImages={4}
              />
            </div>

            <div className="flex items-center justify-between pt-4">
              <Link to={`/gigs/create/step4/${gigId}`} className="text-gray-500 hover:text-gray-700 font-medium">
                Back
              </Link>
              <button
                type="submit"
                disabled={loading || uploading}
                className="bg-gig-teal text-white px-8 py-3 rounded-lg font-semibold hover:bg-teal-600 transition-colors disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Finish & View'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GigStep5;