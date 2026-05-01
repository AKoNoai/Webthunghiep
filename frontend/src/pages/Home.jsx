import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '@/components/ProductCard';
import { productService } from '@/services/api';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await productService.getAllProducts({ limit: 6 });
        setFeaturedProducts(response.data.products);
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-800 via-teal-700 to-orange-600 text-white rounded-3xl p-8 sm:p-12 mb-12 shadow-2xl shadow-teal-900/30">
        <div className="absolute -top-16 -right-10 w-64 h-64 bg-white/15 rounded-full blur-2xl" />
        <div className="absolute -bottom-14 -left-14 w-56 h-56 bg-orange-300/20 rounded-full blur-2xl" />
        <div className="relative">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">Welcome to eCommerce</h1>
          <p className="text-lg sm:text-xl mb-6 text-teal-50">Discover curated products with cleaner design, smarter pricing, and faster checkout.</p>
          <Link to="/products" className="inline-flex items-center gap-2 bg-white text-teal-800 px-6 py-3 rounded-xl font-bold hover:bg-amber-50 shadow-lg">
          Shop Now <ArrowRight size={20} />
          </Link>
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-xl">
            <div className="bg-white/15 rounded-xl px-4 py-3">
              <p className="text-2xl font-extrabold">2K+</p>
              <p className="text-sm text-teal-50">Happy buyers</p>
            </div>
            <div className="bg-white/15 rounded-xl px-4 py-3">
              <p className="text-2xl font-extrabold">24h</p>
              <p className="text-sm text-teal-50">Support</p>
            </div>
            <div className="bg-white/15 rounded-xl px-4 py-3 col-span-2 sm:col-span-1">
              <p className="text-2xl font-extrabold">Fast</p>
              <p className="text-sm text-teal-50">Nationwide shipping</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section>
        <h2 className="text-3xl font-extrabold mb-8 text-slate-900">Featured Products</h2>
        {loading ? (
          <div className="text-center text-slate-600">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="mt-12 bg-white/80 border border-teal-900/10 rounded-3xl p-8 text-center shadow-lg backdrop-blur-sm">
        <h3 className="text-2xl font-extrabold mb-4">Need Help?</h3>
        <p className="text-slate-600 mb-6">Our AI chatbot is ready to support your shopping flow instantly.</p>
        <Link to="/chat" className="inline-block bg-gradient-to-r from-orange-600 to-amber-500 text-white px-6 py-3 rounded-xl font-bold hover:from-orange-700 hover:to-amber-600 shadow-lg shadow-orange-900/20">
          Start Chat
        </Link>
      </section>
    </div>
  );
}
