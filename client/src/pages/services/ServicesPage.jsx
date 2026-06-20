import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaFilter } from 'react-icons/fa';
import api from '../../api/axios';
import GigGrid from '../../components/gigs/GigGrid';
import CategoryGrid from '../../components/services/CategoryGrid';
import Loader from '../../components/common/Loader';
import useDebounce from '../../hooks/useDebounce';

const FilterSidebar = ({ filters, onChange, categories }) => {
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
              <span className="text-xs text-gray-400">({cat.serviceCount})</span>
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

      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Delivery Time</h4>
        <div className="space-y-2">
          {[
            { value: '', label: 'Any' },
            { value: '3', label: 'Up to 3 days' },
            { value: '7', label: 'Up to 7 days' },
            { value: '14', label: 'Up to 14 days' },
          ].map((opt) => (
            <label key={opt.value} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="delivery"
                checked={filters.deliveryDays === opt.value}
                onChange={() => onChange({ ...filters, deliveryDays: opt.value })}
                className="w-4 h-4 text-gig-teal"
              />
              <span className="text-sm text-gray-600">{opt.label}</span>
            </label>
          ))}
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

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    keyword: '',
    categoryId: '',
    minPrice: '',
    maxPrice: '',
    deliveryDays: '',
  });
  const [sort, setSort] = useState('');
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const debouncedKeyword = useDebounce(filters.keyword, 500);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/services/categories');
        setCategories(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (debouncedKeyword) params.append('keyword', debouncedKeyword);
        if (filters.categoryId) params.append('categoryId', filters.categoryId);
        if (filters.minPrice) params.append('minPrice', filters.minPrice);
        if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
        if (filters.deliveryDays) params.append('deliveryDays', filters.deliveryDays);
        if (sort) params.append('sort', sort);

        const { data } = await api.get(`/services?${params.toString()}`);
        setServices(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [debouncedKeyword, filters.categoryId, filters.minPrice, filters.maxPrice, filters.deliveryDays, sort]);

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gig-light py-8">
        <div className="max-w-7xl mx-auto px-4">
          <CategoryGrid categories={categories} activeCategory={filters.categoryId} onSelect={(id) => setFilters({ ...filters, categoryId: id })} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {filters.categoryId
                ? categories.find((c) => c._id === filters.categoryId)?.name || 'Services'
                : 'All Services'
              }
            </h1>
            <p className="text-gray-500 text-sm mt-1">{services.length} services found</p>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gig-teal focus:border-transparent outline-none"
            >
              <option value="">Sort by: Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
            <button
              onClick={() => setShowMobileFilter(!showMobileFilter)}
              className="lg:hidden flex items-center space-x-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <FaFilter size={12} />
              <span>Filters</span>
            </button>
          </div>
        </div>

        <div className="flex gap-8">
          <div className={`${showMobileFilter ? 'block' : 'hidden'} lg:block w-full lg:w-72 flex-shrink-0`}>
            <FilterSidebar filters={filters} onChange={setFilters} categories={categories} />
          </div>

          <div className="flex-1">
            {loading ? (
              <Loader text="Loading services..." />
            ) : (
              <GigGrid gigs={services} emptyMessage="No services match your filters" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
