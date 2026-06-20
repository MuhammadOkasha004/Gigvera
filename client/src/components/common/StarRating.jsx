import { FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa';

const StarRating = ({ rating = 0, count = 0, size = 14, showCount = true }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;

  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars.push(<FaStar key={i} size={size} className="text-gig-yellow" />);
    } else if (i === fullStars + 1 && hasHalfStar) {
      stars.push(<FaStarHalfAlt key={i} size={size} className="text-gig-yellow" />);
    } else {
      stars.push(<FaRegStar key={i} size={size} className="text-gig-yellow" />);
    }
  }

  return (
    <div className="flex items-center space-x-1">
      <div className="flex items-center">{stars}</div>
      {showCount && count > 0 && (
        <span className="text-gray-500 text-sm">({count})</span>
      )}
    </div>
  );
};

export default StarRating;
