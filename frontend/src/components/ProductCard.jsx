import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import useCartStore from '@/context/cartStore';

export default function ProductCard({ product }) {
  const { addItem } = useCartStore();

  const handleAddToCart = () => {
    addItem(product, 1);
    alert('Product added to cart!');
  };

  return (
    <div className="group bg-white/90 border border-slate-200 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      <img 
        src={product.image || 'https://via.placeholder.com/300'} 
        alt={product.name}
        className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div className="p-4">
        <h3 className="text-lg font-bold truncate text-slate-900">{product.name}</h3>
        <p className="text-slate-600 text-sm mb-2 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-extrabold text-teal-700">
              ${product.discountPrice || product.price}
            </span>
            {product.discountPrice && (
              <span className="text-sm text-slate-500 line-through">${product.price}</span>
            )}
          </div>
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${product.stock > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
            {product.stock > 0 ? `${product.stock} left` : 'Out of stock'}
          </span>
        </div>
        <div className="flex gap-2">
          <Link to={`/products/${product._id}`} className="flex-1">
            <button className="w-full bg-gradient-to-r from-teal-700 to-teal-600 text-white py-2 rounded-xl font-semibold hover:from-teal-800 hover:to-teal-700 shadow-md shadow-teal-900/20">
              View Details
            </button>
          </Link>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="bg-gradient-to-r from-orange-600 to-amber-500 text-white p-2 rounded-xl hover:from-orange-700 hover:to-amber-600 disabled:opacity-50 shadow-md shadow-orange-900/20"
          >
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
