import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Menu, X } from 'lucide-react';
import useAuthStore from '@/context/authStore';
import useCartStore from '@/context/cartStore';
import { useState } from 'react';

export default function Header() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { getTotalItems } = useCartStore();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-teal-900/10 bg-white/80 backdrop-blur-lg shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-teal-700 to-orange-600 text-transparent bg-clip-text">eCommerce</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-5">
            <Link to="/products" className="text-slate-700 font-semibold hover:text-teal-700">Products</Link>
            <Link to="/cart" className="relative text-slate-700 hover:text-teal-700">
              <ShoppingCart size={24} />
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link to="/profile" className="text-slate-700 hover:text-teal-700 flex items-center gap-2 font-semibold">
                  <User size={20} />
                  {user?.fullName}
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-slate-700 hover:text-red-600 flex items-center gap-2 font-semibold"
                >
                  <LogOut size={20} />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-teal-700 font-semibold hover:text-teal-800">Login</Link>
                <Link to="/register" className="bg-gradient-to-r from-teal-700 to-teal-600 text-white px-4 py-2 rounded-xl shadow-md shadow-teal-900/20 hover:from-teal-800 hover:to-teal-700">
                  Register
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-slate-700"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden pb-4 space-y-2 bg-white/90 border border-slate-200 rounded-2xl p-4 mb-4 shadow-lg">
            <Link to="/products" className="block py-2 text-slate-700 font-semibold hover:text-teal-700">Products</Link>
            <Link to="/cart" className="block py-2 text-slate-700 font-semibold hover:text-teal-700">Cart ({getTotalItems()})</Link>
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="block py-2 text-slate-700 font-semibold hover:text-teal-700">Profile</Link>
                <button onClick={handleLogout} className="block w-full text-left py-2 text-red-600 font-semibold">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="block py-2 text-teal-700 font-semibold">Login</Link>
                <Link to="/register" className="block py-2 text-teal-700 font-semibold">Register</Link>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
