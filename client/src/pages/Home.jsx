import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaCode, FaMobileAlt, FaPalette, FaPen, FaBullhorn, FaChartBar, FaArrowRight, FaStar, FaUsers, FaBriefcase } from 'react-icons/fa';
import api from '../api/axios';
import GigCard from '../components/gigs/GigCard';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [featuredGigs, setFeaturedGigs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, gigRes] = await Promise.all([
          api.get('/services/categories'),
          api.get('/services'),
        ]);
        setCategories(catRes.data);
        setFeaturedGigs(gigRes.data.slice(0, 8));
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/services?keyword=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const iconMap = { FaCode, FaMobileAlt, FaPalette, FaPen, FaBullhorn, FaChartBar };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gig-dark via-gray-900 to-gig-dark text-white py-20 sm:py-28">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-14 h-14 bg-gig-teal rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-3xl">G</span>
            </div>
            <span className="font-bold text-4xl tracking-tight">GIGVERA</span>
          </div>
          <p className="text-gig-teal text-xl font-medium mb-3">Where Skills Meet Opportunity</p>
          <h1 className="text-3xl sm:text-5xl font-bold mb-8 leading-tight">
            Find the perfect freelance<br />services for your business
          </h1>

          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
            <div className="flex bg-white rounded-xl overflow-hidden shadow-xl">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for any service..."
                className="flex-1 px-6 py-4 text-gray-800 outline-none text-lg"
              />
              <button type="submit" className="bg-gig-teal px-8 py-4 text-white font-semibold hover:bg-teal-600 transition-colors flex items-center space-x-2">
                <FaSearch />
                <span>Search</span>
              </button>
            </div>
          </form>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {categories.slice(0, 6).map((cat) => {
              const Icon = iconMap[cat.iconClass] || FaCode;
              return (
                <Link
                  key={cat._id}
                  to={`/services?categoryId=${cat._id}`}
                  className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-gig-teal/20 transition-colors"
                >
                  <Icon size={14} className="text-gig-teal" />
                  <span className="text-sm text-white/90">{cat.name}</span>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center justify-center space-x-8 sm:space-x-12 mt-12">
            {[
              { icon: FaUsers, value: '2,000+', label: 'Freelancers' },
              { icon: FaBriefcase, value: '10,000+', label: 'Projects Done' },
              { icon: FaStar, value: '4.8', label: 'Avg Rating' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <stat.icon className="mx-auto text-gig-teal mb-2" size={20} />
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-gray-400 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-gig-light">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-10">Browse by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => {
              const Icon = iconMap[cat.iconClass] || FaCode;
              return (
                <Link
                  key={cat._id}
                  to={`/services?categoryId=${cat._id}`}
                  className="bg-white p-5 rounded-xl text-center hover:shadow-lg transition-all border border-gray-100 hover:border-gig-teal group"
                >
                  <Icon className="mx-auto text-gig-teal mb-3 group-hover:scale-110 transition-transform" size={28} />
                  <p className="font-semibold text-gray-800 text-sm">{cat.name}</p>
                  <p className="text-gray-500 text-xs mt-1">{cat.serviceCount} services</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Gigs */}
      {featuredGigs.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Featured Gigs</h2>
              <Link to="/services" className="flex items-center space-x-1 text-gig-teal font-medium hover:underline">
                <span>View All</span>
                <FaArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredGigs.slice(0, 8).map((gig) => (
                <GigCard key={gig._id} gig={gig} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* How It Works */}
      <section className="py-16 bg-gig-dark">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { step: 1, title: 'Browse Services', desc: 'Explore thousands of services from talented freelancers worldwide' },
              { step: 2, title: 'Submit a Request', desc: 'Describe your project requirements and submit a request to the provider' },
              { step: 3, title: 'Get Delivered', desc: 'Receive your completed project on time with quality guaranteed' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 bg-gig-teal rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-2xl">{item.step}</span>
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gig-light">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">Ready to Get Started?</h2>
          <p className="text-gray-500 mb-8 max-w-xl mx-auto">
            Join GIGVERA today and connect with thousands of professionals. Whether you want to hire or sell, we've got you covered.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="bg-gig-teal text-white px-8 py-3 rounded-lg font-semibold hover:bg-teal-600 transition-colors w-full sm:w-auto">
              Join as a Seller
            </Link>
            <Link to="/services" className="border-2 border-gig-teal text-gig-teal px-8 py-3 rounded-lg font-semibold hover:bg-teal-50 transition-colors w-full sm:w-auto">
              Start Hiring
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
