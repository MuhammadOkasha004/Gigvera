import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaMapMarkerAlt, FaCalendar, FaGlobe, FaStar, FaEdit } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import useAuth from '../../hooks/useAuth';
import StarRating from '../../components/common/StarRating';
import Loader from '../../components/common/Loader';
import { formatDate } from '../../utils/formatDate';

const ProviderProfile = () => {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [portfolio, setPortfolio] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get(`/provider/profile/${userId}`);
        setProfile(data.profile);
        setPortfolio(data.portfolio);

        const reviewRes = await api.get(`/reviews/provider/${userId}`);
        setReviews(reviewRes.data.reviews);
        setAvgRating(reviewRes.data.avgRating);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchProfile();
  }, [userId]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader /></div>;
  if (!profile) return <div className="min-h-screen flex items-center justify-center text-gray-500">Provider not found</div>;

  const isOwnProfile = currentUser?._id === userId;

  return (
    <div className="min-h-screen bg-gig-light">
      <div className="bg-gradient-to-r from-gig-dark to-gray-800 h-48"></div>

      <div className="max-w-5xl mx-auto px-4 -mt-20">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="w-24 h-24 bg-gig-teal rounded-full flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow-md flex-shrink-0">
              {profile.userId?.fullName?.charAt(0)?.toUpperCase()}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-800">{profile.userId?.fullName}</h1>
              {profile.bio && <p className="text-gray-500 text-sm mt-1">{profile.bio.substring(0, 100)}...</p>}
              <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                {profile.city && (
                  <span className="flex items-center space-x-1">
                    <FaMapMarkerAlt size={12} />
                    <span>{profile.city}{profile.country ? `, ${profile.country}` : ''}</span>
                  </span>
                )}
                <span className="flex items-center space-x-1">
                  <FaCalendar size={12} />
                  <span>Member since {formatDate(profile.userId?.createdAt)}</span>
                </span>
                {profile.website && (
                  <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1 text-gig-teal hover:underline">
                    <FaGlobe size={12} />
                    <span>Website</span>
                  </a>
                )}
              </div>
              <div className="flex items-center space-x-4 mt-2">
                <StarRating rating={avgRating} count={reviews.length} />
                {profile.hourlyRate > 0 && (
                  <span className="text-gig-dark font-bold">${profile.hourlyRate}/hr</span>
                )}
              </div>
            </div>
            {isOwnProfile && (
              <Link to="/provider/profile/edit" className="flex items-center space-x-2 bg-gig-teal text-white px-4 py-2 rounded-lg hover:bg-teal-600 font-medium">
                <FaEdit size={14} />
                <span>Edit Profile</span>
              </Link>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {profile.bio && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-3">About</h2>
                <p className="text-gray-600 leading-relaxed">{profile.bio}</p>
              </div>
            )}

            {profile.skills && profile.skills.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-3">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, i) => (
                    <span key={i} className="bg-gig-light text-gig-dark text-sm px-3 py-1 rounded-full">{skill}</span>
                  ))}
                </div>
              </div>
            )}

            {portfolio.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Portfolio</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {portfolio.map((item) => (
                    <div key={item._id} className="bg-gray-50 rounded-lg overflow-hidden">
                      {item.imageUrl && (
                        <img src={item.imageUrl} alt={item.title} className="w-full h-40 object-cover" />
                      )}
                      <div className="p-3">
                        <h4 className="font-medium text-gray-800 text-sm">{item.title}</h4>
                        {item.description && <p className="text-gray-500 text-xs mt-1">{item.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {profile.experience && profile.experience.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-3">Experience</h2>
                <div className="space-y-4">
                  {profile.experience.map((exp, i) => (
                    <div key={i} className="border-l-2 border-gig-teal pl-4">
                      <h4 className="font-semibold text-gray-800 text-sm">{exp.role}</h4>
                      <p className="text-gray-600 text-sm">{exp.company}</p>
                      {exp.description && <p className="text-gray-500 text-xs mt-1">{exp.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-3">Reviews</h2>
              {reviews.length === 0 ? (
                <p className="text-gray-500 text-sm">No reviews yet</p>
              ) : (
                <div className="space-y-3">
                  {reviews.slice(0, 5).map((review) => (
                    <div key={review._id} className="border-b border-gray-100 pb-3 last:border-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <div className="w-6 h-6 bg-gig-teal rounded-full flex items-center justify-center text-white text-xs font-semibold">
                          {review.customerId?.fullName?.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-gray-800">{review.customerId?.fullName}</span>
                      </div>
                      <StarRating rating={review.rating} showCount={false} size={10} />
                      <p className="text-gray-600 text-xs mt-1">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderProfile;
