import { FaFilter } from 'react-icons/fa';

const FilterSidebar = ({ filters, onChange, categories = [] }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="font-semibold text-gray-800 mb-4">Filters</h3>

      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Category</h4>
        <div className="space-y-2">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="category"
              checked={!filters.categoryId}
              onChange={() => onChange({ ...filters, categoryId: '' })}
              className="w-4 h-4 text-gig-teal"
            />
            <span className="text-sm text-gray-600">All Categories</span>
          </label>
          {categories.map((cat) => (
            <label key={cat._id} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="category"
                checked={filters.categoryId === cat._id}
                onChange={() => onChange({ ...filters, categoryId: cat._id })}
                className="w-4 h-4 text-gig-teal"
              />
              <span className="text-sm text-gray-600">{cat.name}</span>
              <span className="text-xs text-gray-400">({cat.serviceCount || 0})</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Price Range</h4>
        <div className="flex items-center space-x-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => onChange({ ...filters, minPrice: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gig-teal focus:border-transparent outline-none"
          />
          <span className="text-gray-400">-</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => onChange({ ...filters, maxPrice: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gig-teal focus:border-transparent outline-none"
          />
        </div>
      </div>

      <button
        onClick={() => onChange({ keyword: '', categoryId: '', minPrice: '', maxPrice: '', deliveryDays: '' })}
        className="w-full py-2 text-gig-teal border border-gig-teal rounded-lg text-sm font-medium hover:bg-teal-50 transition-colors"
      >
        Clear All Filters
      </button>
    </div>
  );
};

export default FilterSidebar;
