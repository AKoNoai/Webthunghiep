import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAdminAuthStore from '@/context/adminAuthStore';
import { Mail, Lock } from 'lucide-react';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAdminAuthStore();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-900 flex items-center justify-center px-4">
      <div className="bg-white/95 rounded-3xl border border-white/30 shadow-2xl p-8 max-w-md w-full backdrop-blur-sm">
        <h1 className="text-3xl font-extrabold text-center mb-2 text-slate-900">Admin Login</h1>
        <p className="text-center text-slate-600 mb-8">Secure control center access</p>

        {error && (
          <div className="bg-red-100 text-danger p-3 rounded-xl mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-700">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-600/30 focus:border-cyan-700"
                placeholder="admin@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-700">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-600/30 focus:border-cyan-700"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-2.5 rounded-xl font-bold hover:from-cyan-700 hover:to-blue-700 disabled:opacity-50 mt-6 shadow-lg shadow-cyan-900/30"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center mt-4 text-gray-600 text-sm">
          Demo: Use your registered admin email
        </p>
      </div>
    </div>
  );
}
