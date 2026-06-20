import { Link } from 'react-router-dom';
import { FaLinkedin, FaGithub } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gig-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-9 h-9 bg-gig-teal rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">G</span>
              </div>
              <span className="font-bold text-xl">GIGVERA</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Where Skills Meet Opportunity. Connect with top freelancers and find the perfect service for your project.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Explore</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/services" className="hover:text-gig-teal transition-colors">Browse Services</Link></li>
              <li><Link to="/services?categoryId=1" className="hover:text-gig-teal transition-colors">Web Development</Link></li>
              <li><Link to="/services?categoryId=3" className="hover:text-gig-teal transition-colors">Design & Creative</Link></li>
              <li><Link to="/services?categoryId=5" className="hover:text-gig-teal transition-colors">Marketing & SEO</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">For Sellers</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/register" className="hover:text-gig-teal transition-colors">Start Selling</Link></li>
              <li><Link to="/gigs/my" className="hover:text-gig-teal transition-colors">Manage Gigs</Link></li>
              <li><Link to="/provider/dashboard" className="hover:text-gig-teal transition-colors">Dashboard</Link></li>
              <li><Link to="/provider/profile/edit" className="hover:text-gig-teal transition-colors">Edit Profile</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Connect</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <a
                  href="https://www.linkedin.com/in/muhammad-okasha-0386103aa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 hover:text-gig-teal transition-colors"
                >
                  <FaLinkedin size={18} />
                  <span>LinkedIn</span>
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/MuhammadOkasha004"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 hover:text-gig-teal transition-colors"
                >
                  <FaGithub size={18} />
                  <span>GitHub</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between">
          <p className="text-gray-400 text-sm text-center sm:text-left">&copy; {new Date().getFullYear()} GIGVERA. All rights reserved.</p>
          <p className="text-gray-400 text-sm text-center sm:text-right mt-2 sm:mt-0">Built By Muhammad Okasha</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
