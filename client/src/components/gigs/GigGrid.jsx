import GigCard from './GigCard';
import { FaInbox } from 'react-icons/fa';

const GigGrid = ({ gigs = [], emptyMessage = 'No gigs found' }) => {
  if (gigs.length === 0) {
    return (
      <div className="text-center py-16">
        <FaInbox className="mx-auto text-gray-300 mb-4" size={48} />
        <p className="text-gray-500 text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {gigs.map((gig) => (
        <GigCard key={gig._id} gig={gig} />
      ))}
    </div>
  );
};

export default GigGrid;
