import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../api/axios';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

const OrderTimer = ({ createdAt, deliveryDays }) => {
  const [display, setDisplay] = useState('');

  useEffect(() => {
    const deadline = new Date(createdAt);
    deadline.setDate(deadline.getDate() + deliveryDays);

    const update = () => {
      const diff = deadline - Date.now();
      if (diff <= 0) { setDisplay('Overdue'); return; }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      setDisplay(`${d}d ${h}h ${m}m remaining`);
    };

    update();
    const id = setInterval(update, 60000);
    return () => clearInterval(id);
  }, [createdAt, deliveryDays]);

  return (
    <span className={`font-medium ${display === 'Overdue' ? 'text-red-500' : 'text-gig-teal'}`}>
      {display}
    </span>
  );
};

const OrderDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/orders/${id}`);
        setOrder(data);
      } catch (error) {
        toast.error('Order not found');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader /></div>;
  if (!order) return <div className="min-h-screen flex items-center justify-center text-gray-500">Order not found</div>;

  const isBuyer = user?.role === 'Customer';
  const counterparty = isBuyer ? order.sellerId : order.buyerId;

  return (
    <div className="min-h-screen bg-gig-light">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center text-sm text-gray-500 mb-6 space-x-2">
          <Link to="/" className="hover:text-gig-teal">Home</Link>
          <span>/</span>
          <Link to="/orders/my" className="hover:text-gig-teal">Orders</Link>
          <span>/</span>
          <span className="text-gray-800">Order Details</span>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold text-gray-800">Order Details</h1>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              order.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
              order.status === 'Delivered' ? 'bg-purple-100 text-purple-700' :
              order.status === 'Completed' ? 'bg-green-100 text-green-700' :
              'bg-red-100 text-red-700'
            }`}>
              {order.status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Service</p>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                  {order.gigId?.thumbnailUrl ? (
                    <img src={order.gigId.thumbnailUrl} alt={order.gigId.title} className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <span className="text-gig-teal font-bold">G</span>
                  )}
                </div>
                <p className="font-medium text-gray-800">{order.gigId?.title}</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{isBuyer ? 'Seller' : 'Buyer'}</p>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gig-teal rounded-full flex items-center justify-center text-white text-xs font-semibold">
                  {counterparty?.fullName?.charAt(0)?.toUpperCase()}
                </div>
                <span className="font-medium text-gray-800">{counterparty?.fullName}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-xs text-gray-500 uppercase">Price</p>
              <p className="font-bold text-gray-800 text-lg">${order.price}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">Delivery</p>
              <p className="font-medium text-gray-800">{order.deliveryDays} days</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">Time Remaining</p>
              <OrderTimer createdAt={order.createdAt} deliveryDays={order.deliveryDays} />
            </div>
          </div>

          <div className="border-t pt-6">
            <h2 className="font-semibold text-gray-800 mb-3">Requirements</h2>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500 uppercase">Project Name</p>
                <p className="text-gray-800 font-medium">{order.requirements?.projectName}</p>
              </div>
              {order.requirements?.tagline && (
                <div>
                  <p className="text-xs text-gray-500 uppercase">Tagline</p>
                  <p className="text-gray-800">{order.requirements.tagline}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-gray-500 uppercase">Description</p>
                <p className="text-gray-600 whitespace-pre-line">{order.requirements?.description}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Link to="/orders/my" className="text-gig-teal hover:underline font-medium text-sm">&larr; Back to Orders</Link>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
