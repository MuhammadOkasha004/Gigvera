import { FaUserTie, FaHandshake } from 'react-icons/fa';

const RoleSelector = ({ selectedRole, onSelect }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <button
        type="button"
        onClick={() => onSelect('Customer')}
        className={`relative p-6 rounded-xl border-2 text-left transition-all hover:shadow-md ${
          selectedRole === 'Customer'
            ? 'border-gig-teal bg-teal-50 shadow-md'
            : 'border-gray-200 bg-white hover:border-gray-300'
        }`}
      >
        {selectedRole === 'Customer' && (
          <div className="absolute top-3 right-3 w-6 h-6 bg-gig-teal rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
        <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center mb-4">
          <FaHandshake className="text-gig-teal text-2xl" />
        </div>
        <h3 className="font-bold text-gray-800 text-lg">I want to hire freelancers</h3>
        <p className="text-gray-500 text-sm mt-2">Find and hire talented professionals for your projects</p>
        <span className="inline-block mt-3 px-3 py-1 bg-gig-teal/10 text-gig-teal text-xs font-semibold rounded-full">
          Buyer
        </span>
      </button>

      <button
        type="button"
        onClick={() => onSelect('ServiceProvider')}
        className={`relative p-6 rounded-xl border-2 text-left transition-all hover:shadow-md ${
          selectedRole === 'ServiceProvider'
            ? 'border-gig-teal bg-teal-50 shadow-md'
            : 'border-gray-200 bg-white hover:border-gray-300'
        }`}
      >
        {selectedRole === 'ServiceProvider' && (
          <div className="absolute top-3 right-3 w-6 h-6 bg-gig-teal rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
        <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
          <FaUserTie className="text-purple-600 text-2xl" />
        </div>
        <h3 className="font-bold text-gray-800 text-lg">I want to offer services</h3>
        <p className="text-gray-500 text-sm mt-2">Sell your skills and start earning as a freelancer</p>
        <span className="inline-block mt-3 px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
          Seller
        </span>
      </button>
    </div>
  );
};

export default RoleSelector;
