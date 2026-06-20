import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
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
    <span className={`text-sm font-medium ${display === 'Overdue' ? 'text-red-500' : 'text-gig-teal'}`}>
      {display}
    </span>
  );
};

const statusColors = {
  'In Progress': 'bg-blue-100 text-blue-700',
  'Delivered': 'bg-purple-100 text-purple-700',
  'Completed': 'bg-green-100 text-green-700',
  'Cancelled': 'bg-red-100 text-red-700',
};

const ManageOrders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/orders/my');
      setOrders(data);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleDeliver = async (id) => {
    try {
      await api.put(`/orders/${id}/status`, { status: 'Delivered' });
      setOrders(orders.map((o) => (o._id === id ? { ...o, status: 'Delivered' } : o)));
      toast.success('Order marked as delivered');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update');
    }
  };

  const isBuyer = user?.role === 'Customer';
  const heading = isBuyer ? "Orders I've Placed" : 'Incoming Orders';
  const filteredOrders = filter === 'All' ? orders : orders.filter((o) => o.status === filter);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader /></div>;

  return (
    <div className="min-h-screen bg-gig-light">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">{heading}</h1>

        <div className="flex items-center space-x-2 mb-6 overflow-x-auto pb-2">
          {['All', 'In Progress', 'Delivered', 'Completed', 'Cancelled'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                filter === f ? 'bg-gig-teal text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {filteredOrders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-md">
            <p className="text-gray-500 text-lg">No orders found</p>
            {isBuyer && (
              <Link to="/services" className="inline-block mt-4 bg-gig-teal text-white px-6 py-2 rounded-lg hover:bg-teal-600 font-medium">
                Browse Services
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const counterparty = isBuyer ? order.sellerId : order.buyerId;
              return (
                <div key={order._id} className="bg-white rounded-xl shadow-md p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gig-teal rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                        {counterparty?.fullName?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{counterparty?.fullName || 'Unknown'}</p>
                        <p className="text-xs text-gray-500">{isBuyer ? 'Seller' : 'Buyer'}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.status] || 'bg-gray-100 text-gray-700'}`}>
                      {order.status}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                      {order.gigId?.thumbnailUrl ? (
                        <img src={order.gigId.thumbnailUrl} alt={order.gigId.title} className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <span className="text-gig-teal font-bold text-lg">G</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 text-sm truncate">{order.gigId?.title || 'Gig'}</p>
                      <p className="text-xs text-gray-500">{order.requirements?.projectName}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm pt-3 border-t border-gray-100">
                    <div className="flex items-center space-x-4">
                      <span className="font-semibold text-gray-800">${order.price}</span>
                      <OrderTimer createdAt={order.createdAt} deliveryDays={order.deliveryDays} />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Link to={`/orders/${order._id}`} className="text-gig-teal hover:underline font-medium text-sm">
                        View Details
                      </Link>
                      {!isBuyer && order.status === 'In Progress' && (
                        <button
                          onClick={() => handleDeliver(order._id)}
                          className="px-3 py-1.5 bg-gig-teal text-white rounded-lg text-xs font-medium hover:bg-teal-600"
                        >
                          Deliver
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageOrders;
