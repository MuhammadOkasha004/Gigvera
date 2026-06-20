import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaTag } from 'react-icons/fa';
import StarRating from '../common/StarRating';
import { formatPrice } from '../../utils/formatPrice';

const GigCard = ({ gig }) => {
  return (
    <Link to={`/services/${gig._id}`} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden group">
      <div className="relative h-44 overflow-hidden bg-gray-100">
        {gig.thumbnailUrl ? (
          <img src={gig.thumbnailUrl} alt={gig.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-teal-50 to-blue-50">
            <span className="text-4xl text-gig-teal font-bold">G</span>
          </div>
        )}
        {gig.categoryId && (
          <span className="absolute top-3 left-3 bg-white/90 text-gig-dark text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
            {gig.categoryId.name}
          </span>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center space-x-2 mb-3">
          <div className="w-7 h-7 bg-gig-teal rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
            {gig.providerId?.fullName?.charAt(0)?.toUpperCase()}
          </div>
          <span className="text-sm text-gray-700 font-medium truncate">{gig.providerId?.fullName}</span>
        </div>

        <h3 className="font-semibold text-gray-800 text-sm leading-snug mb-2 line-clamp-2 min-h-[2.5rem]">
          {gig.title}
        </h3>

        <div className="mb-3">
          <StarRating rating={gig.avgRating || 0} count={gig.reviewCount || 0} size={12} />
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-1 text-gray-500 text-xs">
            <FaCalendarAlt size={10} />
            <span>{gig.deliveryDays} Day{gig.deliveryDays > 1 ? 's' : ''} delivery</span>
          </div>
          <span className="text-gig-dark font-bold text-lg">{formatPrice(gig.price)}</span>
        </div>
      </div>
    </Link>
  );
};

export default GigCard;
