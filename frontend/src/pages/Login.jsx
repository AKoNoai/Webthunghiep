import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '@/context/authStore';
import { Mail, Lock } from 'lucide-react';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuthStore();

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
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div className="bg-white/90 border border-slate-200 rounded-3xl shadow-2xl shadow-slate-900/10 p-8 backdrop-blur-sm">
        <h1 className="text-3xl font-extrabold text-center mb-2 text-slate-900">Welcome Back</h1>
        <p className="text-center text-slate-600 mb-8">Sign in to continue your shopping journey.</p>

        {error && <div className="bg-red-100 text-danger p-3 rounded-xl mb-4">{error}</div>}

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
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-700"
                placeholder="john@example.com"
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
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-700"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-teal-700 to-teal-600 text-white py-2.5 rounded-xl font-bold hover:from-teal-800 hover:to-teal-700 disabled:opacity-50 shadow-lg shadow-teal-900/20"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center mt-5 text-slate-600">
          Don't have an account? <Link to="/register" className="text-teal-700 font-semibold hover:underline">Register here</Link>
        </p>
      </div>
    </div>
  );
}
