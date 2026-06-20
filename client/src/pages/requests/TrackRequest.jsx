import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { FaCheckCircle, FaCircle, FaSpinner } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';
import api from '../../api/axios';
import Loader from '../../components/common/Loader';
import { formatDate, formatDateTime } from '../../utils/formatDate';
import toast from 'react-hot-toast';

const TrackRequest = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [request, setRequest] = useState(null);
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchRequest();
  }, [id]);

  const fetchRequest = async () => {
    try {
      const { data } = await api.get(`/requests/${id}`);
      setRequest(data.request);
      setUpdates(data.updates);
    } catch (error) {
      toast.error('Request not found');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    setUpdating(true);
    try {
      await api.put(`/requests/${id}/status`, { status: newStatus, note });
      setNote('');
      fetchRequest();
      toast.success('Status updated');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update');
    } finally {
      setUpdating(false);
    }
  };

  const steps = ['Pending', 'Accepted', 'InProgress', 'Completed', 'Delivered'];
  const currentStepIndex = steps.indexOf(request?.status);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader /></div>;
  if (!request) return <div className="min-h-screen flex items-center justify-center text-gray-500">Request not found</div>;

  return (
    <div className="min-h-screen bg-gig-light">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Track Request</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h2 className="font-semibold text-gray-800 mb-6">Progress</h2>
              <div className="relative">
                {steps.map((step, i) => {
                  const isCompleted = i < currentStepIndex || request.status === 'Delivered';
                  const isCurrent = i === currentStepIndex;
                  const isCancelled = request.status === 'Cancelled';

                  return (
                    <div key={step} className="flex items-start mb-8 last:mb-0">
                      <div className="flex flex-col items-center mr-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isCancelled ? 'bg-red-100 text-red-500' :
                          isCompleted ? 'bg-gig-teal text-white' :
                          isCurrent ? 'bg-gig-teal/20 text-gig-teal ring-4 ring-gig-teal/10' :
                          'bg-gray-100 text-gray-400'
                        }`}>
                          {isCompleted ? (
                            <FaCheckCircle size={18} />
                          ) : isCurrent ? (
                            <FaSpinner size={18} className="animate-spin" />
                          ) : (
                            <FaCircle size={10} />
                          )}
                        </div>
                        {i < steps.length - 1 && (
                          <div className={`w-0.5 h-8 mt-1 ${isCompleted ? 'bg-gig-teal' : 'bg-gray-200'}`}></div>
                        )}
                      </div>
                      <div className="pt-2">
                        <p className={`font-medium ${isCurrent ? 'text-gig-teal' : isCompleted ? 'text-gray-800' : 'text-gray-400'}`}>
                          {step}
                        </p>
                        {isCancelled && step === 'Pending' && (
                          <p className="text-red-500 text-sm">Request was cancelled</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {updates.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="font-semibold text-gray-800 mb-4">Activity Log</h2>
                <div className="space-y-3">
                  {updates.map((update) => (
                    <div key={update._id} className="border-l-2 border-gig-teal pl-4 py-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-800 text-sm">{update.newStatus}</span>
                        <span className="text-gray-400 text-xs">{formatDateTime(update.createdAt)}</span>
                      </div>
                      {update.note && <p className="text-gray-600 text-sm mt-1">{update.note}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="w-full lg:w-80 flex-shrink-0 space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Request Details</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-500">Service</p>
                  <p className="font-medium text-gray-800">{request.listingId?.title}</p>
                </div>
                <div>
                  <p className="text-gray-500">{user?.role === 'Customer' ? 'Provider' : 'Customer'}</p>
                  <p className="font-medium text-gray-800">
                    {user?.role === 'Customer' ? request.providerId?.fullName : request.customerId?.fullName}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Budget</p>
                  <p className="font-medium text-gray-800">${request.budget}</p>
                </div>
                <div>
                  <p className="text-gray-500">Deadline</p>
                  <p className="font-medium text-gray-800">{formatDate(request.deadline)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Status</p>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    request.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                    request.status === 'Accepted' ? 'bg-blue-100 text-blue-700' :
                    request.status === 'InProgress' ? 'bg-purple-100 text-purple-700' :
                    request.status === 'Completed' ? 'bg-green-100 text-green-700' :
                    request.status === 'Delivered' ? 'bg-gig-teal/10 text-gig-teal' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {request.status}
                  </span>
                </div>
              </div>
            </div>

            {user?.role === 'ServiceProvider' && request.status !== 'Delivered' && request.status !== 'Cancelled' && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Update Status</h3>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add a note (optional)"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-3 focus:ring-2 focus:ring-gig-teal outline-none resize-none"
                />
                <div className="space-y-2">
                  {request.status === 'Pending' && (
                    <button
                      onClick={() => handleStatusUpdate('Accepted')}
                      disabled={updating}
                      className="w-full bg-gig-teal text-white py-2 rounded-lg text-sm font-medium hover:bg-teal-600 disabled:opacity-50"
                    >
                      Accept Request
                    </button>
                  )}
                  {request.status === 'Accepted' && (
                    <button
                      onClick={() => handleStatusUpdate('InProgress')}
                      disabled={updating}
                      className="w-full bg-gig-teal text-white py-2 rounded-lg text-sm font-medium hover:bg-teal-600 disabled:opacity-50"
                    >
                      Start Work
                    </button>
                  )}
                  {request.status === 'InProgress' && (
                    <button
                      onClick={() => handleStatusUpdate('Completed')}
                      disabled={updating}
                      className="w-full bg-gig-teal text-white py-2 rounded-lg text-sm font-medium hover:bg-teal-600 disabled:opacity-50"
                    >
                      Mark Completed
                    </button>
                  )}
                  {request.status === 'Completed' && (
                    <button
                      onClick={() => handleStatusUpdate('Delivered')}
                      disabled={updating}
                      className="w-full bg-gig-teal text-white py-2 rounded-lg text-sm font-medium hover:bg-teal-600 disabled:opacity-50"
                    >
                      Deliver
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackRequest;
