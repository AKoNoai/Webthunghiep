import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, BarChart3, Package, ShoppingCart, Users } from 'lucide-react';
import { useState } from 'react';
import useAdminAuthStore from '@/context/adminAuthStore';

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAdminAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/', icon: BarChart3, label: 'Dashboard' },
    { path: '/products', icon: Package, label: 'Products' },
    { path: '/orders', icon: ShoppingCart, label: 'Orders' },
    { path: '/users', icon: Users, label: 'Users' },
  ];

  return (
    <div className="flex h-screen bg-transparent">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-72' : 'w-20'} bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white transition-all duration-300 shadow-2xl shadow-slate-900/30`}>
        <div className="p-4 flex items-center justify-between border-b border-slate-700/80">
          {sidebarOpen && <h1 className="text-xl font-extrabold tracking-wide text-cyan-300">Admin Panel</h1>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-slate-700/70">
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <nav className="mt-8 space-y-2 px-2">
          {menuItems.map(({ path, icon: Icon, label }) => (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                location.pathname === path
                  ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/30'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Icon size={24} />
              {sidebarOpen && <span>{label}</span>}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white/85 backdrop-blur-md border-b border-slate-200">
          <div className="flex items-center justify-between px-6 py-4">
            <h2 className="text-2xl font-extrabold text-slate-900">
              {menuItems.find(m => m.path === location.pathname)?.label || 'Admin'}
            </h2>
            <div className="flex items-center gap-4">
              <span className="text-slate-600 font-semibold">{user?.fullName}</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold"
              >
                <LogOut size={20} />
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
