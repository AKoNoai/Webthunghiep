import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { productService } from '@/services/api';
import useCartStore from '@/context/cartStore';
import { ShoppingCart, Star } from 'lucide-react';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCartStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const response = await productService.getProductById(id);
        setProduct(response.data);
      } catch (error) {
        console.error('Failed to load product:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  const handleAddToCart = () => {
    addItem(product, quantity);
    alert('Product added to cart!');
  };

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-12">Loading...</div>;
  if (!product) return <div className="max-w-7xl mx-auto px-4 py-12">Product not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div>
          <img
            src={product.image || 'https://via.placeholder.com/500'}
            alt={product.name}
            className="w-full rounded-lg"
          />
          {product.images && product.images.length > 0 && (
            <div className="grid grid-cols-4 gap-2 mt-4">
              {product.images.map((img, idx) => (
                <img key={idx} src={img} alt={`${product.name} ${idx}`} className="w-full h-20 object-cover rounded" />
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
          
          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  className={i < Math.round(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                />
              ))}
            </div>
            <span className="text-gray-600">({product.reviewCount} reviews)</span>
          </div>

          <p className="text-gray-600 mb-6">{product.description}</p>

          {/* Price */}
          <div className="mb-6">
            <span className="text-4xl font-bold text-primary">${product.discountPrice || product.price}</span>
            {product.discountPrice && (
              <span className="text-lg text-gray-500 line-through ml-4">${product.price}</span>
            )}
          </div>

          {/* Stock */}
          <div className="mb-6">
            <p className={`text-lg font-semibold ${product.stock > 0 ? 'text-secondary' : 'text-danger'}`}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </p>
          </div>

          {/* Quantity */}
          {product.stock > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Quantity</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-100"
                >
                  -
                </button>
                <span className="w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="w-full bg-secondary text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <ShoppingCart size={20} />
            Add to Cart
          </button>

          {/* Additional Info */}
          <div className="mt-8 border-t pt-8">
            <h3 className="font-bold mb-2">SKU:</h3>
            <p className="text-gray-600 mb-4">{product.sku}</p>
            <h3 className="font-bold mb-2">Category:</h3>
            <p className="text-gray-600">{product.category}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
