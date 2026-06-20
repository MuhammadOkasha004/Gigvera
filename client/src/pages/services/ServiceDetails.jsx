import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaStar, FaCalendarAlt, FaRedo, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import api from '../../api/axios';
import useAuth from '../../hooks/useAuth';
import StarRating from '../../components/common/StarRating';
import Loader from '../../components/common/Loader';
import { formatPrice } from '../../utils/formatPrice';
import toast from 'react-hot-toast';

const ServiceDetails = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activePackage, setActivePackage] = useState('basic');
  const [expandedFaq, setExpandedFaq] = useState(null);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const { data } = await api.get(`/services/${id}`);
        setService(data.service);
        setReviews(data.reviews);
        setAvgRating(data.avgRating);
        setTotalReviews(data.totalReviews);
      } catch (error) {
        toast.error('Service not found');
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [id]);

  const handleOrder = () => {
    if (!isAuthenticated) {
      toast.error('Please login to submit a request');
      navigate('/login');
      return;
    }
    if (user.role !== 'Customer') {
      toast.error('Only buyers can submit requests');
      return;
    }
    navigate(`/orders/requirements/${service._id}?package=${activePackage}`);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader text="Loading service..." /></div>;
  if (!service) return <div className="min-h-screen flex items-center justify-center text-gray-500">Service not found</div>;

  const packages = [
    { key: 'basic', name: service.packageBasicName || 'Basic', price: service.packageBasicPrice || service.price, delivery: service.packageBasicDelivery || service.deliveryDays, desc: service.packageBasicDesc || 'Basic package' },
    { key: 'standard', name: service.packageStandardName || 'Standard', price: service.packageStandardPrice || service.price * 2, delivery: service.packageStandardDelivery || service.deliveryDays * 2, desc: service.packageStandardDesc || 'Standard package' },
    { key: 'premium', name: service.packagePremiumName || 'Premium', price: service.packagePremiumPrice || service.price * 3, delivery: service.packagePremiumDelivery || service.deliveryDays * 3, desc: service.packagePremiumDesc || 'Premium package' },
  ];

  const selectedPkg = packages.find((p) => p.key === activePackage);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center text-sm text-gray-500 mb-6 space-x-2">
          <Link to="/" className="hover:text-gig-teal">Home</Link>
          <span>/</span>
          <Link to="/services" className="hover:text-gig-teal">Services</Link>
          <span>/</span>
          <span className="text-gray-800">{service.title}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            {service.thumbnailUrl && (
              <div className="rounded-xl overflow-hidden mb-6 bg-gray-100">
                <img src={service.thumbnailUrl} alt={service.title} className="w-full max-h-96 object-cover" />
              </div>
            )}

            <h1 className="text-2xl font-bold text-gray-800 mb-3">{service.title}</h1>

            {service.categoryId && (
              <span className="inline-block bg-gig-light text-gig-teal text-xs font-semibold px-3 py-1 rounded-full mb-4">
                {service.categoryId.name}
              </span>
            )}

            {service.tags && service.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {service.tags.map((tag, i) => (
                  <span key={i} className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">{tag}</span>
                ))}
              </div>
            )}

            <div className="flex items-center space-x-3 mb-6 pb-6 border-b">
              <div className="w-10 h-10 bg-gig-teal rounded-full flex items-center justify-center text-white font-semibold">
                {service.providerId?.fullName?.charAt(0)?.toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-gray-800">{service.providerId?.fullName}</p>
                <Link to={`/provider/${service.providerId?._id}`} className="text-gig-teal text-sm hover:underline">View Profile</Link>
              </div>
              <div className="ml-auto">
                <StarRating rating={avgRating} count={totalReviews} />
              </div>
            </div>

            {/* Package Tabs */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8">
              <div className="grid grid-cols-3 border-b">
                {packages.map((pkg) => (
                  <button
                    key={pkg.key}
                    onClick={() => setActivePackage(pkg.key)}
                    className={`py-3 text-sm font-semibold transition-colors ${
                      activePackage === pkg.key
                        ? 'bg-gig-teal text-white'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {pkg.name}
                  </button>
                ))}
              </div>
              <div className="p-6">
                <p className="text-gray-600 text-sm mb-3">{selectedPkg.desc}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Price</p>
                    <p className="text-2xl font-bold text-gray-800">{formatPrice(selectedPkg.price)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Delivery</p>
                    <p className="font-semibold text-gray-800">{selectedPkg.delivery} Days</p>
                  </div>
                </div>
                <button
                  onClick={handleOrder}
                  className="w-full mt-4 bg-gig-teal text-white py-3 rounded-lg font-semibold hover:bg-teal-600 transition-colors"
                >
                  Submit Request
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">About This Service</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">{service.description}</p>
            </div>

            {/* FAQs */}
            {service.faqs && service.faqs.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">FAQs</h2>
                <div className="space-y-3">
                  {service.faqs.map((faq, i) => (
                    <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50"
                      >
                        <span className="font-medium text-gray-800 text-sm">{faq.question}</span>
                        {expandedFaq === i ? <FaChevronUp size={14} className="text-gray-400" /> : <FaChevronDown size={14} className="text-gray-400" />}
                      </button>
                      {expandedFaq === i && (
                        <div className="px-4 pb-4 text-sm text-gray-600 border-t border-gray-100 pt-3">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Gallery */}
            {service.galleryImages && service.galleryImages.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Gallery</h2>
                <div className="grid grid-cols-2 gap-4">
                  {service.galleryImages.map((img, i) => (
                    <div key={i} className="rounded-lg overflow-hidden bg-gray-100">
                      <img src={img} alt={`Gallery ${i + 1}`} className="w-full h-48 object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Reviews ({totalReviews})</h2>
              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review._id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-8 h-8 bg-gig-teal rounded-full flex items-center justify-center text-white text-sm font-semibold">
                          {review.customerId?.fullName?.charAt(0)?.toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 text-sm">{review.customerId?.fullName}</p>
                          <StarRating rating={review.rating} showCount={false} size={12} />
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No reviews yet</p>
              )}
            </div>
          </div>

          {/* Sticky Order Card */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <div className="lg:sticky lg:top-24 bg-white border border-gray-200 rounded-xl p-6 shadow-md">
              <div className="text-center mb-4">
                <p className="text-sm text-gray-500">Starting at</p>
                <p className="text-3xl font-bold text-gray-800">{formatPrice(service.price)}</p>
              </div>
              <div className="space-y-3 mb-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Delivery</span>
                  <span className="font-medium">{service.deliveryDays} days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Revisions</span>
                  <span className="font-medium">{service.revisions}</span>
                </div>
              </div>
              <button
                onClick={handleOrder}
                className="w-full bg-gig-teal text-white py-3 rounded-lg font-semibold hover:bg-teal-600 transition-colors"
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetails;
