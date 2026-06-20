import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gig-teal mb-4">404</h1>
        <p className="text-gray-600 text-lg mb-6">Page not found</p>
        <Link to="/" className="bg-gig-teal text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-600 transition-colors">
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
