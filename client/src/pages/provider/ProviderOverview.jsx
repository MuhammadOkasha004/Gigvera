import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaGlobe, FaStar, FaEdit, FaEnvelope, FaDollarSign, FaCalendar } from 'react-icons/fa';
import api from '../../api/axios';
import { AuthContext } from '../../context/AuthContext';
import StarRating from '../../components/common/StarRating';
import Loader from '../../components/common/Loader';
import { formatDate } from '../../utils/formatDate';

const ProviderOverview = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [portfolio, setPortfolio] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/provider/profile');
        setProfile(data.profile);
        setPortfolio(data.portfolio || []);

        if (data.profile?.userId?._id) {
          const reviewRes = await api.get(`/reviews/provider/${data.profile.userId._id}`);
          setAvgRating(reviewRes.data.avgRating);
          setReviewCount(reviewRes.data.reviews?.length || 0);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader /></div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-md p-8 mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <div className="w-24 h-24 bg-gig-teal rounded-full flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow-md flex-shrink-0">
            {user?.fullName?.charAt(0)?.toUpperCase()}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-800">{user?.fullName}</h1>
            <p className="text-gray-500">{user?.email}</p>
            {profile?.bio && (
              <p className="text-gray-600 text-sm mt-2 line-clamp-3">{profile.bio}</p>
            )}
            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
              {profile?.city && (
                <span className="flex items-center space-x-1">
                  <FaMapMarkerAlt size={12} />
                  <span>{profile.city}{profile.country ? `, ${profile.country}` : ''}</span>
                </span>
              )}
              <span className="flex items-center space-x-1">
                <FaCalendar size={12} />
                <span>Member since {formatDate(user?.createdAt)}</span>
              </span>
              {profile?.website && (
                <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1 text-gig-teal hover:underline">
                  <FaGlobe size={12} />
                  <span>Website</span>
                </a>
              )}
            </div>
            <div className="flex items-center space-x-4 mt-2">
              <StarRating rating={avgRating} count={reviewCount} />
              {profile?.hourlyRate > 0 && (
                <span className="text-gig-dark font-bold flex items-center">
                  <FaDollarSign size={14} className="mr-0.5" />
                  {profile.hourlyRate}/hr
                </span>
              )}
            </div>
          </div>
          <Link
            to="/provider/profile/edit"
            className="flex items-center space-x-2 bg-gig-teal text-white px-4 py-2 rounded-lg hover:bg-teal-600 font-medium transition-colors"
          >
            <FaEdit size={14} />
            <span>Edit Profile</span>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-5 text-center">
          <p className="text-2xl font-bold text-gig-teal">{avgRating > 0 ? avgRating.toFixed(1) : '-'}</p>
          <p className="text-sm text-gray-500 mt-1">Rating</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 text-center">
          <p className="text-2xl font-bold text-gig-teal">{reviewCount}</p>
          <p className="text-sm text-gray-500 mt-1">Reviews</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 text-center">
          <p className="text-2xl font-bold text-gig-teal">{profile?.skills?.length || 0}</p>
          <p className="text-sm text-gray-500 mt-1">Skills</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 text-center">
          <p className="text-2xl font-bold text-gig-teal">{profile?.hourlyRate ? `$${profile.hourlyRate}` : '-'}</p>
          <p className="text-sm text-gray-500 mt-1">Hourly Rate</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {profile?.bio && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-3">About</h2>
              <p className="text-gray-600 leading-relaxed">{profile.bio}</p>
            </div>
          )}

          {profile?.skills && profile.skills.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-3">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, i) => (
                  <span key={i} className="bg-gig-light text-gig-dark text-sm px-3 py-1.5 rounded-full">{skill}</span>
                ))}
              </div>
            </div>
          )}

          {portfolio.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Portfolio</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {portfolio.map((item) => (
                  <div key={item._id} className="bg-gray-50 rounded-lg overflow-hidden">
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
          {profile?.experience && profile.experience.length > 0 && (
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
        </div>
      </div>
    </div>
  );
};

export default ProviderOverview;
