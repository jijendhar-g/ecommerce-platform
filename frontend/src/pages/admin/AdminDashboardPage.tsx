import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import { useAppDispatch, useAppSelector } from '../../store'
import { fetchDashboardStats } from '../../store/slices/adminSlice'
import LoadingSpinner from '../../components/shared/LoadingSpinner'

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

export default function AdminDashboardPage() {
  const dispatch = useAppDispatch()
  const { stats, loading } = useAppSelector((state) => state.admin)

  useEffect(() => {
    dispatch(fetchDashboardStats())
  }, [dispatch])

  if (loading) return <LoadingSpinner />

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers ?? 0, icon: '👥', color: 'bg-indigo-500' },
    { label: 'Total Products', value: stats?.totalProducts ?? 0, icon: '📦', color: 'bg-green-500' },
    { label: 'Total Orders', value: stats?.totalOrders ?? 0, icon: '🛍', color: 'bg-yellow-500' },
    { label: 'Total Revenue', value: `$${(stats?.totalRevenue ?? 0).toFixed(2)}`, icon: '💰', color: 'bg-purple-500' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
        <div className="flex gap-3">
          <Link to="/admin/products" className="btn-primary px-4 py-2 text-sm">Manage Products</Link>
          <Link to="/admin/users" className="btn-secondary px-4 py-2 text-sm">Manage Users</Link>
          <Link to="/admin/orders" className="btn-secondary px-4 py-2 text-sm">Manage Orders</Link>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card) => (
          <div key={card.label} className="card p-6 flex items-center gap-4">
            <div className={`w-12 h-12 ${card.color} rounded-xl flex items-center justify-center text-2xl`}>
              {card.icon}
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{card.label}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue chart */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Revenue Over Time</h2>
          {stats?.revenueByMonth && stats.revenueByMonth.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={stats.revenueByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v: number) => [`$${v.toFixed(2)}`, 'Revenue']} />
                <Line type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-gray-400">No revenue data yet</div>
          )}
        </div>

        {/* Order status chart */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Orders by Status</h2>
          {stats?.ordersByStatus && stats.ordersByStatus.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={stats.ordersByStatus}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ status, percent }: { status: string; percent: number }) =>
                    `${status} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {stats.ordersByStatus.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-gray-400">No order data yet</div>
          )}
        </div>
      </div>
    </div>
  )
}
