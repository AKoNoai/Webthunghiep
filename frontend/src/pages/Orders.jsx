import { useEffect, useState } from 'react';
import { orderService } from '@/services/api';
import { Package, MapPin, DollarSign, Calendar } from 'lucide-react';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response = await orderService.getUserOrders();
        setOrders(response.data);
      } catch (error) {
        console.error('Failed to load orders:', error);
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  const getStatusBadgeColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-12">Loading orders...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <Package size={48} className="mx-auto mb-4 text-gray-400" />
          <h1 className="text-2xl font-bold mb-2">No Orders Yet</h1>
          <p className="text-gray-600">Start shopping to place your first order!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order._id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
            <div className="p-6 border-b">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div>
                  <h3 className="font-bold text-lg">{order.orderNumber}</h3>
                  <p className="text-gray-600 text-sm flex items-center gap-2 mt-1">
                    <Calendar size={16} />
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">
                    ${order.totalAmount.toFixed(2)}
                  </div>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mt-2 ${getStatusBadgeColor(order.orderStatus)}`}>
                    {order.orderStatus}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-sm">
                  <span>{item.product?.name} x {item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="p-6 border-t bg-gray-50 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Payment</p>
                <p className="font-semibold">{order.paymentMethod.toUpperCase()}</p>
              </div>
              <div>
                <p className="text-gray-600">Status</p>
                <p className="font-semibold">{order.paymentStatus}</p>
              </div>
              <div>
                <p className="text-gray-600">Shipping To</p>
                <p className="font-semibold">{order.shippingAddress.city}</p>
              </div>
              <div className="text-right">
                <button className="text-primary hover:underline">View Details</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
