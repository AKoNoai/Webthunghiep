import { useEffect, useState } from 'react';
import { dashboardService, orderService, productService, userService } from '@/services/api';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Package, ShoppingCart, Users } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await dashboardService.getStats();
        setStats(response.data);
      } catch (error) {
        console.error('Failed to load stats:', error);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/90 border border-slate-200 rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-semibold">Total Users</p>
              <p className="text-3xl font-extrabold text-slate-900">{stats?.totalUsers || 0}</p>
            </div>
            <div className="p-3 rounded-xl bg-cyan-100 text-cyan-700"><Users size={34} /></div>
          </div>
        </div>

        <div className="bg-white/90 border border-slate-200 rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-semibold">Total Products</p>
              <p className="text-3xl font-extrabold text-slate-900">{stats?.totalProducts || 0}</p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-100 text-emerald-700"><Package size={34} /></div>
          </div>
        </div>

        <div className="bg-white/90 border border-slate-200 rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-semibold">Total Orders</p>
              <p className="text-3xl font-extrabold text-slate-900">{stats?.totalOrders || 0}</p>
            </div>
            <div className="p-3 rounded-xl bg-amber-100 text-amber-700"><ShoppingCart size={34} /></div>
          </div>
        </div>

        <div className="bg-white/90 border border-slate-200 rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-semibold">Total Revenue</p>
              <p className="text-3xl font-extrabold text-slate-900">${(stats?.totalRevenue || 0).toFixed(0)}</p>
            </div>
            <div className="p-3 rounded-xl bg-rose-100 text-rose-700"><TrendingUp size={34} /></div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Chart */}
        {stats?.monthlyRevenue && stats.monthlyRevenue.length > 0 && (
          <div className="bg-white/90 border border-slate-200 rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-extrabold mb-4 text-slate-900">Monthly Revenue</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id.month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#3B82F6" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Order Status Breakdown */}
        {stats?.orderStatusBreakdown && stats.orderStatusBreakdown.length > 0 && (
          <div className="bg-white/90 border border-slate-200 rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-extrabold mb-4 text-slate-900">Order Status Breakdown</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.orderStatusBreakdown}
                  dataKey="count"
                  nameKey="_id"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {stats.orderStatusBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Recent Orders */}
      {stats?.recentOrders && stats.recentOrders.length > 0 && (
        <div className="bg-white/90 border border-slate-200 rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h3 className="text-lg font-extrabold text-slate-900">Recent Orders</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-bold text-slate-700">Order Number</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-slate-700">Customer</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-slate-700">Amount</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-slate-700">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stats.recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-cyan-50/60">
                    <td className="px-6 py-4 text-sm text-slate-700">{order.orderNumber}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">{order.user?.fullName}</td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-900">${order.totalAmount.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-3 py-1 bg-cyan-100 text-cyan-800 rounded-full text-xs font-bold">
                        {order.orderStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
