import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/formatDate';

const RequestTable = ({ requests = [], type = 'provider' }) => {
  const statusColors = {
    Pending: 'bg-yellow-100 text-yellow-700',
    Accepted: 'bg-blue-100 text-blue-700',
    InProgress: 'bg-purple-100 text-purple-700',
    Completed: 'bg-green-100 text-green-700',
    Delivered: 'bg-gig-teal/10 text-gig-teal',
    Cancelled: 'bg-red-100 text-red-700',
  };

  if (requests.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">No requests found</div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 font-semibold text-gray-600">Service</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-600 hidden sm:table-cell">
              {type === 'provider' ? 'Customer' : 'Provider'}
            </th>
            <th className="text-left py-3 px-4 font-semibold text-gray-600">Budget</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-600">Status</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-600 hidden md:table-cell">Date</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-600">Action</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req._id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-3 px-4">
                <p className="font-medium text-gray-800 truncate max-w-[200px]">
                  {req.listingId?.title || 'N/A'}
                </p>
              </td>
              <td className="py-3 px-4 hidden sm:table-cell">
                <p className="text-gray-600">
                  {type === 'provider' ? req.customerId?.fullName : req.providerId?.fullName}
                </p>
              </td>
              <td className="py-3 px-4 font-medium text-gray-800">${req.budget}</td>
              <td className="py-3 px-4">
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[req.status] || 'bg-gray-100 text-gray-700'}`}>
                  {req.status}
                </span>
              </td>
              <td className="py-3 px-4 text-gray-500 hidden md:table-cell">{formatDate(req.createdAt)}</td>
              <td className="py-3 px-4">
                <Link to={`/requests/track/${req._id}`} className="text-gig-teal hover:underline font-medium text-sm">
                  Track
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RequestTable;
