import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaTag } from 'react-icons/fa';
import StarRating from '../common/StarRating';
import { formatPrice } from '../../utils/formatPrice';

const ServiceCard = ({ service }) => {
  return (
    <Link to={`/services/${service._id}`} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden group">
      <div className="relative h-44 overflow-hidden bg-gray-100">
        {service.thumbnailUrl ? (
          <img src={service.thumbnailUrl} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-teal-50 to-blue-50">
            <span className="text-4xl text-gig-teal font-bold">G</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center space-x-2 mb-3">
          <div className="w-7 h-7 bg-gig-teal rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
            {service.providerId?.fullName?.charAt(0)?.toUpperCase()}
          </div>
          <span className="text-sm text-gray-700 font-medium truncate">{service.providerId?.fullName}</span>
        </div>

        <h3 className="font-semibold text-gray-800 text-sm leading-snug mb-2 line-clamp-2 min-h-[2.5rem]">
          {service.title}
        </h3>

        <div className="mb-3">
          <StarRating rating={service.avgRating || 0} count={service.reviewCount || 0} size={12} />
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-1 text-gray-500 text-xs">
            <FaCalendarAlt size={10} />
            <span>{service.deliveryDays} Day{service.deliveryDays > 1 ? 's' : ''} delivery</span>
          </div>
          <span className="text-gig-dark font-bold text-lg">{formatPrice(service.price)}</span>
        </div>
      </div>
    </Link>
  );
};

export default ServiceCard;
