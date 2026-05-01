import { Link } from 'react-router-dom';
import useCartStore from '@/context/cartStore';
import { Trash2, Plus, Minus } from 'lucide-react';

export default function Cart() {
  const { items, removeItem, updateQuantity, clearCart, getTotalPrice } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">Add some products to get started!</p>
          <Link to="/products" className="inline-block bg-primary text-white px-6 py-3 rounded hover:bg-blue-700">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow">
            {items.map((item) => (
              <div key={item._id} className="flex gap-4 p-6 border-b last:border-b-0">
                <img
                  src={item.image || 'https://via.placeholder.com/100'}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">${item.price}</p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      className="p-1 border rounded hover:bg-gray-100"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="p-1 border rounded hover:bg-gray-100"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                  <button
                    onClick={() => removeItem(item._id)}
                    className="text-danger hover:text-red-700 mt-2"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cart Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-lg p-6 sticky top-4">
            <h3 className="text-xl font-bold mb-4">Order Summary</h3>
            <div className="space-y-2 mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${(getTotalPrice() * 0.08).toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${(getTotalPrice() * 1.08).toFixed(2)}</span>
              </div>
            </div>
            <Link
              to="/checkout"
              className="block w-full bg-primary text-white text-center py-3 rounded-lg font-semibold hover:bg-blue-700 mb-2"
            >
              Proceed to Checkout
            </Link>
            <button
              onClick={clearCart}
              className="w-full border border-gray-300 py-2 rounded-lg hover:bg-gray-100"
            >
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
