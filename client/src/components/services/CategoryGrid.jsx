import { Link } from 'react-router-dom';
import { FaCode, FaMobileAlt, FaPalette, FaPen, FaBullhorn, FaChartBar } from 'react-icons/fa';

const CategoryGrid = ({ categories = [], activeCategory, onSelect }) => {
  const iconMap = {
    'FaCode': FaCode,
    'FaMobileAlt': FaMobileAlt,
    'FaPalette': FaPalette,
    'FaPen': FaPen,
    'FaBullhorn': FaBullhorn,
    'FaChartBar': FaChartBar,
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {categories.map((cat) => {
        const Icon = iconMap[cat.iconClass] || FaCode;
        const isActive = activeCategory === cat._id;

        return (
          <button
            key={cat._id}
            onClick={() => onSelect(isActive ? '' : cat._id)}
            className={`p-4 rounded-xl text-center transition-all hover:shadow-md ${
              isActive
                ? 'bg-gig-teal text-white shadow-md'
                : 'bg-white text-gray-700 hover:border-gig-teal border border-gray-200'
            }`}
          >
            <Icon className={`mx-auto mb-2 ${isActive ? 'text-white' : 'text-gig-teal'}`} size={24} />
            <p className={`text-sm font-semibold ${isActive ? 'text-white' : 'text-gray-800'}`}>{cat.name}</p>
            <p className={`text-xs mt-1 ${isActive ? 'text-white/80' : 'text-gray-500'}`}>{cat.serviceCount} services</p>
          </button>
        );
      })}
    </div>
  );
};

export default CategoryGrid;
